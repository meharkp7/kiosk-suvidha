import { Injectable, Logger } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name)

  // Rate limit configs
  private readonly OTP_LIMIT = 3 // 3 OTP requests per window
  private readonly OTP_WINDOW_MINUTES = 10 // per 10 minutes
  private readonly LOGIN_LIMIT = 5 // 5 login attempts per window
  private readonly LOGIN_WINDOW_MINUTES = 15 // per 15 minutes

  async checkOtpRateLimit(identifier: string): Promise<{ allowed: boolean; retryAfter?: number }> {
    return this.checkRateLimit(identifier, "OTP", this.OTP_LIMIT, this.OTP_WINDOW_MINUTES)
  }

  async checkLoginRateLimit(identifier: string): Promise<{ allowed: boolean; retryAfter?: number }> {
    return this.checkRateLimit(identifier, "LOGIN", this.LOGIN_LIMIT, this.LOGIN_WINDOW_MINUTES)
  }

  async recordAttempt(identifier: string, actionType: string): Promise<void> {
    try {
      const now = new Date()
      
      await prisma.rateLimit.upsert({
        where: { identifier: `${identifier}:${actionType}` },
        create: {
          identifier: `${identifier}:${actionType}`,
          actionType,
          count: 1,
          lastAttempt: now,
        },
        update: {
          count: { increment: 1 },
          lastAttempt: now,
        },
      })
    } catch (error) {
      this.logger.error(`Failed to record rate limit attempt: ${error.message}`)
    }
  }

  private async checkRateLimit(
    identifier: string,
    actionType: string,
    limit: number,
    windowMinutes: number,
  ): Promise<{ allowed: boolean; retryAfter?: number }> {
    try {
      const fullIdentifier = `${identifier}:${actionType}`
      const now = new Date()
      const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000)

      const rateLimitRecord = await prisma.rateLimit.findUnique({
        where: { identifier: fullIdentifier },
      })

      // If no record or window has passed, allow and reset
      if (!rateLimitRecord || rateLimitRecord.lastAttempt < windowStart) {
        await prisma.rateLimit.upsert({
          where: { identifier: fullIdentifier },
          create: {
            identifier: fullIdentifier,
            actionType,
            count: 0,
            lastAttempt: now,
          },
          update: {
            count: 0,
            lastAttempt: now,
            blockedUntil: null,
          },
        })
        return { allowed: true }
      }

      // Check if currently blocked
      if (rateLimitRecord.blockedUntil && rateLimitRecord.blockedUntil > now) {
        const retryAfter = Math.ceil((rateLimitRecord.blockedUntil.getTime() - now.getTime()) / 1000)
        return { allowed: false, retryAfter }
      }

      // Check if limit exceeded
      if (rateLimitRecord.count >= limit) {
        // Block for double the window time
        const blockedUntil = new Date(now.getTime() + windowMinutes * 2 * 60 * 1000)
        await prisma.rateLimit.update({
          where: { identifier: fullIdentifier },
          data: { blockedUntil },
        })
        
        this.logger.warn(`Rate limit exceeded for ${identifier} - ${actionType}. Blocked until ${blockedUntil}`)
        return { allowed: false, retryAfter: windowMinutes * 2 * 60 }
      }

      return { allowed: true }
    } catch (error) {
      this.logger.error(`Rate limit check failed: ${error.message}`)
      // Fail open in case of error (allow request)
      return { allowed: true }
    }
  }

  async resetLimit(identifier: string, actionType: string): Promise<void> {
    try {
      await prisma.rateLimit.delete({
        where: { identifier: `${identifier}:${actionType}` },
      })
    } catch (error) {
      // Ignore if record doesn't exist
    }
  }
}
