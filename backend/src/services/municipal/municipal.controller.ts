import { Controller, Get, Post, Param, Body, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { MunicipalService } from "./municipal.service"

@Controller("municipal")
@UseGuards(AuthGuard("jwt"))
export class MunicipalController {
  constructor(private municipalService: MunicipalService) {}

  @Get("property/:propertyId")
  getPropertyDetails(@Param("propertyId") propertyId: string) {
    return this.municipalService.getPropertyDetails(propertyId)
  }

  @Get("tax-bill/:propertyId")
  getCurrentTaxBill(@Param("propertyId") propertyId: string) {
    return this.municipalService.getCurrentTaxBill(propertyId)
  }

  @Post("pay-tax/:propertyId")
  payTaxBill(
    @Param("propertyId") propertyId: string,
    @Body("financialYear") financialYear: string,
    @Body("paymentMethod") paymentMethod?: string,
  ) {
    return this.municipalService.payTaxBill(propertyId, financialYear, paymentMethod)
  }

  @Post("complaint")
  raiseComplaint(
    @Body("propertyId") propertyId: string | null,
    @Body("complaintType") complaintType: string,
    @Body("location") location: string,
    @Body("description") description?: string,
  ) {
    return this.municipalService.raiseCivicComplaint(propertyId, complaintType, location, description)
  }

  @Get("complaint/:complaintId")
  getComplaintStatus(@Param("complaintId") complaintId: string) {
    return this.municipalService.getComplaintStatus(complaintId)
  }

  @Post("certificate")
  applyForCertificate(
    @Body("propertyId") propertyId: string,
    @Body("certificateType") certificateType: string,
    @Body("applicantName") applicantName: string,
  ) {
    return this.municipalService.applyForCertificate(propertyId, certificateType, applicantName)
  }

  @Get("certificate/:requestId")
  getCertificateStatus(@Param("requestId") requestId: string) {
    return this.municipalService.getCertificateStatus(requestId)
  }
}
