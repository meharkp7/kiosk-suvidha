import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"

// Temporary in-memory store for meter readings (until DB migration)
const tempMeterReadings: any[] = []

@Injectable()
export class WaterService {
  private prisma = new PrismaClient()

  async getCurrentBill(accountNumber: string) {
    const account = await this.prisma.waterAccount.findUnique({
      where: { accountNumber },
    })

    if (!account) {
      throw new NotFoundException("Water account not found")
    }

    const bill = await this.prisma.waterBill.findFirst({
      where: {
        accountNumber,
        status: "UNPAID",
      },
      orderBy: {
        billingDate: "desc",
      },
    })

    if (!bill) {
      throw new NotFoundException("No unpaid water bill found")
    }

    // Calculate late fee if overdue
    const today = new Date()
    const dueDate = new Date(bill.dueDate)
    let lateFee = 0
    
    if (today > dueDate) {
      const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
      lateFee = Math.min(bill.totalAmount * 0.015 * Math.floor(daysOverdue / 7), bill.totalAmount * 0.08)
    }

    return {
      ...bill,
      lateFee,
      totalPayable: bill.totalAmount + lateFee,
      isOverdue: today > dueDate,
      daysOverdue: today > dueDate ? Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0,
      consumerName: account.consumerName,
      address: account.address,
      meterNumber: account.meterNumber,
    }
  }

