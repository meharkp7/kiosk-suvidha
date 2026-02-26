import { Controller, Get, Post, Param, Body, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { ElectricityService } from "./electricity.service"

@Controller("electricity")
@UseGuards(AuthGuard("jwt"))
export class ElectricityController {
  constructor(private electricityService: ElectricityService) {}

  @Get("bill/:accountNumber")
  getCurrentBill(@Param("accountNumber") accountNumber: string) {
    return this.electricityService.getCurrentBill(accountNumber)
  }

  @Get("history/:accountNumber")
  getHistory(@Param("accountNumber") accountNumber: string) {
    return this.electricityService.getBillHistory(accountNumber)
  }

  @Post("complaint")
  raiseComplaint(
    @Body("accountNumber") accountNumber: string,
    @Body("complaintType") complaintType: string,
    @Body("subType") subType: string,
  ) {
    return this.electricityService.raiseComplaint(
      accountNumber,
      complaintType,
      subType,
    )
  }

  @Get("complaint/latest/:accountNumber")
  getLatestComplaint(@Param("accountNumber") accountNumber: string) {
    return this.electricityService.getLatestComplaint(accountNumber)
  }

  @Post("transfer")
  createTransfer(@Body("accountNumber") accountNumber: string) {
    return this.electricityService.createTransferRequest(accountNumber)
  }

  @Post("pay/:accountNumber")
  payBill(@Param("accountNumber") accountNumber: string) {
    return this.electricityService.payBill(accountNumber)
 }   
}