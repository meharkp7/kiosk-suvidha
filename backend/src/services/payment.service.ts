const Razorpay = require('razorpay')
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Check if Razorpay credentials are configured
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET
const isRazorpayConfigured = RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET && 
  !RAZORPAY_KEY_ID.includes('test_1234567890') && !RAZORPAY_KEY_SECRET.includes('test_secret')

// Initialize Razorpay only if configured
let razorpay: any = null
if (isRazorpayConfigured) {
  try {
    razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    })
    console.log('✅ Razorpay initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize Razorpay:', error)
  }
} else {
  console.log('⚠️ Razorpay not configured - using DEMO mode')
}

export interface PaymentRequest {
  amount: number
  accountNumber: string
  department: string
  billId?: string
  challanId?: string
  bookingId?: string
}

export class PaymentService {
  static async createOrder(paymentRequest: PaymentRequest): Promise<any> {
    try {
      const { amount, accountNumber, department, billId, challanId, bookingId } = paymentRequest

      // Generate order ID (use Razorpay if configured, otherwise DEMO mode)
      const orderId = razorpay 
        ? (await razorpay.orders.create({
            amount: amount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1,
            notes: { accountNumber, department, billId: billId || '', challanId: challanId || '', bookingId: bookingId || '' }
          })).id
        : `demo_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Store payment record in database
      let paymentRecord: any = {
        accountNumber,
        amount,
        reference: orderId,
        paymentMethod: razorpay ? 'RAZORPAY' : 'DEMO',
        status: 'INITIATED',
        razorpayOrderId: orderId
      }

      // Store in appropriate payment table based on department
      switch (department) {
        case 'electricity':
          await prisma.electricityPayment.create({
            data: {
              ...paymentRecord,
              billId: billId || null
            }
          })
          break
        case 'water':
          await prisma.waterPayment.create({
            data: {
              ...paymentRecord,
              billId: billId || null
            }
          })
          break
        case 'transport':
          if (challanId) {
            await prisma.challan.update({
              where: { id: challanId },
              data: { paymentReference: orderId }
            })
          }
          break
        case 'gas':
          if (bookingId) {
            await prisma.gasBooking.update({
              where: { id: bookingId },
              data: { paymentStatus: 'PROCESSING' }
            })
          }
          break
        case 'municipal':
          break
      }

      return {
        success: true,
        order: {
          id: orderId,
          amount: amount * 100,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`
        },
        key: RAZORPAY_KEY_ID || 'rzp_test_demo',
        demo: !razorpay // Flag to indicate demo mode
      }
    } catch (error) {
      console.error('Payment order creation failed:', error)
      throw new Error('Failed to create payment order')
    }
  }

  static async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<any> {
    try {
      let isValid = false
      let payment: any = null

      if (razorpay && !razorpayOrderId.startsWith('demo_order_')) {
        // Real Razorpay verification
        const crypto = require('crypto')
        const generatedSignature = crypto
          .createHmac('sha256', RAZORPAY_KEY_SECRET || '')
          .update(razorpayOrderId + '|' + razorpayPaymentId)
          .digest('hex')

        isValid = generatedSignature === razorpaySignature

        if (isValid) {
          payment = await razorpay.payments.fetch(razorpayPaymentId)
          isValid = payment.status === 'captured'
        }
      } else {
        // DEMO mode - auto-accept payment
        console.log('🎮 DEMO MODE: Auto-accepting payment')
        isValid = true
        payment = { status: 'captured', id: razorpayPaymentId }
      }

      if (!isValid) {
        throw new Error('Invalid payment signature')
      }

      // Update payment record in database
      const updatedPayment = await this.updatePaymentStatus(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        'SUCCESS'
      )

      return {
        success: true,
        payment: updatedPayment,
        demo: !razorpay || razorpayOrderId.startsWith('demo_order_'),
        receiptUrl: null
      }
    } catch (error) {
      console.error('Payment verification failed:', error)
      
      // Update payment status to FAILED
      await this.updatePaymentStatus(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        'FAILED'
      )
      
      throw new Error('Payment verification failed')
    }
  }

  private static async updatePaymentStatus(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    status: string
  ): Promise<any> {
    try {
      // Update in all possible payment tables (we'll find the right one)
      let updatedPayment = null

      // Try electricity payments
      const electricityPayment = await prisma.electricityPayment.findFirst({
        where: { razorpayOrderId }
      })
      if (electricityPayment) {
        updatedPayment = await prisma.electricityPayment.update({
          where: { id: electricityPayment.id },
          data: {
            status,
            razorpayPaymentId,
            razorpaySignature,
            updatedAt: new Date()
          }
        })

        // Update bill status if payment is successful
        if (status === 'SUCCESS' && electricityPayment.billId) {
          await prisma.electricityBill.update({
            where: { id: electricityPayment.billId },
            data: {
              status: 'PAID',
              paidDate: new Date()
            }
          })
        }
      }

      // Try water payments
      const waterPayment = await prisma.waterPayment.findFirst({
        where: { razorpayOrderId }
      })
      if (waterPayment) {
        updatedPayment = await prisma.waterPayment.update({
          where: { id: waterPayment.id },
          data: {
            status,
            razorpayPaymentId,
            razorpaySignature,
            updatedAt: new Date()
          }
        })

        // Update bill status if payment is successful
        if (status === 'SUCCESS' && waterPayment.billId) {
          await prisma.waterBill.update({
            where: { id: waterPayment.billId },
            data: {
              status: 'PAID',
              paidDate: new Date()
            }
          })
        }
      }

      // Try transport challans
      const challan = await prisma.challan.findFirst({
        where: { paymentReference: razorpayOrderId }
      })
      if (challan && status === 'SUCCESS') {
        updatedPayment = await prisma.challan.update({
          where: { id: challan.id },
          data: {
            status: 'PAID',
            paidDate: new Date()
          }
        })
      }

      // Try gas bookings
      const gasBooking = await prisma.gasBooking.findFirst({
        where: { bookingId: razorpayOrderId }
      })
      if (gasBooking && status === 'SUCCESS') {
        updatedPayment = await prisma.gasBooking.update({
          where: { id: gasBooking.id },
          data: {
            paymentStatus: 'PAID'
          }
        })
      }

      return updatedPayment
    } catch (error) {
      console.error('Failed to update payment status:', error)
      throw error
    }
  }

  static async getPaymentHistory(accountNumber: string, department: string): Promise<any[]> {
    try {
      let payments = []

      switch (department) {
        case 'electricity':
          payments = await prisma.electricityPayment.findMany({
            where: { accountNumber },
            orderBy: { createdAt: 'desc' },
            take: 10
          })
          break
        case 'water':
          payments = await prisma.waterPayment.findMany({
            where: { accountNumber },
            orderBy: { createdAt: 'desc' },
            take: 10
          })
          break
        default:
          // For other departments, return mock data or implement as needed
          payments = []
      }

      return payments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        reference: payment.reference,
        receiptUrl: payment.receiptUrl,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt
      }))
    } catch (error) {
      console.error('Failed to get payment history:', error)
      throw error
    }
  }
}
