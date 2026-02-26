import { Controller, Get, Post, Param, Body, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { GasService } from "./gas.service"

@Controller("gas")
@UseGuards(AuthGuard("jwt"))
export class GasController {
  constructor(private gasService: GasService) {}

  @Get("account/:consumerNumber")
  getAccountDetails(@Param("consumerNumber") consumerNumber: string) {
    return this.gasService.getAccountDetails(consumerNumber)
  }

  @Post("book/:consumerNumber")
  bookCylinder(
    @Param("consumerNumber") consumerNumber: string,
    @Body("quantity") quantity?: number,
  ) {
    return this.gasService.bookCylinder(consumerNumber, quantity || 1)
  }

  @Get("booking/:bookingId")
  getBookingStatus(@Param("bookingId") bookingId: string) {
    return this.gasService.getBookingStatus(bookingId)
  }

  @Get("history/:consumerNumber")
  getBookingHistory(@Param("consumerNumber") consumerNumber: string) {
    return this.gasService.getBookingHistory(consumerNumber)
  }

  @Post("complaint")
  raiseComplaint(
    @Body("consumerNumber") consumerNumber: string,
    @Body("complaintType") complaintType: string,
    @Body("subType") subType: string,
    @Body("bookingId") bookingId?: string,
    @Body("description") description?: string,
  ) {
    return this.gasService.raiseComplaint(consumerNumber, complaintType, subType, bookingId, description)
  }

  @Get("complaint/:complaintId")
  getComplaintStatus(@Param("complaintId") complaintId: string) {
    return this.gasService.getComplaintStatus(complaintId)
  }

  @Post("transfer")
  createTransfer(
    @Body("consumerNumber") consumerNumber: string,
    @Body("newDistributorCode") newDistributorCode: string,
  ) {
    return this.gasService.createTransferRequest(consumerNumber, newDistributorCode)
  }

  @Get("transfer/:requestId")
  getTransferStatus(@Param("requestId") requestId: string) {
    return this.gasService.getTransferStatus(requestId)
  }
}
