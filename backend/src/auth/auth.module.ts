import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { JwtStrategy } from "../common/strategies/jwt.strategy"
import { ConfigService } from '@nestjs/config'
import { RateLimitService } from "../common/services/rate-limit.service"
import { AuditService } from "../common/services/audit.service"

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '5m' },
    }),
  })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RateLimitService, AuditService],
  exports: [RateLimitService, AuditService],
})
export class AuthModule {}