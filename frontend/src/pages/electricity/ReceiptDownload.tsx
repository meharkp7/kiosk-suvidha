import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { API_BASE } from "../../api/config"
import { useAccountNumber } from "../../hooks/useAccountNumber"

type Receipt = {
  id: string
  date: string
  amount: number
  status: string
  type: string
  reference: string
}

export default function ReceiptDownload() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const accountNumber = useAccountNumber("electricity")
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accountNumber) return

    // Mock receipt data
    const mockReceipts: Receipt[] = [
      {
        id: "RCP202403001",
        date: "2024-03-15",
        amount: 990.50,
        status: "PAID",
        type: "Electricity Bill",
        reference: "EL123456789"
      },
      {
        id: "RCP202402001",
        date: "2024-02-20",
        amount: 1023.00,
        status: "PAID",
        type: "Electricity Bill",
        reference: "EL123456789"
      },
      {
        id: "RCP202401001",
        date: "2024-01-20",
        amount: 858.00,
        status: "PAID",
        type: "Electricity Bill",
        reference: "EL123456789"
      }
    ]

    setReceipts(mockReceipts)
    setLoading(false)
  }, [accountNumber])

  const handleDownload = (receipt: Receipt) => {
    // Generate PDF receipt
    const receiptData = {
      id: receipt.id,
      date: receipt.date,
      amount: receipt.amount,
      type: receipt.type,
      reference: receipt.reference,
      accountNumber
    }

    // Create and download PDF
    const dataStr = JSON.stringify(receiptData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `receipt-${receipt.id}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (!accountNumber) {
    return (
      <KioskLayout title="⚠️ Error" showHeader={true} showNav={true}>
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700">No account number found</p>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout
      title="🧾 Download Receipts"
      subtitle={`Account: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
      onHome={() => navigate("/")}
    >
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : receipts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No receipts found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {receipts.map((receipt) => (
              <div
                key={receipt.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{receipt.type}</h3>
                    <p className="text-sm text-gray-500">Receipt ID: {receipt.id}</p>
                    <p className="text-sm text-gray-500">Date: {receipt.date}</p>
                    <p className="text-sm text-gray-500">Reference: {receipt.reference}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₹{receipt.amount.toFixed(2)}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      receipt.status === "PAID" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {receipt.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleDownload(receipt)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    📥 Download Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </KioskLayout>
  )
}
