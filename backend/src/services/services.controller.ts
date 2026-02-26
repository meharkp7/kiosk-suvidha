import { Controller, Get, Param, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { ServicesService } from "./services.service"

@Controller("services")
@UseGuards(AuthGuard("jwt"))
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get(":department")
  getServices(@Param("department") department: string) {
    return this.servicesService.getServices(department)
  }
}