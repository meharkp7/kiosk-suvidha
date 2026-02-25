import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('linked_accounts')
export class LinkedAccount {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  phoneNumber: string

  @Column()
  department: string

  @Column()
  accountNumber: string

  @CreateDateColumn()
  createdAt: Date
}