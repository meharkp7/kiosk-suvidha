import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

// Temporary in-memory OTP storage (use Redis in production)
const otpStore = new Map<string, { otp: string; expiresAt: number }>()

// Demo OTP for testing - remove in production
const DEMO_PHONE = "9876543210"
const DEMO_OTP = "123456"

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  sendOtp(phone: string) {
    // For demo phone, use fixed OTP
    let otp: string
    if (phone === DEMO_PHONE) {
      otp = DEMO_OTP
    } else {
      // Generate random 6-digit OTP
      otp = Math.floor(100000 + Math.random() * 900000).toString()
    }

    // Store OTP with 5-minute expiry
    otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    })

    console.log(`OTP for ${phone}: ${otp}`)

    return {
      success: true,
      message: "OTP sent successfully",
      // Include OTP in response for demo/testing (remove in production)
      ...(phone === DEMO_PHONE && { otp }),
    }
  }

  verifyOtp(phone: string, otp: string) {
    // TEMP: Hardcoded OTP for demo phone
    if (phone === "9876543210" && otp === "123456") {
      const payload = { phoneNumber: phone }
      return {
        access_token: this.jwtService.sign(payload),
        user: { phoneNumber: phone },
      }
    }

    const stored = otpStore.get(phone)

    // Check if OTP exists and hasn't expired
    if (!stored) {
      return null
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(phone)
      return null
    }

    if (stored.otp !== otp) {
      return null
    }

    // Clean up OTP after successful verification
    otpStore.delete(phone)

    const payload = { phoneNumber: phone }

    return {
      access_token: this.jwtService.sign(payload),
      user: { phoneNumber: phone },
    }
  }
}
