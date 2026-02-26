import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"

@Injectable()
export class TransportService {
  private prisma = new PrismaClient()

  async getVehicleDetails(registrationNumber: string) {
    const vehicle = await this.prisma.vehicleAccount.findUnique({
      where: { registrationNumber },
      include: {
        challans: {
          where: { status: "UNPAID" },
          orderBy: { violationDate: "desc" },
        },
        applications: {
          orderBy: { applicationDate: "desc" },
          take: 3,
        },
      },
    })

    if (!vehicle) {
      throw new NotFoundException("Vehicle not found")
    }

    const totalUnpaidChallans = vehicle.challans.reduce((sum, c) => sum + c.fineAmount, 0)

    return {
      ...vehicle,
      totalUnpaidChallans,
      fitnessStatus: vehicle.fitnessValidUpto && new Date(vehicle.fitnessValidUpto) > new Date() ? "VALID" : "EXPIRED",
      insuranceStatus: vehicle.insuranceValidUpto && new Date(vehicle.insuranceValidUpto) > new Date() ? "VALID" : "EXPIRED",
      pucStatus: vehicle.pucValidUpto && new Date(vehicle.pucValidUpto) > new Date() ? "VALID" : "EXPIRED",
    }
  }

  async getChallanHistory(registrationNumber: string) {
    const challans = await this.prisma.challan.findMany({
      where: { registrationNumber },
      orderBy: { violationDate: "desc" },
    })

    return challans.map(c => ({
      ...c,
      badge: c.status === "PAID" ? "PAID" : "UNPAID",
    }))
  }

  async payChallan(challanNumber: string, paymentMethod: string = "RAZORPAY") {
    const challan = await this.prisma.challan.findUnique({
      where: { challanNumber },
    })

    if (!challan) {
      throw new NotFoundException("Challan not found")
    }

    if (challan.status === "PAID") {
      throw new NotFoundException("Challan already paid")
    }

    await this.prisma.challan.update({
      where: { challanNumber },
      data: {
        status: "PAID",
        paidDate: new Date(),
        paymentReference: `CHL-${Date.now()}`,
      },
    })

    return {
      message: "Challan payment successful",
      amount: challan.fineAmount,
      challanNumber,
    }
  }

  async getApplicationStatus(applicationNumber: string) {
    const application = await this.prisma.rtoApplication.findUnique({
      where: { applicationNumber },
      include: {
        vehicle: true,
      },
    })

    if (!application) {
      throw new NotFoundException("Application not found")
    }

    return application
  }

  async submitApplication(
    registrationNumber: string | null,
    applicationType: string,
    applicantName: string,
  ) {
    const applicationNumber = `RTO-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

    return this.prisma.rtoApplication.create({
      data: {
        registrationNumber,
        applicationNumber,
        applicationType,
        applicantName,
        status: "PENDING",
      },
    })
  }
}
