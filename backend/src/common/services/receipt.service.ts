import { Injectable, Logger, BadRequestException, ForbiddenException } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"
import { AuditService, AuditAction, Severity } from "./audit.service"

const prisma = new PrismaClient()

export interface ReceiptData {
  paymentId: string
  userId: string
  department: string
  accountNumber: string
  amount: number
  transactionDate: Date
  paymentMethod: string
  reference: string
}

@Injectable()
export class ReceiptService {
  private readonly logger = new Logger(ReceiptService.name)

  constructor(private auditService: AuditService) {}

  /**
   * Record a new payment receipt (called when payment is successful)
   * Backend controls receipt creation - frontend cannot fake this
   */
  async createReceipt(data: ReceiptData): Promise<any> {
    try {
      const receipt = await prisma.receipt.create({
        data: {
          userId: data.userId,
          paymentId: data.paymentId,
          department: data.department,
          accountNumber: data.accountNumber,
          amount: data.amount,
          printCount: 0,
          maxPrints: 1, // Only one print allowed per transaction
        },
      })

      this.logger.log(`Receipt created for payment ${data.paymentId}`)
      return receipt
    } catch (error) {
      this.logger.error(`Failed to create receipt: ${error.message}`)
      throw error
    }
  }

  /**
   * Get receipt by payment ID
   * Verifies user has permission to view this receipt
   */
  async getReceipt(paymentId: string, userId: string, phoneNumber: string): Promise<any> {
    const receipt = await prisma.receipt.findUnique({
      where: { paymentId },
    })

    if (!receipt) {
      throw new BadRequestException("Receipt not found")
    }

    // Verify user owns this receipt
    if (receipt.userId !== userId) {
      await this.auditService.logSecurity(
        AuditAction.UNAUTHORIZED_ACCESS,
        phoneNumber,
        "",
        { reason: "User attempted to access another user's receipt", paymentId },
      )
      throw new ForbiddenException("You do not have permission to view this receipt")
    }

    return receipt
  }

  /**
   * Request to print a receipt
   * Backend controls printing - only allows one print per transaction
   * Returns the receipt data for printing
   */
  async printReceipt(paymentId: string, userId: string, phoneNumber: string, ipAddress?: string): Promise<any> {
    const receipt = await prisma.receipt.findUnique({
      where: { paymentId },
    })

    if (!receipt) {
      throw new BadRequestException("Receipt not found")
    }

    // Verify user owns this receipt
    if (receipt.userId !== userId) {
      await this.auditService.logSecurity(
        AuditAction.UNAUTHORIZED_ACCESS,
        phoneNumber,
        ipAddress || "",
        { reason: "User attempted to print another user's receipt", paymentId },
      )
      throw new ForbiddenException("You do not have permission to print this receipt")
    }

    // Check if already printed (backend enforces one print per transaction)
    if (receipt.printCount >= receipt.maxPrints) {
      await this.auditService.log({
        action: AuditAction.RECEIPT_PRINT_FAILED,
        userId,
        phoneNumber,
        ipAddress,
        metadata: { 
          paymentId, 
          reason: "Print limit exceeded",
          printCount: receipt.printCount,
          maxPrints: receipt.maxPrints,
        },
        severity: Severity.WARN,
      })
      throw new ForbiddenException(`Receipt has already been printed. Maximum ${receipt.maxPrints} print(s) allowed per transaction.`)
    }

    // Increment print count
    const updatedReceipt = await prisma.receipt.update({
      where: { paymentId },
      data: {
        printCount: { increment: 1 },
        printedAt: new Date(),
      },
    })

    // Log the print action
    await this.auditService.log({
      action: AuditAction.RECEIPT_PRINTED,
      userId,
      phoneNumber,
      ipAddress,
      department: receipt.department,
      metadata: {
        paymentId,
        amount: receipt.amount,
        accountNumber: receipt.accountNumber,
        printCount: updatedReceipt.printCount,
      },
      severity: Severity.INFO,
    })

    this.logger.log(`Receipt printed for payment ${paymentId} by user ${userId}`)

    // Return receipt data for printing
    return {
      success: true,
      receipt: {
        id: updatedReceipt.id,
        paymentId: updatedReceipt.paymentId,
        department: updatedReceipt.department,
        accountNumber: updatedReceipt.accountNumber,
        amount: updatedReceipt.amount,
        printedAt: updatedReceipt.printedAt,
        printCount: updatedReceipt.printCount,
      },
      message: "Receipt authorized for printing",
    }
  }

  /**
   * Get all receipts for a user
   */
  async getUserReceipts(userId: string): Promise<any[]> {
    return prisma.receipt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Admin: Override print limit (for special cases like printer failure)
   * Only ADMIN or OWNER roles can use this
   */
  async overridePrintLimit(paymentId: string, adminId: string, reason: string): Promise<any> {
    const receipt = await prisma.receipt.update({
      where: { paymentId },
      data: {
        maxPrints: { increment: 1 },
      },
    })

    await this.auditService.log({
      action: AuditAction.ROLE_CHANGED, // Reusing action for admin override
      userId: adminId,
      metadata: {
        action: "PRINT_LIMIT_OVERRIDE",
        paymentId,
        reason,
        newMaxPrints: receipt.maxPrints,
      },
      severity: Severity.WARN,
    })

    return receipt
  }
}
