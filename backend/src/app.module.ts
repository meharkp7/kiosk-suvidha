import { Module } from "@nestjs/common"
import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"
import { AccountsModule } from './accounts/accounts.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [AuthModule, UsersModule, AccountsModule, ServicesModule],
})
export class AppModule {}