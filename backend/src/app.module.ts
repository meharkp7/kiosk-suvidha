import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { AccountsModule } from "./accounts/accounts.module"
import { ServicesModule } from './services/services.module'
import { PrismaModule } from "./prisma/prisma.module"
import { PaymentModule } from "./payment/payment.module"
import { ReceiptController } from "./common/controllers/receipt.controller"
import { ReceiptService } from "./common/services/receipt.service"
import { RolesGuard } from "./common/guards/roles.guard"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AccountsModule,
    ServicesModule,
    PaymentModule,
  ],
  controllers: [ReceiptController],
  providers: [ReceiptService, RolesGuard],
})
export class AppModule {}