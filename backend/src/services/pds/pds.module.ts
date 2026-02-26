import { Module } from "@nestjs/common"
import { PdsController } from "./pds.controller"
import { PdsService } from "./pds.service"

@Module({
  controllers: [PdsController],
  providers: [PdsService],
})
export class PdsModule {}
