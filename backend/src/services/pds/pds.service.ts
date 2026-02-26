import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"

@Injectable()
export class PdsService {
  private prisma = new PrismaClient()

  async getCardDetails(cardNumber: string) {
    const card = await this.prisma.rationCardAccount.findUnique({
      where: { cardNumber },
      include: {
        transactions: {
          orderBy: { transactionDate: "desc" },
          take: 3,
        },
      },
    })

    if (!card) {
      throw new NotFoundException("Ration card not found")
    }

    // Get entitlement based on card type
    const entitlement = await this.prisma.rationEntitlement.findUnique({
      where: { cardType: card.cardType },
    })

    return {
      ...card,
      entitlement: entitlement || null,
      lastTransaction: card.transactions[0] || null,
    }
  }

  async getMonthlyEntitlement(cardNumber: string) {
    const card = await this.prisma.rationCardAccount.findUnique({
      where: { cardNumber },
    })

    if (!card) {
      throw new NotFoundException("Ration card not found")
    }

    const entitlement = await this.prisma.rationEntitlement.findUnique({
      where: { cardType: card.cardType },
    })

    if (!entitlement) {
      throw new NotFoundException("Entitlement not found for this card type")
    }

    return {
      cardType: card.cardType,
      ...entitlement,
      validFrom: entitlement.validFrom,
      validUpto: entitlement.validUpto,
    }
  }

  async getTransactionHistory(cardNumber: string, limit: number = 5) {
    const transactions = await this.prisma.rationTransaction.findMany({
      where: { cardNumber },
      orderBy: { transactionDate: "desc" },
      take: limit,
    })

    return transactions
  }

  async lodgeGrievance(cardNumber: string, grievanceType: string, description?: string) {
    const card = await this.prisma.rationCardAccount.findUnique({
      where: { cardNumber },
    })

    if (!card) {
      throw new NotFoundException("Ration card not found")
    }

    const grievanceId = `PDS-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

    return this.prisma.rationGrievance.create({
      data: {
        cardNumber,
        grievanceId,
        grievanceType,
        description: description || `Card holder reported ${grievanceType.toLowerCase()}`,
        status: "REGISTERED",
      },
    })
  }

  async getGrievanceStatus(grievanceId: string) {
    const grievance = await this.prisma.rationGrievance.findUnique({
      where: { grievanceId },
    })

    if (!grievance) {
      throw new NotFoundException("Grievance not found")
    }

    return grievance
  }
}
