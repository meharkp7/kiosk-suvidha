import { IsString, IsNumber, IsOptional, Min, Max, IsNotEmpty, IsEnum, Length, IsPositive } from "class-validator"

export enum PaymentDepartment {
  ELECTRICITY = "electricity",
  WATER = "water",
  GAS = "gas",
  MUNICIPAL = "municipal",
  TRANSPORT = "transport",
}

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(1000000) // Max 10 lakhs to prevent fraudulent large amounts
  amount: number

  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  accountNumber: string

  @IsNotEmpty()
  @IsEnum(PaymentDepartment)
  department: PaymentDepartment

  @IsOptional()
  @IsString()
  billId?: string

  @IsOptional()
  @IsString()
  challanId?: string

  @IsOptional()
  @IsString()
  bookingId?: string
}

export class VerifyPaymentDto {
  @IsNotEmpty()
  @IsString()
  razorpayOrderId: string

  @IsNotEmpty()
  @IsString()
  razorpayPaymentId: string

  @IsNotEmpty()
  @IsString()
  razorpaySignature: string
}

export class PaymentReceiptDto {
  @IsNotEmpty()
  @IsString()
  paymentId: string
}
