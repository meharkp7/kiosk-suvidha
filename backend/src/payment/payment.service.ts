import { Injectable, BadRequestException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PrismaClient } from "@prisma/client"
import * as crypto from "crypto"

@Injectable()
export class PaymentService {
  private prisma = new PrismaClient()
  private razorpay: any

  constructor(private configService: ConfigService) {
    // Initialize Razorpay with environment variables
    const Razorpay = require("razorpay")
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>("RAZORPAY_KEY_ID") || "rzp_test_key",
      key_secret: this.configService.get<string>("RAZORPAY_KEY_SECRET") || "rzp_test_secret",
    })
  }

  // ============================================
  // RAZORPAY ORDER CREATION
  // ============================================

  async createOrder(amount: number, currency: string = "INR", receipt?: string) {
    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1,
    }

    try {
      const order = await this.razorpay.orders.create(options)
      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      }
    } catch (error) {
      throw new BadRequestException("Failed to create Razorpay order")
    }
  }

  // ============================================
  // SIGNATURE VERIFICATION
  // ============================================

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    const secret = this.configService.get<string>("RAZORPAY_KEY_SECRET") || "rzp_test_secret"
    const body = orderId + "|" + paymentId
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex")
    
    return expectedSignature === signature
  }

  // ============================================
  // PAYMENT PROCESSING
  // ============================================

  async processPayment(
    department: string,
    accountNumber: string,
    billId: string,
    amount: number,
    razorpayDetails: {
      orderId: string
      paymentId: string
      signature: string
    },
  ) {
    // Verify signature
    const isValid = this.verifySignature(
      razorpayDetails.orderId,
      razorpayDetails.paymentId,
      razorpayDetails.signature,
    )

    if (!isValid) {
      throw new BadRequestException("Invalid payment signature")
    }

    // Process based on department
    switch (department) {
      case "electricity":
        return this.processElectricityPayment(accountNumber, billId, amount, razorpayDetails)
      case "water":
        return this.processWaterPayment(accountNumber, billId, amount, razorpayDetails)
      default:
        throw new BadRequestException("Invalid department")
    }
  }

  private async processElectricityPayment(
    accountNumber: string,
    billId: string,
    amount: number,
    razorpayDetails: any,
  ) {
    const bill = await this.prisma.electricityBill.findFirst({
      where: { id: billId, accountNumber, status: "UNPAID" },
    })

    if (!bill) {
      throw new BadRequestException("Bill not found or already paid")
    }

    // Create payment record
    const payment = await this.prisma.electricityPayment.create({
      data: {
        accountNumber,
        billId,
        amount,
        reference: `RAZORPAY-${Date.now()}`,
        paymentMethod: "RAZORPAY",
        status: "SUCCESS",
        razorpayOrderId: razorpayDetails.orderId,
        razorpayPaymentId: razorpayDetails.paymentId,
        razorpaySignature: razorpayDetails.signature,
      },
    })

    // Update bill status
    await this.prisma.electricityBill.update({
      where: { id: billId },
      data: { status: "PAID", paidDate: new Date() },
    })

    return {
      success: true,
      paymentId: payment.id,
      reference: payment.reference,
      amount,
    }
  }

  private async processWaterPayment(
    accountNumber: string,
    billId: string,
    amount: number,
    razorpayDetails: any,
  ) {
    const bill = await this.prisma.waterBill.findFirst({
      where: { id: billId, accountNumber, status: "UNPAID" },
    })

    if (!bill) {
      throw new BadRequestException("Bill not found or already paid")
    }

    const payment = await this.prisma.waterPayment.create({
      data: {
        accountNumber,
        billId,
        amount,
        reference: `RAZORPAY-WATR-${Date.now()}`,
        paymentMethod: "RAZORPAY",
        status: "SUCCESS",
        razorpayOrderId: razorpayDetails.orderId,
        razorpayPaymentId: razorpayDetails.paymentId,
        razorpaySignature: razorpayDetails.signature,
      },
    })

    await this.prisma.waterBill.update({
      where: { id: billId },
      data: { status: "PAID", paidDate: new Date() },
    })

    return {
      success: true,
      paymentId: payment.id,
      reference: payment.reference,
      amount,
    }
  }

  // ============================================
  // WEBHOOK HANDLER
  // ============================================

  async handleWebhook(payload: any, signature: string) {
    const secret = this.configService.get<string>("RAZORPAY_WEBHOOK_SECRET")
    
    if (secret) {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(JSON.stringify(payload))
        .digest("hex")
      
      if (expectedSignature !== signature) {
        throw new BadRequestException("Invalid webhook signature")
      }
    }

    // Process webhook event
    if (payload.event === "payment.captured") {
      // Update payment status
      const payment = payload.payload.payment.entity
      
      // Find and update payment record
      await this.updatePaymentStatus(payment.order_id, payment.id, "SUCCESS")
    }

    return { received: true }
  }

  private async updatePaymentStatus(orderId: string, paymentId: string, status: string) {
    // Try electricity payments
    const elecPayment = await this.prisma.electricityPayment.findFirst({
      where: { razorpayOrderId: orderId },
    })

    if (elecPayment) {
      await this.prisma.electricityPayment.update({
        where: { id: elecPayment.id },
        data: { status, razorpayPaymentId: paymentId },
      })
      return
    }

    // Try water payments
    const waterPayment = await this.prisma.waterPayment.findFirst({
      where: { razorpayOrderId: orderId },
    })

    if (waterPayment) {
      await this.prisma.waterPayment.update({
        where: { id: waterPayment.id },
        data: { status, razorpayPaymentId: paymentId },
      })
    }
  }
}
