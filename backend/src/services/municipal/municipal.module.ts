import { Module } from "@nestjs/common"
import { MunicipalController } from "./municipal.controller"
import { MunicipalService } from "./municipal.service"

@Module({
  controllers: [MunicipalController],
  providers: [MunicipalService],
})
export class MunicipalModule {}
