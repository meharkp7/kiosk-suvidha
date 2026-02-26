import { Injectable, BadRequestException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"

// Simple in-memory OTP store (use Redis in production)
const otpStore = new Map<string, { otp: string; expires: number }>()

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async getUserAccounts(phoneNumber: string) {
    return this.prisma.linkedAccount.findMany({
      where: { phoneNumber },
    })
  }

  async requestLink(phoneNumber: string, department: string, accountNumber: string) {
    // Check if this specific account already exists
    const existingAccount = await this.getUserAccounts(phoneNumber)
    const alreadyLinked = existingAccount.some(
      (acc) => acc.department === department && acc.accountNumber === accountNumber
    )

    if (alreadyLinked) {
      throw new BadRequestException("Account already linked")
    }

    // Verify the account exists in the department table
    let accountExists = false
    switch (department) {
      case "electricity":
        accountExists = !!(await this.prisma.electricityAccount.findUnique({
          where: { accountNumber },
        }))
        break
      case "water":
        accountExists = !!(await this.prisma.waterAccount.findUnique({
          where: { accountNumber },
        }))
        break
      case "gas":
        // Gas uses consumerNumber or lpgId - try consumerNumber
        accountExists = !!(await this.prisma.gasAccount.findUnique({
          where: { consumerNumber: accountNumber },
        }))
        if (!accountExists) {
          // Try lpgId
          accountExists = !!(await this.prisma.gasAccount.findUnique({
            where: { lpgId: accountNumber },
          }))
        }
        break
      case "municipal":
        accountExists = !!(await this.prisma.propertyAccount.findUnique({
          where: { propertyId: accountNumber },
        }))
        break
      case "transport":
        accountExists = !!(await this.prisma.vehicleAccount.findUnique({
          where: { registrationNumber: accountNumber },
        }))
        break
      case "pds":
        accountExists = !!(await this.prisma.rationCardAccount.findUnique({
          where: { cardNumber: accountNumber },
        }))
        break
    }

    if (!accountExists) {
      throw new BadRequestException("Account not found in department records")
    }

    // Generate and store OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const key = `${phoneNumber}:${department}:${accountNumber}`
    otpStore.set(key, {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    })

    // In production, send OTP via SMS
    console.log(`OTP for ${key}: ${otp}`)

    return {
      message: "OTP sent successfully",
      expiresIn: "5 minutes",
    }
  }

  async verifyAndLink(
    phoneNumber: string,
    department: string,
    accountNumber: string,
    otp: string
  ) {
    const key = `${phoneNumber}:${department}:${accountNumber}`
    const stored = otpStore.get(key)

    if (!stored) {
      throw new BadRequestException("OTP expired or not requested")
    }

    if (stored.expires < Date.now()) {
      otpStore.delete(key)
      throw new BadRequestException("OTP expired")
    }

    if (stored.otp !== otp) {
      throw new BadRequestException("Invalid OTP")
    }

    // Create linked account
    const linkedAccount = await this.prisma.linkedAccount.create({
      data: {
        phoneNumber,
        department,
        accountNumber,
      },
    })

    // Clean up OTP
    otpStore.delete(key)

    return {
      message: "Account linked successfully",
      account: linkedAccount,
    }
  }
}