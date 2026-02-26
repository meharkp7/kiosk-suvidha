import { Controller, Get, Post, Body, UseGuards, Req } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { AccountsService } from "./accounts.service"

@Controller("accounts")
@UseGuards(AuthGuard("jwt"))
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get("me")
  getMyAccounts(@Req() req) {
    return this.accountsService.getUserAccounts(req.user.phoneNumber)
  }

  @Get()
  getAccounts(@Req() req) {
    return this.accountsService.getUserAccounts(req.user.phoneNumber)
  }

  @Post("link-request")
  async requestAccountLink(
    @Req() req,
    @Body("department") department: string,
    @Body("accountNumber") accountNumber: string,
  ) {
    return this.accountsService.requestLink(req.user.phoneNumber, department, accountNumber)
  }

  @Post("link-verify")
  async verifyAndLinkAccount(
    @Req() req,
    @Body("department") department: string,
    @Body("accountNumber") accountNumber: string,
    @Body("otp") otp: string,
  ) {
    return this.accountsService.verifyAndLink(
      req.user.phoneNumber,
      department,
      accountNumber,
      otp,
    )
  }
}