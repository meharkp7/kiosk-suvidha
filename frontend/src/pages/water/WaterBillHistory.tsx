import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { API_BASE } from "../../api/config"
import { useAccountNumber } from "../../hooks/useAccountNumber"

interface BillRecord {
  id: string
  billingMonth: string
  billingDate: string
  unitsConsumed: number
  totalAmount: number
  status: string
  paidDate?: string
}

export default function WaterBillHistory() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("water")

  const [bills, setBills] = useState<BillRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accountNumber) {
      setLoading(false)
      return
    }
    
    async function loadHistory() {
      try {
        const res = await fetch(`${API_BASE}/water/history/${accountNumber}`, {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          // Ensure data is an array
          if (Array.isArray(data)) {
            setBills(data)
          } else {
            console.error("Invalid bills data format:", data)
            setBills([])
          }
        }
      } catch (err) {
        console.error("Failed to load history")
        setBills([])
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [accountNumber])

  // Show error when no account
  if (!accountNumber) {
    return (
      <KioskLayout
        title="💧 Water Bill History"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-blue-50 rounded-2xl p-8">
            <span className="text-6xl mb-4 block">💧</span>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">No Account Selected</h2>
            <p className="text-blue-600 mb-6">Please select your Water account from the services dashboard</p>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold"
            >
              Go to Services Dashboard →
            </button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout
      title="💧 Water Bill History"
      subtitle={`Account: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
    >
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        ) : bills.length === 0 ? (
          <div className="bg-blue-50 rounded-2xl p-8 text-center">
            <span className="text-6xl mb-4 block">📭</span>
            <h2 className="text-2xl font-bold text-blue-800">No History Found</h2>
            <p className="text-blue-600">No billing history available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                      bill.status === "PAID"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {bill.status === "PAID" ? "✓" : "!"}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-800">{bill.billingMonth}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(bill.billingDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-slate-400">{bill.unitsConsumed} KL</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">
                    ₹{bill.totalAmount.toFixed(2)}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      bill.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {bill.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </KioskLayout>
  )
}
