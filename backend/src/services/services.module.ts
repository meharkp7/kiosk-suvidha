import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ElectricityModule } from "./electricity/electricity.module"
import { WaterModule } from "./water/water.module"
import { GasModule } from "./gas/gas.module"
import { MunicipalModule } from "./municipal/municipal.module"
import { TransportModule } from "./transport/transport.module"
import { PdsModule } from "./pds/pds.module"
import { PaymentModule } from "../payment/payment.module"

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
  imports: [ElectricityModule, WaterModule, GasModule, MunicipalModule, TransportModule, PdsModule, PaymentModule],
})
export class ServicesModule {}
