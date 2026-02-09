import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import { JwtGuard } from "../common/guards/jwt.guard"
import { ServicesService } from "./services.service"

@Controller("services")
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @UseGuards(JwtGuard)
  @Get()
  getServices(@Query("department") department: string) {
    return this.servicesService.getServices(department)
  }
}