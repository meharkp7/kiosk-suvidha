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

  @Post("meter-reading")
  submitMeterReading(
    @Body("accountNumber") accountNumber: string,
    @Body("reading") reading: number,
    @Body("photoUrl") photoUrl?: string,
  ) {
    return this.waterService.submitMeterReading(accountNumber, reading, photoUrl)
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

  @Get("complaints/:accountNumber")
  getAllComplaints(@Param("accountNumber") accountNumber: string) {
    return this.waterService.getAllComplaints(accountNumber)
  }

  @Post("name-change")
  createNameChange(
    @Body("accountNumber") accountNumber: string,
    @Body("newName") newName: string,
    @Body("reason") reason?: string,
  ) {
    return this.waterService.createNameChangeRequest(accountNumber, newName, reason)
  }

  @Post("new-connection")
  createNewConnection(
    @Body() data: {
      applicantName: string
      mobileNumber: string
      email?: string
      address: string
      propertyType: string
      connectionType: string
    },
  ) {
    return this.waterService.createNewConnectionRequest(data)
  }

  @Post("sewerage")
  createSewerageRequest(
    @Body("accountNumber") accountNumber: string,
    @Body("requestType") requestType: string,
    @Body("description") description: string,
  ) {
    return this.waterService.createSewerageRequest(accountNumber, requestType, description)
  }

  @Get("name-changes/:accountNumber")
  getAllNameChanges(@Param("accountNumber") accountNumber: string) {
    return this.waterService.getAllNameChangeRequests(accountNumber)
  }

  @Get("sewerage-requests/:accountNumber")
  getAllSewerageRequests(@Param("accountNumber") accountNumber: string) {
    return this.waterService.getAllSewerageRequests(accountNumber)
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
