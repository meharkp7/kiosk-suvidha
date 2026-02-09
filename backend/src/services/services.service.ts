import { Injectable } from "@nestjs/common"

@Injectable()
export class ServicesService {
  getServices(department: string) {
    const map: Record<string, any[]> = {
      "Electricity Department": [
        { id: "elec-pay", name: "Pay Electricity Bill" },
        { id: "elec-complaint", name: "Raise Power Complaint" },
        { id: "elec-history", name: "View Bill History" },
        { id: "elec-load", name: "Apply Load Change" },
      ],
      "Water Supply Board": [
        { id: "water-pay", name: "Pay Water Bill" },
        { id: "water-complaint", name: "Report Leakage" },
        { id: "water-connection", name: "New Connection" },
        { id: "water-history", name: "View Usage History" },
      ],
      "Municipal Corporation": [
        { id: "prop-tax", name: "Pay Property Tax" },
        { id: "trade-lic", name: "Trade License" },
        { id: "birth-cert", name: "Birth Certificate" },
        { id: "death-cert", name: "Death Certificate" },
      ],
      "Transport Department": [
        { id: "dl-renew", name: "Renew Driving License" },
        { id: "rc-status", name: "RC Status" },
        { id: "challan", name: "Pay Challan" },
        { id: "vehicle-info", name: "Vehicle Info" },
      ],
    }

    return map[department] || []
  }
}