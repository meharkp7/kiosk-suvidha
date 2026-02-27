import { Injectable, Logger } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export enum AuditAction {
  // Auth actions
  LOGIN_ATTEMPT = "LOGIN_ATTEMPT",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILED = "LOGIN_FAILED",
  LOGOUT = "LOGOUT",
  OTP_SENT = "OTP_SENT",
  OTP_VERIFIED = "OTP_VERIFIED",
  OTP_FAILED = "OTP_FAILED",
  
  // Payment actions
  PAYMENT_INITIATED = "PAYMENT_INITIATED",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  PAYMENT_VERIFIED = "PAYMENT_VERIFIED",
  
  // Receipt actions
  RECEIPT_PRINTED = "RECEIPT_PRINTED",
  RECEIPT_PRINT_FAILED = "RECEIPT_PRINT_FAILED",
  
  // Service actions
  SERVICE_ACCESSED = "SERVICE_ACCESSED",
  BILL_PAID = "BILL_PAID",
  COMPLAINT_RAISED = "COMPLAINT_RAISED",
  BOOKING_CREATED = "BOOKING_CREATED",
  APPLICATION_SUBMITTED = "APPLICATION_SUBMITTED",
  
  // Admin actions
  USER_CREATED = "USER_CREATED",
  USER_UPDATED = "USER_UPDATED",
  USER_DELETED = "USER_DELETED",
  ROLE_CHANGED = "ROLE_CHANGED",
  
  // Security actions
  RATE_LIMIT_HIT = "RATE_LIMIT_HIT",
  UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS",
  INVALID_INPUT = "INVALID_INPUT",
}

export enum Severity {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}

export interface AuditLogEntry {
  action: AuditAction
  userId?: string
  phoneNumber?: string
  department?: string
  serviceKey?: string
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, any>
  severity?: Severity
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name)

  async log(entry: AuditLogEntry): Promise<void> {
    try {
      // Log to console for immediate visibility
      const logMessage = `[AUDIT] ${entry.action} | User: ${entry.phoneNumber || entry.userId || "anonymous"} | Severity: ${entry.severity || "INFO"}`
      
      if (entry.severity === Severity.ERROR || entry.severity === Severity.CRITICAL) {
        this.logger.error(logMessage, entry.metadata)
      } else if (entry.severity === Severity.WARN) {
        this.logger.warn(logMessage)
      } else {
        this.logger.log(logMessage)
      }

      // Persist to database (without severity until schema regenerated)
      await prisma.auditLog.create({
        data: {
          action: entry.action,
          userId: entry.userId,
          phoneNumber: entry.phoneNumber,
          department: entry.department,
          serviceKey: entry.serviceKey,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
          // severity: entry.severity || Severity.INFO, // TODO: Add after prisma generate
        },
      })
    } catch (error) {
      // Don't throw - logging should not break functionality
      this.logger.error(`Failed to write audit log: ${error.message}`, error)
    }
  }

  async logPayment(
    action: AuditAction,
    phoneNumber: string,
    amount: number,
    department: string,
    metadata?: Record<string, any>,
    severity: Severity = Severity.INFO,
  ): Promise<void> {
    await this.log({
      action,
      phoneNumber,
      department,
      metadata: { amount, ...metadata },
      severity,
    })
  }

  async logAuth(
    action: AuditAction,
    phoneNumber: string,
    ipAddress?: string,
    success: boolean = true,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      action,
      phoneNumber,
      ipAddress,
      metadata,
      severity: success ? Severity.INFO : Severity.WARN,
    })
  }

  async logSecurity(
    action: AuditAction,
    phoneNumber: string,
    ipAddress: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      action,
      phoneNumber,
      ipAddress,
      metadata,
      severity: Severity.WARN,
    })
  }
}
