import { Controller, Post, Body, Headers } from "@nestjs/common"
import { PaymentService } from "./payment.service"

@Controller("payment")
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post("create-order")
  async createOrder(@Body() body: { amount: number; currency?: string; receipt?: string }) {
    return this.paymentService.createOrder(body.amount, body.currency, body.receipt)
  }

  @Post("verify")
  async verifyPayment(
    @Body() body: {
      orderId: string
      paymentId: string
      signature: string
      department: string
      accountNumber: string
      billId: string
      amount: number
    },
  ) {
    return this.paymentService.processPayment(
      body.department,
      body.accountNumber,
      body.billId,
      body.amount,
      {
        orderId: body.orderId,
        paymentId: body.paymentId,
        signature: body.signature,
      },
    )
  }

  @Post("webhook")
  async handleWebhook(@Body() payload: any, @Headers("x-razorpay-signature") signature: string) {
    return this.paymentService.handleWebhook(payload, signature)
  }
}
