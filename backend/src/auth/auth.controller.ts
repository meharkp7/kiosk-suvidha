import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { SendOtpDto } from "./dto/send-otp.dto"
import { VerifyOtpDto } from "./dto/verify-otp.dto"
import { AuthGuard } from "@nestjs/passport"
import { Response } from "express"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("send-otp")
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.phone)
  }

  @Post("verify-otp")
  verifyOtp(
    @Body("phone") phone: string,
    @Body("otp") otp: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = this.authService.verifyOtp(phone, otp)

    if (!result) {
      return { message: "Invalid OTP" }
    }

    res.cookie("access_token", result.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 5 * 60 * 1000,
    })

    return { success: true }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  getMe(@Req() req: any) {
    return {
      phoneNumber: req.user.phoneNumber,
    }
  }
}