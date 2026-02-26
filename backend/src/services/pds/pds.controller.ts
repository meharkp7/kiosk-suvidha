import { Controller, Get, Post, Param, Body, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { PdsService } from "./pds.service"

@Controller("pds")
@UseGuards(AuthGuard("jwt"))
export class PdsController {
  constructor(private pdsService: PdsService) {}

  @Get("card/:cardNumber")
  getCardDetails(@Param("cardNumber") cardNumber: string) {
    return this.pdsService.getCardDetails(cardNumber)
  }

  @Get("entitlement/:cardNumber")
  getMonthlyEntitlement(@Param("cardNumber") cardNumber: string) {
    return this.pdsService.getMonthlyEntitlement(cardNumber)
  }

  @Get("transactions/:cardNumber")
  getTransactionHistory(@Param("cardNumber") cardNumber: string) {
    return this.pdsService.getTransactionHistory(cardNumber)
  }

  @Post("grievance")
  lodgeGrievance(
    @Body("cardNumber") cardNumber: string,
    @Body("grievanceType") grievanceType: string,
    @Body("description") description?: string,
  ) {
    return this.pdsService.lodgeGrievance(cardNumber, grievanceType, description)
  }

  @Get("grievance/:grievanceId")
  getGrievanceStatus(@Param("grievanceId") grievanceId: string) {
    return this.pdsService.getGrievanceStatus(grievanceId)
  }
}
