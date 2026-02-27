import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
  department: string
}

export default function ReceiptDownload() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("electricity")
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accountNumber) {
      setLoading(false)
      return
    }

    async function loadReceipts() {
      try {
        const res = await fetch(`${API_BASE}/payments/history?accountNumber=${accountNumber}&department=electricity`, {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          if (data.success && Array.isArray(data.history)) {
            // Map payment history to receipt format
            const mappedReceipts = data.history.map((payment: any) => ({
              id: payment.id || `RCP${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
              date: payment.createdAt ? new Date(payment.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              amount: payment.amount || 0,
              status: payment.status || "PAID",
              type: `${payment.department?.charAt(0).toUpperCase() + payment.department?.slice(1)} Bill`,
              reference: payment.paymentId || payment.id || "N/A",
              department: payment.department || "electricity"
            }))
            setReceipts(mappedReceipts)
          } else {
            setReceipts([])
          }
        } else {
          setReceipts([])
        }
      } catch (err) {
        console.error("Failed to load receipts:", err)
        setReceipts([])
      } finally {
        setLoading(false)
      }
    }

    loadReceipts()
  }, [accountNumber])

  const handleDownload = (receipt: Receipt) => {
    // Generate receipt content
    const receiptContent = `
================================
      SUVIDHA KIOSK
   Payment Receipt
================================

Receipt ID: ${receipt.id}
Date: ${receipt.date}
Account Number: ${accountNumber}
Department: ${receipt.department?.toUpperCase()}

Type: ${receipt.type}
Reference: ${receipt.reference}
Amount Paid: ₹${receipt.amount.toFixed(2)}
Status: ${receipt.status}

================================
Thank you for using SUVIDHA!
www.suvidha.gov.in
================================
    `

    // Create and download text file
    const dataBlob = new Blob([receiptContent], { type: "text/plain" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `receipt-${receipt.id}.txt`
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
