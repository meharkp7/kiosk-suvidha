import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LinkedAccount } from './entities/linked-account.entity'
import { AccountsService } from './accounts.service'
import { AccountsController } from './accounts.controller'

@Module({
  imports: [TypeOrmModule.forFeature([LinkedAccount])],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}