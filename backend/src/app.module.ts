import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { AccountsModule } from "./accounts/accounts.module"
import { ServicesModule } from './services/services.module'
import { PrismaModule } from "./prisma/prisma.module"
import { PaymentModule } from "./payment/payment.module"

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
})
export class AppModule {}