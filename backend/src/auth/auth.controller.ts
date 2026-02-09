import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { SendOtpDto } from "./dto/send-otp.dto"
import { VerifyOtpDto } from "./dto/verify-otp.dto"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("send-otp")
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.phone)
  }

  @Post("verify-otp")
  verifyOtp(@Body() dto: VerifyOtpDto) {
    const result = this.authService.verifyOtp(dto.phone, dto.otp)

    if (!result) {
      throw new UnauthorizedException("Invalid OTP")
    }

    return result
  }
}
