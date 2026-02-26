import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"

@Injectable()
export class ElectricityService {
  private prisma = new PrismaClient()

  // ============================================
  // BILL MANAGEMENT
  // ============================================

  async getCurrentBill(accountNumber: string) {
    const account = await this.prisma.electricityAccount.findUnique({
      where: { accountNumber },
    })

    if (!account) {
      throw new NotFoundException("Account not found")
    }

    const bill = await this.prisma.electricityBill.findFirst({
      where: {
        accountNumber,
        status: "UNPAID",
      },
      orderBy: {
        billingDate: "desc",
      },
    })

    if (!bill) {
      throw new NotFoundException("No unpaid bill found")
    }

    // Calculate late fee if overdue
    const today = new Date()
    const dueDate = new Date(bill.dueDate)
    let lateFee = 0
    
    if (today > dueDate) {
      const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
      lateFee = Math.min(bill.totalAmount * 0.02 * Math.floor(daysOverdue / 7), bill.totalAmount * 0.1)
    }

    // Get tariff breakdown
    const tariffBreakdown = this.calculateTariffBreakdown(bill.unitsConsumed)

    return {
      ...bill,
      lateFee,
      totalPayable: bill.totalAmount + lateFee,
      isOverdue: today > dueDate,
      daysOverdue: today > dueDate ? Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0,
      tariffBreakdown,
      consumerName: account.consumerName,
      address: account.address,
      meterNumber: account.meterNumber,
    }
  }

  private calculateTariffBreakdown(units: number) {
    const slabs = [
      { limit: 100, rate: 4.5 },
      { limit: 200, rate: 6.5 },
      { limit: 400, rate: 8.0 },
      { limit: Infinity, rate: 10.0 },
    ]

    let remainingUnits = units
    let totalEnergyCharge = 0
    const breakdown = []

    for (const slab of slabs) {
      if (remainingUnits <= 0) break
      
      const unitsInSlab = Math.min(remainingUnits, slab.limit - (breakdown.length > 0 ? slabs[breakdown.length - 1]?.limit || 0 : 0))
      const charge = unitsInSlab * slab.rate
      
      breakdown.push({
        slab: `${breakdown.length === 0 ? '0' : slabs[breakdown.length - 1]?.limit || 0}-${slab.limit === Infinity ? 'Above' : slab.limit}`,
        units: unitsInSlab,
        rate: slab.rate,
        charge: charge,
      })
      
      totalEnergyCharge += charge
      remainingUnits -= unitsInSlab
    }

    return { breakdown, totalEnergyCharge }
  }

  async getBillHistory(accountNumber: string, limit: number = 3) {
    const bills = await this.prisma.electricityBill.findMany({
      where: { accountNumber },
      orderBy: { billingDate: "desc" },
      take: limit,
    })

    return bills.map(bill => ({
      ...bill,
      badge: bill.status === "PAID" ? "PAID" : bill.status === "UNPAID" && new Date() > new Date(bill.dueDate) ? "OVERDUE" : "UNPAID",
    }))
  }