  async getBillHistory(accountNumber: string, limit: number = 3) {
    const bills = await this.prisma.waterBill.findMany({
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
    const bill = await this.prisma.waterBill.findFirst({
      where: {
        accountNumber,
        status: "UNPAID",
      },
    })

    if (!bill) {
      throw new NotFoundException("No unpaid water bill available")
    }

    // Check for duplicate payment
    const existingPayment = await this.prisma.waterPayment.findFirst({
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
    await this.prisma.waterBill.update({
      where: { id: bill.id },
      data: { status: "PENDING_PAYMENT" },
    })

    try {
      const payment = await this.prisma.waterPayment.create({
        data: {
          accountNumber,
          billId: bill.id,
          amount: bill.totalAmount,
          reference: `WATR-PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          paymentMethod,
          status: "INITIATED",
          razorpayOrderId: razorpayDetails?.orderId,
          razorpayPaymentId: razorpayDetails?.paymentId,
          razorpaySignature: razorpayDetails?.signature,
        },
      })

      await this.prisma.waterBill.update({
        where: { id: bill.id },
        data: { 
          status: "PAID",
          paidDate: new Date(),
        },
      })

      await this.prisma.waterPayment.update({
        where: { id: payment.id },
        data: { status: "SUCCESS" },
      })

      return {
        message: "Water bill payment successful",
        billId: bill.id,
        amount: bill.totalAmount,
        reference: payment.reference,
        paymentId: payment.id,
      }
    } catch (error) {
      await this.prisma.waterBill.update({
        where: { id: bill.id },
        data: { status: "UNPAID" },
      })
      throw error
    }
  }

  async submitMeterReading(accountNumber: string, reading: number, photoUrl?: string) {
    const account = await this.prisma.waterAccount.findUnique({
      where: { accountNumber },
    })

    if (!account) {
      throw new NotFoundException("Water account not found")
    }

    const readingId = `WMR-${Date.now().toString(36).toUpperCase().slice(-6)}`

    // Store in temporary memory (replace with DB after migration)
    const meterReading = {
      id: readingId,
      accountNumber,
      reading,
      readingId,
      photoUrl: photoUrl || null,
      status: "SUBMITTED",
      submittedAt: new Date(),
    }
    tempMeterReadings.push(meterReading)

    return {
      message: "Meter reading submitted successfully",
      readingId: meterReading.readingId,
      reading: meterReading.reading,
      status: meterReading.status,
    }
  }

  async raiseComplaint(accountNumber: string, complaintType: string, subType: string, description?: string) {
    const priority = this.calculatePriority(complaintType, subType)
    const sla = this.calculateSLA(priority)
    const complaintId = `WATR-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

    return this.prisma.waterComplaint.create({
      data: {
        accountNumber,
        complaintType,
        subType,
        priority,
        complaintId,
        description: description || `Customer reported ${subType.toLowerCase()}`,
        status: "REGISTERED",
        estimatedResolution: new Date(Date.now() + sla.hours * 60 * 60 * 1000),
      },
    })
  }

  private calculatePriority(type: string, subType: string): string {
    const highPrioritySubTypes = ["No water supply", "Contaminated water", "Major leakage"]
    
    if (highPrioritySubTypes.some(h => subType.toLowerCase().includes(h.toLowerCase()))) {
      return "HIGH"
    }
    return "NORMAL"
  }

  private calculateSLA(priority: string): { hours: number } {
    const slaMap: Record<string, number> = {
      "HIGH": 24,
      "NORMAL": 72,
    }
    return { hours: slaMap[priority] || 72 }
  }

  async getComplaintStatus(complaintId: string) {
    const complaint = await this.prisma.waterComplaint.findUnique({
      where: { complaintId },
    })

    if (!complaint) {
      throw new NotFoundException("Complaint not found")
    }

    const now = new Date()
    const created = new Date(complaint.createdAt)
    const estimated = new Date(complaint.estimatedResolution || Date.now())
    
    const totalDuration = estimated.getTime() - created.getTime()
    const elapsed = now.getTime() - created.getTime()
    const slaProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))

    return {
      ...complaint,
      slaProgress: Math.round(slaProgress),
      isOverdue: now > estimated && complaint.status !== "RESOLVED",
    }
  }

  async getAllComplaints(accountNumber: string) {
    const complaints = await this.prisma.waterComplaint.findMany({
      where: { accountNumber },
      orderBy: { createdAt: "desc" },
    })
    return complaints
  }

  async createTransferRequest(accountNumber: string, newAddress?: string) {
    const account = await this.prisma.waterAccount.findUnique({
      where: { accountNumber },
    })

    if (!account) {
      throw new NotFoundException("Account not found")
    }

    const existingRequest = await this.prisma.waterTransferRequest.findFirst({
      where: {
        accountNumber,
        status: { in: ["REQUESTED", "DOCUMENT_PENDING", "APPROVED"] },
      },
    })

    if (existingRequest) {
      throw new BadRequestException("Active transfer request already exists")
    }

    const requestId = `WATR-TRF-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

    return this.prisma.waterTransferRequest.create({
      data: {
        accountNumber,
        requestId,
        newAddress: newAddress || null,
        status: "REQUESTED",
      },
    })
  }

  async getTransferStatus(requestId: string) {
    const request = await this.prisma.waterTransferRequest.findUnique({
      where: { requestId },
      include: {
        account: true,
      },
    })

    if (!request) {
      throw new NotFoundException("Transfer request not found")
    }

    return {
      ...request,
      nextSteps: this.getNextSteps(request.status, request.documentSubmitted),
    }
  }

  private getNextSteps(status: string, documentSubmitted: boolean): string[] {
    const steps: Record<string, string[]> = {
      "REQUESTED": documentSubmitted ? ["Documents under review", "Wait for approval"] : ["Submit required documents", "Upload address proof"],
      "DOCUMENT_PENDING": ["Submit remaining documents", "Wait for document verification"],
      "APPROVED": ["Transfer process initiated", "New connection will be activated within 7 days"],
      "REJECTED": ["Contact customer care for details", "Reapply with correct documents"],
    }
    return steps[status] || ["Contact customer care"]
  }

  // Name Change Request
  async createNameChangeRequest(accountNumber: string, newName: string, reason?: string) {
    const account = await this.prisma.waterAccount.findUnique({
      where: { accountNumber },
    })
    if (!account) {
      throw new NotFoundException("Account not found")
    }

    const requestId = `WATR-NMCH-${Date.now().toString(36).toUpperCase().slice(-6)}`
    
    return this.prisma.waterNameChangeRequest.create({
      data: {
        requestId,
        accountNumber,
        oldName: account.consumerName,
        newName,
        reason: reason || "Customer requested name change",
        status: "SUBMITTED",
        estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    })
  }

  // New Connection Request
  async createNewConnectionRequest(data: {
    applicantName: string
    mobileNumber: string
    email?: string
    address: string
    propertyType: string
    connectionType: string
  }) {
    const requestId = `WATR-NEWCONN-${Date.now().toString(36).toUpperCase().slice(-6)}`
    
    return this.prisma.waterNewConnectionRequest.create({
      data: {
        requestId,
        ...data,
        status: "SUBMITTED",
        estimatedCompletion: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      }
    })
  }

  // Sewerage Request
  async createSewerageRequest(accountNumber: string, requestType: string, description: string) {
    const account = await this.prisma.waterAccount.findUnique({
      where: { accountNumber },
    })
    if (!account) {
      throw new NotFoundException("Account not found")
    }

    const requestId = `WATR-SEW-${Date.now().toString(36).toUpperCase().slice(-6)}`
    
    return this.prisma.waterSewerageRequest.create({
      data: {
        requestId,
        accountNumber,
        requestType,
        description,
        status: "SUBMITTED",
        estimatedCompletion: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      }
    })
  }

  // Get all requests for an account
  async getAllNameChangeRequests(accountNumber: string) {
    return this.prisma.waterNameChangeRequest.findMany({
      where: { accountNumber },
      orderBy: { createdAt: "desc" },
    })
  }

  async getAllSewerageRequests(accountNumber: string) {
    return this.prisma.waterSewerageRequest.findMany({
      where: { accountNumber },
      orderBy: { createdAt: "desc" },
    })
  }
}
