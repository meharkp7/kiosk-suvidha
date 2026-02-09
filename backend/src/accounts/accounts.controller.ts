import { Controller, Get, Req, UseGuards } from "@nestjs/common"
import { AccountsService } from "./accounts.service"
import { JwtGuard } from "../common/guards/jwt.guard"

@Controller("accounts")
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @UseGuards(JwtGuard)
  @Get()
  getAccounts(@Req() req: any) {
    return this.accountsService.getAccounts(req.user.phone)
  }
}