  async payBill(accountNumber: string, paymentMethod: string = "RAZORPAY", razorpayDetails?: any) {
    const bill = await this.prisma.electricityBill.findFirst({
      where: {
        accountNumber,
        status: "UNPAID",
      },
    })

    if (!bill) {
      throw new NotFoundException("No unpaid bill available")
    }

    // Check for duplicate payment (prevent double payment)
    const existingPayment = await this.prisma.electricityPayment.findFirst({
      where: {
        accountNumber,
        billId: bill.id,
        status: "SUCCESS",
      },
    })

    if (existingPayment) {
      throw new BadRequestException("Bill already paid")
    }

    // Lock bill during transaction
    await this.prisma.electricityBill.update({
      where: { id: bill.id },
      data: { status: "PENDING_PAYMENT" },
    })

    try {
      // Create payment record
      const payment = await this.prisma.electricityPayment.create({
        data: {
          accountNumber,
          billId: bill.id,
          amount: bill.totalAmount,
          reference: `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          paymentMethod,
          status: "INITIATED",
          razorpayOrderId: razorpayDetails?.orderId,
          razorpayPaymentId: razorpayDetails?.paymentId,
          razorpaySignature: razorpayDetails?.signature,
        },
      })

      // Update bill status
      await this.prisma.electricityBill.update({
        where: { id: bill.id },
        data: { 
          status: "PAID",
          paidDate: new Date(),
        },
      })

      // Update payment status
      await this.prisma.electricityPayment.update({
        where: { id: payment.id },
        data: { status: "SUCCESS" },
      })

      return {
        message: "Payment successful",
        billId: bill.id,
        amount: bill.totalAmount,
        reference: payment.reference,
        paymentId: payment.id,
      }
    } catch (error) {
      // Revert bill status on error
      await this.prisma.electricityBill.update({
        where: { id: bill.id },
        data: { status: "UNPAID" },
      })
      throw error
    }
  }

  async getPaymentReceipt(paymentId: string) {
    const payment = await this.prisma.electricityPayment.findUnique({
      where: { id: paymentId },
      include: {
        account: true,
      },
    })

    if (!payment || payment.status !== "SUCCESS") {
      throw new NotFoundException("Payment receipt not found")
    }

    return {
      transactionReference: payment.reference,
      paymentDate: payment.createdAt,
      consumerName: payment.account.consumerName,
      accountNumber: payment.accountNumber,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      razorpayPaymentId: payment.razorpayPaymentId,
      receiptUrl: payment.receiptUrl,
    }
  }

  async raiseComplaint(
    accountNumber: string,
    complaintType: string,
    subType: string,
    description?: string,
  ) {
    // Auto-calculate priority based on complaint type and sub-type
    const priority = this.calculatePriority(complaintType, subType)
    
    // Calculate SLA based on priority
    const sla = this.calculateSLA(priority)
    
    // Generate unique complaint ID
    const complaintId = `ELEC-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

    // Calculate estimated resolution time
    const estimatedResolution = new Date(Date.now() + sla.hours * 60 * 60 * 1000)

    return this.prisma.electricityComplaint.create({
      data: {
        accountNumber,
        complaintType,
        subType,
        priority,
        complaintId,
        description: description || `Customer reported ${subType.toLowerCase()}`,
        status: "REGISTERED",
        estimatedResolution,
        escalationLevel: 0,
      },
    })
  }

  private calculatePriority(type: string, subType: string): string {
    const highPrioritySubTypes = ["No supply", "Spark in meter", "Transformer issue", "Frequent outage"]
    const urgentSubTypes = ["Safety Hazard", "Fire risk", "Electrocution risk"]
    
    if (urgentSubTypes.some(u => subType.toLowerCase().includes(u.toLowerCase()))) {
      return "URGENT"
    }
    if (highPrioritySubTypes.some(h => subType.toLowerCase().includes(h.toLowerCase()))) {
      return "HIGH"
    }
    if (type === "Safety Hazard") {
      return "HIGH"
    }
    return "NORMAL"
  }

  private calculateSLA(priority: string): { hours: number } {
    const slaMap: Record<string, number> = {
      "URGENT": 4,      // 4 hours
      "HIGH": 24,       // 24 hours
      "NORMAL": 72,     // 72 hours (3 days)
      "LOW": 168,       // 168 hours (7 days)
    }
    return { hours: slaMap[priority] || 72 }
  }

  async getComplaintStatus(complaintId: string) {
    const complaint = await this.prisma.electricityComplaint.findUnique({
      where: { complaintId },
    })

    if (!complaint) {
      throw new NotFoundException("Complaint not found")
    }

    // Calculate SLA progress
    const now = new Date()
    const created = new Date(complaint.createdAt)
    const estimated = new Date(complaint.estimatedResolution || Date.now())
    
    const totalDuration = estimated.getTime() - created.getTime()
    const elapsed = now.getTime() - created.getTime()
    const slaProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))

    // Status lifecycle timeline
    const timeline = [
      { status: "REGISTERED", timestamp: complaint.createdAt, completed: true },
      { status: "ASSIGNED", timestamp: complaint.assignedTo ? complaint.updatedAt : null, completed: !!complaint.assignedTo },
      { status: "IN_PROGRESS", timestamp: complaint.status === "IN_PROGRESS" ? complaint.updatedAt : null, completed: complaint.status === "IN_PROGRESS" || complaint.status === "RESOLVED" },
      { status: "RESOLVED", timestamp: complaint.resolvedAt, completed: complaint.status === "RESOLVED" },
    ]

    return {
      ...complaint,
      slaProgress: Math.round(slaProgress),
      isOverdue: now > estimated && complaint.status !== "RESOLVED",
      timeline,
    }
  }

  async getLatestComplaint(accountNumber: string) {
    const complaint = await this.prisma.electricityComplaint.findFirst({
      where: { accountNumber },
      orderBy: { createdAt: "desc" },
    })

    if (!complaint) {
      throw new NotFoundException("No complaints found")
    }

    return complaint
  }

  async escalateComplaint(complaintId: string) {
    const complaint = await this.prisma.electricityComplaint.findUnique({
      where: { complaintId },
    })

    if (!complaint) {
      throw new NotFoundException("Complaint not found")
    }

    const newEscalationLevel = complaint.escalationLevel + 1
    
    // Recalculate SLA with escalation
    const escalationSLA: Record<number, number> = {
      0: 72,   // Normal
      1: 48,   // Escalated once
      2: 24,   // Escalated twice
      3: 4,    // Highly escalated
    }
    
    const newSLA = escalationSLA[newEscalationLevel] || 4
    const newEstimatedResolution = new Date(Date.now() + newSLA * 60 * 60 * 1000)

    return this.prisma.electricityComplaint.update({
      where: { complaintId },
      data: {
        escalationLevel: newEscalationLevel,
        estimatedResolution: newEstimatedResolution,
        status: newEscalationLevel > 2 ? "ESCALATED" : complaint.status,
      },
    })
  }

  async createTransferRequest(accountNumber: string, newAddress?: string) {
    const account = await this.prisma.electricityAccount.findUnique({
      where: { accountNumber },
    })

    if (!account) {
      throw new NotFoundException("Account not found")
    }

    // Check for existing active transfer request
    const existingRequest = await this.prisma.electricityTransferRequest.findFirst({
      where: {
        accountNumber,
        status: { in: ["REQUESTED", "DOCUMENT_PENDING", "APPROVED"] },
      },
    })

    if (existingRequest) {
      throw new BadRequestException("Active transfer request already exists")
    }

    const requestId = `TRF-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

    return this.prisma.electricityTransferRequest.create({
      data: {
        accountNumber,
        requestId,
        newAddress: newAddress || null,
        status: "REQUESTED",
        documentSubmitted: false,
        officeVisitRequired: false,
      },
    })
  }

  async getTransferStatus(requestId: string) {
    const request = await this.prisma.electricityTransferRequest.findUnique({
      where: { requestId },
      include: {
        account: true,
      },
    })

    if (!request) {
      throw new NotFoundException("Transfer request not found")
    }

    // Status timeline
    const timeline = [
      { status: "REQUESTED", timestamp: request.createdAt, completed: true },
      { status: "DOCUMENT_PENDING", timestamp: request.documentSubmitted ? request.updatedAt : null, completed: request.documentSubmitted },
      { status: "APPROVED", timestamp: request.approvedAt, completed: request.status === "APPROVED" },
      { status: "REJECTED", timestamp: request.status === "REJECTED" ? request.updatedAt : null, completed: request.status === "REJECTED" },
    ]

    return {
      ...request,
      timeline,
      nextSteps: this.getNextSteps(request.status, request.documentSubmitted, request.officeVisitRequired),
    }
  }

  private getNextSteps(status: string, documentSubmitted: boolean, officeVisitRequired: boolean): string[] {
    const steps: Record<string, string[]> = {
      "REQUESTED": documentSubmitted ? ["Documents under review", "Wait for approval"] : ["Submit required documents", "Upload address proof"],
      "DOCUMENT_PENDING": ["Submit remaining documents", "Wait for document verification"],
      "APPROVED": ["Transfer process initiated", "New connection will be activated within 7 days"],
      "REJECTED": ["Contact customer care for details", "Reapply with correct documents"],
    }
    return steps[status] || ["Contact customer care"]
  }

  async updateTransferRequest(requestId: string, updates: any) {
    return this.prisma.electricityTransferRequest.update({
      where: { requestId },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    })
  }
}