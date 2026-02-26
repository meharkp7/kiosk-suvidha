import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { API_BASE } from "../../api/config"
import { useAccountNumber } from "../../hooks/useAccountNumber"

interface BillData {
  id: string
  accountNumber: string
  billingMonth: string
  unitsConsumed: number
  totalAmount: number
  dueDate: string
  status: string
}

export default function ViewWaterBill() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("water")

  const [bill, setBill] = useState<BillData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accountNumber) {
      setLoading(false)
      return
    }
    
    async function loadBill() {
      try {
        const res = await fetch(`${API_BASE}/water/bill/${accountNumber}`, {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setBill(data)
        }
      } catch (err) {
        console.error("Failed to load bill")
      } finally {
        setLoading(false)
      }
    }

    loadBill()
  }, [accountNumber])

  // Show error state when no account number
  if (!accountNumber) {
    return (
      <KioskLayout
        title={`💧 ${t("waterBill")}`}
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-blue-50 rounded-2xl p-8">
            <span className="text-6xl mb-4 block">💧</span>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">{t("noAccountSelected")}</h2>
            <p className="text-blue-600 mb-6">{t("selectWaterAccount")}</p>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold"
            >
              {t("goToServicesDashboard")} →
            </button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  if (loading) {
    return (
      <KioskLayout title="Water Bill" showHeader={true} showNav={true}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </div>
      </KioskLayout>
    )
  }

  if (!bill) {
    return (
      <KioskLayout title="Water Bill" showHeader={true} showNav={true}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">No Bill Found</h2>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout
      title="💧 Water Bill"
      subtitle={`Account: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Billing Month</p>
              <h2 className="text-3xl font-bold">{bill.billingMonth}</h2>
            </div>
            <div className="text-right">
              <p className="text-blue-100">Amount</p>
              <h2 className="text-4xl font-bold">₹{bill.totalAmount.toFixed(2)}</h2>
            </div>
          </div>
          <span
            className={`mt-4 inline-block px-4 py-1 rounded-full text-sm font-semibold ${
              bill.status === "PAID" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {bill.status}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl mb-4">
            <span className="text-slate-600">Units Consumed</span>
            <span className="text-2xl font-bold text-slate-800">{bill.unitsConsumed} KL</span>
          </div>

          {bill.status !== "PAID" && (
            <button
              onClick={() =>
                navigate("/water/pay-bill", { state: { accountNumber, bill } })
              }
              className="w-full bg-blue-800 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700"
            >
              💳 Pay Bill
            </button>
          )}
        </div>
      </div>
    </KioskLayout>
  )
}
