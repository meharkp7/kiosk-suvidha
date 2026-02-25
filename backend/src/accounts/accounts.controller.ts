import { Controller, Get, UseGuards, Req } from '@nestjs/common'
import { AccountsService } from './accounts.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('accounts')
export class AccountsController {
  constructor(private readonly service: AccountsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMyAccounts(@Req() req: any) {
    return this.service.getLinkedAccounts(req.user.phoneNumber)
  }
}