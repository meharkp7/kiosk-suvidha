import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LinkedAccount } from './entities/linked-account.entity'

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(LinkedAccount)
    private repo: Repository<LinkedAccount>,
  ) {}

  async getLinkedAccounts(phone: string) {
    return this.repo.find({ where: { phoneNumber: phone } })
  }
}