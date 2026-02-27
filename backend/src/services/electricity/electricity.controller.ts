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

  @Post("meter-reading")
  submitMeterReading(
    @Body("accountNumber") accountNumber: string,
    @Body("reading") reading: number,
    @Body("photoUrl") photoUrl?: string,
  ) {
    return this.electricityService.submitMeterReading(accountNumber, reading, photoUrl)
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

  @Get("complaints/:accountNumber")
  getAllComplaints(@Param("accountNumber") accountNumber: string) {
    return this.electricityService.getAllComplaints(accountNumber)
  }

  @Get("complaint/latest/:accountNumber")
  getLatestComplaint(@Param("accountNumber") accountNumber: string) {
    return this.electricityService.getLatestComplaint(accountNumber)
  }

  @Post("transfer")
  createTransfer(
    @Body("accountNumber") accountNumber: string,
    @Body("newAddress") newAddress: string,
    @Body("reason") reason?: string,
    @Body("documentSubmitted") documentSubmitted?: boolean,
  ) {
    return this.electricityService.createTransferRequest(accountNumber, newAddress)
  }

  @Post("pay/:accountNumber")
  payBill(@Param("accountNumber") accountNumber: string) {
    return this.electricityService.payBill(accountNumber)
  }

  @Post("name-change")
  createNameChange(
    @Body("accountNumber") accountNumber: string,
    @Body("newName") newName: string,
    @Body("reason") reason?: string,
  ) {
    return this.electricityService.createNameChangeRequest(accountNumber, newName, reason)
  }

  @Post("load-change")
  createLoadChange(
    @Body("accountNumber") accountNumber: string,
    @Body("newLoad") newLoad: number,
    @Body("reason") reason: string,
  ) {
    return this.electricityService.createLoadChangeRequest(accountNumber, newLoad, reason)
  }

  @Post("new-connection")
  createNewConnection(
    @Body() data: {
      applicantName: string
      mobileNumber: string
      email?: string
      address: string
      propertyType: string
      loadRequired: number
    },
  ) {
    return this.electricityService.createNewConnectionRequest(data)
  }

  @Post("billing-issue")
  createBillingIssue(
    @Body("accountNumber") accountNumber: string,
    @Body("issueType") issueType: string,
    @Body("description") description: string,
  ) {
    return this.electricityService.createBillingIssueRequest(accountNumber, issueType, description)
  }

  @Get("name-changes/:accountNumber")
  getAllNameChanges(@Param("accountNumber") accountNumber: string) {
    return this.electricityService.getAllNameChangeRequests(accountNumber)
  }

  @Get("load-changes/:accountNumber")
  getAllLoadChanges(@Param("accountNumber") accountNumber: string) {
    return this.electricityService.getAllLoadChangeRequests(accountNumber)
  }

  @Get("billing-issues/:accountNumber")
  getAllBillingIssues(@Param("accountNumber") accountNumber: string) {
    return this.electricityService.getAllBillingIssues(accountNumber)
  }
}