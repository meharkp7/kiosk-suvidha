import { Controller, Post, Get, Body, Query, Res, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'
import { PaymentService } from '../services/payment.service'

@Controller('payments')
export class PaymentController {
  @Post('create-order')
  async createOrder(@Body() body: any, @Res() res: Response) {
    try {
      const { amount, accountNumber, department, billId, challanId, bookingId } = body

      if (!amount || !accountNumber || !department) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: amount, accountNumber, department'
        })
      }

      const result = await PaymentService.createOrder({
        amount,
        accountNumber,
        department,
        billId,
        challanId,
        bookingId
      })

      res.json(result)
    } catch (error) {
      console.error('Create payment order error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create payment order'
      })
    }
  }

  @Post('verify')
  async verifyPayment(@Body() body: any, @Res() res: Response) {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body

      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: razorpayOrderId, razorpayPaymentId, razorpaySignature'
        })
      }

      const result = await PaymentService.verifyPayment(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      )

      res.json(result)
    } catch (error) {
      console.error('Payment verification error:', error)
      res.status(500).json({
        success: false,
        message: 'Payment verification failed'
      })
    }
  }

  @Get('history')
  async getPaymentHistory(@Query() query: any, @Res() res: Response) {
    try {
      const { accountNumber, department } = query

      if (!accountNumber || !department) {
        return res.status(400).json({
          success: false,
          message: 'Missing required query parameters: accountNumber, department'
        })
      }

      const history = await PaymentService.getPaymentHistory(
        accountNumber as string,
        department as string
      )

      res.json({
        success: true,
        history
      })
    } catch (error) {
      console.error('Get payment history error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get payment history'
      })
    }
  }
}
