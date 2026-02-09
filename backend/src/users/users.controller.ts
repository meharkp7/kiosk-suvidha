import { Controller, Get, UseGuards, Req } from "@nestjs/common"
import { JwtGuard } from "../common/guards/jwt.guard"

@Controller("users")
export class UsersController {
  @UseGuards(JwtGuard)
  @Get("me")
  getMe(@Req() req: any) {
    return {
      phone: req.user.phone,
      message: "Authenticated user",
    }
  }
}