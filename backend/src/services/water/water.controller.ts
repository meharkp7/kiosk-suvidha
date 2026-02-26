import { Controller, Get, Post, Param, Body, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { WaterService } from "./water.service"

@Controller("water")
@UseGuards(AuthGuard("jwt"))
export class WaterController {
  constructor(private waterService: WaterService) {}

  @Get("bill/:accountNumber")
  getCurrentBill(@Param("accountNumber") accountNumber: string) {
    return this.waterService.getCurrentBill(accountNumber)
  }

  @Get("history/:accountNumber")
  getHistory(@Param("accountNumber") accountNumber: string) {
    return this.waterService.getBillHistory(accountNumber)
  }

  @Post("pay/:accountNumber")
  payBill(
    @Param("accountNumber") accountNumber: string,
    @Body() paymentData: any,
  ) {
    return this.waterService.payBill(
      accountNumber,
      paymentData.paymentMethod,
      paymentData.razorpayDetails,
    )
  }

  @Post("complaint")
  raiseComplaint(
    @Body("accountNumber") accountNumber: string,
    @Body("complaintType") complaintType: string,
    @Body("subType") subType: string,
    @Body("description") description?: string,
  ) {
    return this.waterService.raiseComplaint(accountNumber, complaintType, subType, description)
  }

  @Get("complaint/:complaintId")
  getComplaintStatus(@Param("complaintId") complaintId: string) {
    return this.waterService.getComplaintStatus(complaintId)
  }

  @Post("transfer")
  createTransfer(
    @Body("accountNumber") accountNumber: string,
    @Body("newAddress") newAddress?: string,
  ) {
    return this.waterService.createTransferRequest(accountNumber, newAddress)
  }

  @Get("transfer/:requestId")
  getTransferStatus(@Param("requestId") requestId: string) {
    return this.waterService.getTransferStatus(requestId)
  }
}
