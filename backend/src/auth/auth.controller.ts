import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
  Logger,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { SendOtpDto } from "./dto/send-otp.dto"
import { VerifyOtpDto } from "./dto/verify-otp.dto"
import { AuthGuard } from "@nestjs/passport"
import { Response } from "express"

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(private authService: AuthService) {}

  @Post("send-otp")
  sendOtp(@Body() dto: SendOtpDto) {
    this.logger.log(`Sending OTP to: ${dto.phone}`)
    return this.authService.sendOtp(dto.phone)
  }

  @Post("verify-otp")
  verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.log(`Verifying OTP for phone: ${dto.phone}, otp: ${dto.otp}`)
    const result = this.authService.verifyOtp(dto.phone, dto.otp)

    if (!result) {
      this.logger.warn(`OTP verification failed for phone: ${dto.phone}`)
      return { message: "Invalid OTP" }
    }

    res.cookie("access_token", result.access_token, {
      httpOnly: true,
      secure: false, // false for localhost development
      sameSite: "lax", // lax works for same-site requests
      maxAge: 5 * 60 * 1000,
    })

    this.logger.log(`OTP verified successfully for phone: ${dto.phone}`)
    return { success: true, user: result.user }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  getMe(@Req() req: any) {
    return {
      phoneNumber: req.user.phoneNumber,
    }
  }
}
