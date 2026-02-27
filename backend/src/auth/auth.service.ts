import { Injectable, Logger, BadRequestException, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { PrismaClient } from "@prisma/client"
import { RateLimitService } from "../common/services/rate-limit.service"
import { AuditService, AuditAction } from "../common/services/audit.service"

const prisma = new PrismaClient()

// Temporary in-memory OTP storage (use Redis in production)
const otpStore = new Map<string, { otp: string; expiresAt: number }>()

// Demo OTP for testing - remove in production
const DEMO_PHONE = "9876543210"
const DEMO_OTP = "123456"

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private jwtService: JwtService,
    private rateLimitService: RateLimitService,
    private auditService: AuditService,
  ) {}

  async sendOtp(phone: string, ipAddress?: string) {
    // Check rate limit for OTP requests
    const rateLimitCheck = await this.rateLimitService.checkOtpRateLimit(phone)
    if (!rateLimitCheck.allowed) {
      await this.auditService.logSecurity(
        AuditAction.RATE_LIMIT_HIT,
        phone,
        ipAddress || "",
        { action: "OTP_REQUEST", retryAfter: rateLimitCheck.retryAfter },
      )
      throw new BadRequestException(
        `Too many OTP requests. Please try again after ${Math.ceil((rateLimitCheck.retryAfter || 0) / 60)} minutes.`
      )
    }

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

    // Record this attempt for rate limiting
    await this.rateLimitService.recordAttempt(phone, "OTP")

    // Log OTP sent (with masked value in production)
    this.logger.log(`OTP sent to ${phone}`)
    await this.auditService.logAuth(
      AuditAction.OTP_SENT,
      phone,
      ipAddress,
      true,
      { maskedOtp: phone === DEMO_PHONE ? otp : "****" },
    )

    return {
      success: true,
      message: "OTP sent successfully",
      // Include OTP in response for demo/testing (remove in production)
      ...(phone === DEMO_PHONE && { otp }),
    }
  }

  async verifyOtp(phone: string, otp: string, ipAddress?: string, userAgent?: string) {
    // Check login rate limit (prevent brute force)
    const rateLimitCheck = await this.rateLimitService.checkLoginRateLimit(phone)
    if (!rateLimitCheck.allowed) {
      await this.auditService.logSecurity(
        AuditAction.RATE_LIMIT_HIT,
        phone,
        ipAddress || "",
        { action: "OTP_VERIFY", retryAfter: rateLimitCheck.retryAfter },
      )
      throw new UnauthorizedException(
        `Too many failed attempts. Please try again after ${Math.ceil((rateLimitCheck.retryAfter || 0) / 60)} minutes.`
      )
    }

    // TEMP: Hardcoded OTP for demo phone
    if (phone === "9876543210" && otp === "123456") {
      return await this.handleSuccessfulLogin(phone, ipAddress, userAgent)
    }

    const stored = otpStore.get(phone)

    // Check if OTP exists and hasn't expired
    if (!stored) {
      await this.recordFailedLogin(phone, ipAddress, "OTP not found or expired")
      return null
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(phone)
      await this.recordFailedLogin(phone, ipAddress, "OTP expired")
      return null
    }

    if (stored.otp !== otp) {
      await this.rateLimitService.recordAttempt(phone, "LOGIN")
      await this.recordFailedLogin(phone, ipAddress, "Invalid OTP")
      return null
    }

    // Clean up OTP after successful verification
    otpStore.delete(phone)

    // Reset rate limits on successful login
    await this.rateLimitService.resetLimit(phone, "LOGIN")

    return await this.handleSuccessfulLogin(phone, ipAddress, userAgent)
  }

  private async handleSuccessfulLogin(phone: string, ipAddress?: string, userAgent?: string) {
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phoneNumber: phone },
    })

    if (!user) {
      // Create new kiosk user
      user = await prisma.user.create({
        data: {
          phoneNumber: phone,
          role: "KIOSK_USER",
          lastLoginAt: new Date(),
        },
      })
      this.logger.log(`New user created: ${phone}`)
    } else {
      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      })
    }

    // Create session
    const session = await prisma.userSession.create({
      data: {
        userId: user.id,
        token: "", // Will be updated with JWT
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    })

    // Generate JWT with user role
    const payload = {
      phoneNumber: phone,
      userId: user.id,
      role: user.role,
      sessionId: session.id,
    }
    const access_token = this.jwtService.sign(payload)

    // Update session with token
    await prisma.userSession.update({
      where: { id: session.id },
      data: { token: access_token },
    })

    // Log successful login
    await this.auditService.logAuth(
      AuditAction.LOGIN_SUCCESS,
      phone,
      ipAddress,
      true,
      { userId: user.id, role: user.role },
    )

    this.logger.log(`Login successful: ${phone}, role: ${user.role}`)

    return {
      access_token,
      user: {
        phoneNumber: phone,
        userId: user.id,
        role: user.role,
      },
    }
  }

  private async recordFailedLogin(phone: string, ipAddress?: string, reason?: string) {
    await this.auditService.logAuth(
      AuditAction.LOGIN_FAILED,
      phone,
      ipAddress,
      false,
      { reason },
    )
  }

  async logout(userId: string, token: string, phoneNumber: string) {
    // Deactivate session
    await prisma.userSession.updateMany({
      where: { userId, token },
      data: { isActive: false },
    })

    await this.auditService.logAuth(
      AuditAction.LOGOUT,
      phoneNumber,
      "",
      true,
      { userId },
    )

    return { success: true, message: "Logged out successfully" }
  }

  async getUserByPhone(phone: string) {
    return prisma.user.findUnique({
      where: { phoneNumber: phone },
    })
  }
}
