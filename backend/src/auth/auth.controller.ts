import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
  Logger,
  Ip,
  Headers,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { SendOtpDto } from "./dto/send-otp.dto"
import { VerifyOtpDto } from "./dto/verify-otp.dto"
import { AuthGuard } from "@nestjs/passport"
import { Response, Request } from "express"

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(private authService: AuthService) {}

  @Post("send-otp")
  sendOtp(@Body() dto: SendOtpDto, @Ip() ip: string) {
    this.logger.log(`Sending OTP to: ${dto.phone} from IP: ${ip}`)
    return this.authService.sendOtp(dto.phone, ip)
  }

  @Post("verify-otp")
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
    @Headers("user-agent") userAgent: string,
  ) {
    this.logger.log(`Verifying OTP for phone: ${dto.phone}, otp: ${dto.otp}`)
    const result = await this.authService.verifyOtp(dto.phone, dto.otp, ip, userAgent)

    if (!result) {
      this.logger.warn(`OTP verification failed for phone: ${dto.phone}`)
      return { message: "Invalid OTP" }
    }

    res.cookie("access_token", result.access_token, {
      httpOnly: true,
      secure: true, // required for HTTPS
      sameSite: "none", // required for cross-site
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
      userId: req.user.userId,
      role: req.user.role,
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("logout")
  async logout(@Req() req: Request & { user: any }, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.access_token
    await this.authService.logout(req.user.userId, token, req.user.phoneNumber)
    
    // Clear the cookie
    res.clearCookie("access_token")
    
    return { success: true, message: "Logged out successfully" }
  }
}
