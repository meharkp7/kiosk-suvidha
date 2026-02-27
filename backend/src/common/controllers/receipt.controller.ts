import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Ip,
  BadRequestException,
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { ReceiptService } from "../services/receipt.service"
import { RolesGuard } from "../guards/roles.guard"
import { Roles, UserRole } from "../decorators/roles.decorator"
import { AuditService, AuditAction } from "../services/audit.service"

@Controller("receipts")
@UseGuards(AuthGuard("jwt"))
export class ReceiptController {
  constructor(
    private receiptService: ReceiptService,
    private auditService: AuditService,
  ) {}

  /**
   * Get all receipts for logged in user
   */
  @Get()
  async getUserReceipts(@Req() req: any) {
    return this.receiptService.getUserReceipts(req.user.userId)
  }

  /**
   * Get specific receipt by payment ID
   */
  @Get(":paymentId")
  async getReceipt(
    @Param("paymentId") paymentId: string,
    @Req() req: any,
  ) {
    return this.receiptService.getReceipt(
      paymentId,
      req.user.userId,
      req.user.phoneNumber,
    )
  }

  /**
   * Request to print a receipt
   * Backend enforces one print per transaction limit
   */
  @Post(":paymentId/print")
  async printReceipt(
    @Param("paymentId") paymentId: string,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.receiptService.printReceipt(
      paymentId,
      req.user.userId,
      req.user.phoneNumber,
      ip,
    )
  }

  /**
   * Admin only: Override print limit
   * Only ADMIN or OWNER roles can access this
   */
  @Post(":paymentId/override-print")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async overridePrintLimit(
    @Param("paymentId") paymentId: string,
    @Body("reason") reason: string,
    @Req() req: any,
  ) {
    if (!reason) {
      throw new BadRequestException("Reason is required for override")
    }

    return this.receiptService.overridePrintLimit(
      paymentId,
      req.user.userId,
      reason,
    )
  }
}
