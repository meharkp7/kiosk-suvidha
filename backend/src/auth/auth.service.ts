import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  sendOtp(phone: string) {
    const otp = "123456"

    console.log(`OTP for ${phone}: ${otp}`)

    return { success: true }
  }

  verifyOtp(phone: string, otp: string) {
    if (otp !== "123456") {
      return null
    }

    const payload = { phone }

    return {
      token: this.jwtService.sign(payload),
      user: { phone },
    }
  }
}
