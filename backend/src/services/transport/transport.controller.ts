import { Controller, Get, Post, Param, Body, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { TransportService } from "./transport.service"

@Controller("transport")
@UseGuards(AuthGuard("jwt"))
export class TransportController {
  constructor(private transportService: TransportService) {}

  @Get("vehicle/:registrationNumber")
  getVehicleDetails(@Param("registrationNumber") registrationNumber: string) {
    return this.transportService.getVehicleDetails(registrationNumber)
  }

  @Get("challans/:registrationNumber")
  getChallanHistory(@Param("registrationNumber") registrationNumber: string) {
    return this.transportService.getChallanHistory(registrationNumber)
  }

  @Post("pay-challan/:challanNumber")
  payChallan(
    @Param("challanNumber") challanNumber: string,
    @Body("paymentMethod") paymentMethod?: string,
  ) {
    return this.transportService.payChallan(challanNumber, paymentMethod)
  }

  @Get("application/:applicationNumber")
  getApplicationStatus(@Param("applicationNumber") applicationNumber: string) {
    return this.transportService.getApplicationStatus(applicationNumber)
  }

  @Post("application")
  submitApplication(
    @Body("registrationNumber") registrationNumber: string | null,
    @Body("applicationType") applicationType: string,
    @Body("applicantName") applicantName: string,
  ) {
    return this.transportService.submitApplication(registrationNumber, applicationType, applicantName)
  }
}
