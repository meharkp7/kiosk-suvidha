import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"

export default function TaxReceipt() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const propertyId = useAccountNumber("municipal")
  const [receipts, setReceipts] = useState([
    { id: "TR001", year: "2024-25", amount: 12500, date: "2024-04-15", status: "Paid" },
    { id: "TR002", year: "2023-24", amount: 11800, date: "2023-04-10", status: "Paid" },
    { id: "TR003", year: "2022-23", amount: 11200, date: "2022-04-12", status: "Paid" }
  ])

  return (
    <KioskLayout title="📃 Tax Receipts" subtitle={`Property: ${propertyId}`} showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Download Tax Receipts</h3>
          <div className="space-y-4">
            {receipts.map((receipt) => (
              <div key={receipt.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">Financial Year {receipt.year}</p>
                  <p className="text-sm text-gray-500">Receipt: {receipt.id} • Paid: {receipt.date}</p>
                  <p className="text-sm text-gray-600">Amount: ₹{receipt.amount.toLocaleString()}</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </KioskLayout>
  )
}
