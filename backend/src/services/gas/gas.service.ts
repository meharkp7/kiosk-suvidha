import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"

@Injectable()
export class GasService {
  private prisma = new PrismaClient()

  // ============================================
  // ACCOUNT & BOOKING MANAGEMENT
  // ============================================

  async getAccountDetails(consumerNumber: string) {
    const account = await this.prisma.gasAccount.findUnique({
      where: { consumerNumber },
      include: {
        bookings: {
          orderBy: { bookingDate: "desc" },
          take: 5,
        },
      },
    })

    if (!account) {
      throw new NotFoundException("Gas account not found")
    }

    // Get current subsidy rate
    const subsidyAmount = account.subsidyStatus === "ACTIVE" ? 200 : 0
    const cylinderPrice = 900

    return {
      ...account,
      cylinderPrice,
      subsidyAmount,
      netPrice: cylinderPrice - subsidyAmount,
      lastBooking: account.bookings[0] || null,
    }
  }

  async bookCylinder(consumerNumber: string, quantity: number = 1) {
    const account = await this.prisma.gasAccount.findUnique({
      where: { consumerNumber },
    })

    if (!account) {
      throw new NotFoundException("Gas account not found")
    }

    // Check for pending bookings
    const pendingBooking = await this.prisma.gasBooking.findFirst({
      where: {
        consumerNumber,
        status: { in: ["BOOKED", "CONFIRMED", "OUT_FOR_DELIVERY"] },
      },
    })

    if (pendingBooking) {
      throw new BadRequestException("Cylinder already booked and pending delivery")
    }

    const cylinderPrice = 900
    const subsidyAmount = account.subsidyStatus === "ACTIVE" ? 200 * quantity : 0
    const totalAmount = cylinderPrice * quantity
    const netAmount = totalAmount - subsidyAmount

    const bookingId = `BK-${Date.now().toString(36).toUpperCase().slice(-8)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

    const booking = await this.prisma.gasBooking.create({
      data: {
        consumerNumber,
        bookingId,
        cylinderType: "14.2KG",
        quantity,
        amount: totalAmount,
        subsidyAmount,
        netAmount,
        status: "BOOKED",
        paymentStatus: "PENDING",
      },
    })

    return {
      ...booking,
      distributorName: account.distributorName,
      distributorCode: account.distributorCode,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    }
  }

  async getBookingStatus(bookingId: string) {
    const booking = await this.prisma.gasBooking.findUnique({
      where: { bookingId },
      include: {
        account: true,
      },
    })

    if (!booking) {
      throw new NotFoundException("Booking not found")
    }

    // Status timeline
    const timeline = [
      { status: "BOOKED", timestamp: booking.bookingDate, completed: true },
      { status: "CONFIRMED", timestamp: booking.status === "CONFIRMED" || booking.status === "OUT_FOR_DELIVERY" || booking.status === "DELIVERED" ? new Date(booking.bookingDate.getTime() + 2 * 60 * 60 * 1000) : null, completed: ["CONFIRMED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(booking.status) },
      { status: "OUT_FOR_DELIVERY", timestamp: booking.status === "OUT_FOR_DELIVERY" || booking.status === "DELIVERED" ? booking.deliveryDate : null, completed: ["OUT_FOR_DELIVERY", "DELIVERED"].includes(booking.status) },
      { status: "DELIVERED", timestamp: booking.deliveredAt, completed: booking.status === "DELIVERED" },
    ]

    return {
      ...booking,
      timeline,
      canCancel: booking.status === "BOOKED" || booking.status === "CONFIRMED",
    }
  }

  async getBookingHistory(consumerNumber: string, limit: number = 5) {
    const bookings = await this.prisma.gasBooking.findMany({
      where: { consumerNumber },
      orderBy: { bookingDate: "desc" },
      take: limit,
    })

    return bookings.map(booking => ({
      ...booking,
      badge: booking.status === "DELIVERED" ? "DELIVERED" : booking.status,
    }))
  }

  // ============================================
  // COMPLAINT MANAGEMENT
  // ============================================

  async raiseComplaint(
    consumerNumber: string,
    complaintType: string,
    subType: string,
    bookingId?: string,
    description?: string,
  ) {
    const account = await this.prisma.gasAccount.findUnique({
      where: { consumerNumber },
    })

    if (!account) {
      throw new NotFoundException("Gas account not found")
    }

    const priority = this.calculatePriority(complaintType, subType)
    const complaintId = `GAS-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

    return this.prisma.gasComplaint.create({
      data: {
        consumerNumber,
        complaintId,
        complaintType,
        subType,
        bookingId: bookingId || null,
        description: description || `Customer reported ${subType.toLowerCase()}`,
        priority,
        status: "REGISTERED",
      },
    })
  }

  private calculatePriority(type: string, subType: string): string {
    const highPrioritySubTypes = ["Leaking cylinder", "Major leak", "Fire hazard"]
    
    if (highPrioritySubTypes.some(h => subType.toLowerCase().includes(h.toLowerCase()))) {
      return "HIGH"
    }
    if (type === "Cylinder Issue") {
      return "NORMAL"
    }
    return "LOW"
  }

  async getComplaintStatus(complaintId: string) {
    const complaint = await this.prisma.gasComplaint.findUnique({
      where: { complaintId },
    })

    if (!complaint) {
      throw new NotFoundException("Complaint not found")
    }

    return complaint
  }

  // ============================================
  // TRANSFER MANAGEMENT
  // ============================================

  async createTransferRequest(consumerNumber: string, newDistributorCode: string) {
    const account = await this.prisma.gasAccount.findUnique({
      where: { consumerNumber },
    })

    if (!account) {
      throw new NotFoundException("Gas account not found")
    }

    // Check for existing active transfer
    const existingTransfer = await this.prisma.gasTransferRequest.findFirst({
      where: {
        consumerNumber,
        status: { in: ["REQUESTED", "DOCUMENT_SUBMITTED", "APPROVED"] },
      },
    })

    if (existingTransfer) {
      throw new BadRequestException("Active transfer request already exists")
    }

    const requestId = `GAS-TRF-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

    return this.prisma.gasTransferRequest.create({
      data: {
        consumerNumber,
        requestId,
        newDistributorCode,
        status: "REQUESTED",
        documentSubmitted: false,
      },
    })
  }

  async getTransferStatus(requestId: string) {
    const request = await this.prisma.gasTransferRequest.findUnique({
      where: { requestId },
      include: {
        account: true,
      },
    })

    if (!request) {
      throw new NotFoundException("Transfer request not found")
    }

    return request
  }
}
