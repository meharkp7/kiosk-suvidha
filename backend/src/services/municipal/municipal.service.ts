import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"

@Injectable()
export class MunicipalService {
  private prisma = new PrismaClient()

  async getPropertyDetails(propertyId: string) {
    const property = await this.prisma.propertyAccount.findUnique({
      where: { propertyId },
      include: {
        taxBills: {
          orderBy: { financialYear: "desc" },
          take: 2,
        },
      },
    })

    if (!property) {
      throw new NotFoundException("Property not found")
    }

    return property
  }

  async getCurrentTaxBill(propertyId: string) {
    const bill = await this.prisma.propertyTaxBill.findFirst({
      where: {
        propertyId,
        status: "UNPAID",
      },
      orderBy: { financialYear: "desc" },
    })

    if (!bill) {
      throw new NotFoundException("No unpaid tax bill found")
    }

    return bill
  }

  async payTaxBill(propertyId: string, financialYear: string, paymentMethod: string = "RAZORPAY") {
    const bill = await this.prisma.propertyTaxBill.findFirst({
      where: {
        propertyId,
        financialYear,
        status: "UNPAID",
      },
    })

    if (!bill) {
      throw new NotFoundException("Tax bill not found or already paid")
    }

    await this.prisma.propertyTaxBill.update({
      where: { id: bill.id },
      data: {
        status: "PAID",
        paidDate: new Date(),
      },
    })

    return {
      message: "Tax payment successful",
      amount: bill.totalAmount,
      financialYear,
    }
  }

  async raiseCivicComplaint(propertyId: string | null, complaintType: string, location: string, description?: string) {
    const complaintId = `MUN-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

    return this.prisma.civicComplaint.create({
      data: {
        propertyId,
        complaintId,
        complaintType,
        location,
        description: description || `Citizen reported ${complaintType.toLowerCase()}`,
        status: "REGISTERED",
      },
    })
  }

  async getComplaintStatus(complaintId: string) {
    const complaint = await this.prisma.civicComplaint.findUnique({
      where: { complaintId },
    })

    if (!complaint) {
      throw new NotFoundException("Complaint not found")
    }

    return complaint
  }

  async applyForCertificate(propertyId: string, certificateType: string, applicantName: string) {
    const requestId = `CERT-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

    return this.prisma.certificateRequest.create({
      data: {
        propertyId,
        requestId,
        certificateType,
        applicantName,
        status: "PENDING",
      },
    })
  }

  async getCertificateStatus(requestId: string) {
    const request = await this.prisma.certificateRequest.findUnique({
      where: { requestId },
    })

    if (!request) {
      throw new NotFoundException("Certificate request not found")
    }

    return request
  }
}
