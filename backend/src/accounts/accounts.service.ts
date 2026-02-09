import { Injectable } from "@nestjs/common"

@Injectable()
export class AccountsService {
  getAccounts(phone: string) {
    return [
      {
        id: "elec",
        dept: "Electricity Department",
        accountNo: "ELEC-982374",
      },
      {
        id: "water",
        dept: "Water Supply Board",
        accountNo: "WATER-128374",
      },
      {
        id: "municipal",
        dept: "Municipal Corporation",
        accountNo: "PROP-556677",
      },
      {
        id: "transport",
        dept: "Transport Department",
        accountNo: "DL-01-AB-1234",
      },
      {
        id: "gas",
        dept: "Gas Authority",
        accountNo: "GAS-772211",
      },
      {
        id: "telecom",
        dept: "Telecom Services",
        accountNo: "TEL-998877",
      },
      {
        id: "housing",
        dept: "Housing Board",
        accountNo: "HOUSE-445566",
      },
    ]
  }
}
