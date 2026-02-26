import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  sendOtp(phone: string) {
    let otp = "123456"
    
    // Use 123456 as OTP for 9876543210 as well
    if (phone === "9876543210") {
      otp = "123456"
    }

    console.log(`OTP for ${phone}: ${otp}`)

    return { success: true }
  }

  verifyOtp(phone: string, otp: string) {
    // Accept 123456 for all numbers, and specifically for 9876543210
    if (otp !== "123456") {
      return null
    }

    const payload = { phoneNumber: phone }

    return {
      access_token: this.jwtService.sign(payload),
      user: { phoneNumber: phone },
    }
  }
}
