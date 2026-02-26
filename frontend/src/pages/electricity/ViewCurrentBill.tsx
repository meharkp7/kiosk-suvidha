import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { API_BASE } from "../../api/config"
import { useAccountNumber } from "../../hooks/useAccountNumber"

interface BillData {
  id: string
  accountNumber: string
  billingMonth: string
  billingDate: string
  unitsConsumed: number
  fixedCharge: number
  energyCharge: number
  tax: number
  lateFee: number
  totalAmount: number
  dueDate: string
  status: string
  tariffSlab?: string
}

export default function ViewCurrentBill() {
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("electricity")

  const [bill, setBill] = useState<BillData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accountNumber) {
      setError("No account selected")
      setLoading(false)
      return
    }

    async function loadBill() {
      try {
        const res = await fetch(`${API_BASE}/electricity/bill/${accountNumber}`, {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setBill(data)
        } else {
          setError("Failed to load bill")
        }
      } catch (err) {
        setError("Network error")
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
        title="Current Bill"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-amber-50 rounded-2xl p-8">
            <span className="text-6xl mb-4 block">⚡</span>
            <h2 className="text-2xl font-bold text-amber-800 mb-2">No Account Selected</h2>
            <p className="text-amber-600 mb-6">Please select your Electricity account from the services dashboard</p>
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

  if (loading) {
    return (
      <KioskLayout title="Current Bill" showHeader={true} showNav={true}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600"></div>
        </div>
      </KioskLayout>
    )
  }

  if (error || !bill) {
    return (
      <KioskLayout
        title="Current Bill"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 rounded-2xl p-8 text-center">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h2 className="text-2xl font-bold text-red-800 mb-2">{error || "No bill found"}</h2>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="mt-4 bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold"
            >
              Back to Services
            </button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout
      title="⚡ Electricity Bill"
      subtitle={`Account: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
      onHome={() => navigate("/")}
    >
      <div className="max-w-4xl mx-auto">
        {/* Bill Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100">Billing Month</p>
              <h2 className="text-3xl font-bold">{bill.billingMonth}</h2>
            </div>
            <div className="text-right">
              <p className="text-amber-100">Total Amount</p>
              <h2 className="text-4xl font-bold">₹{bill.totalAmount.toFixed(2)}</h2>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold ${
                bill.status === "PAID"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {bill.status}
            </span>
            {bill.status !== "PAID" && (
              <span className="text-amber-100">
                Due Date: {new Date(bill.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Bill Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Bill Breakdown</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
              <span className="text-slate-600">Units Consumed</span>
              <span className="text-xl font-bold text-slate-800">{bill.unitsConsumed} kWh</span>
            </div>

            {bill.tariffSlab && (
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                <span className="text-slate-600">Tariff Slab</span>
                <span className="text-lg font-semibold text-slate-800">{bill.tariffSlab}</span>
              </div>
            )}

            <div className="border-t border-slate-200 my-4"></div>

            <div className="flex justify-between items-center p-3">
              <span className="text-slate-600">Fixed Charge</span>
              <span className="text-lg text-slate-800">₹{bill.fixedCharge.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center p-3">
              <span className="text-slate-600">Energy Charge</span>
              <span className="text-lg text-slate-800">₹{bill.energyCharge.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center p-3">
              <span className="text-slate-600">Tax</span>
              <span className="text-lg text-slate-800">₹{bill.tax.toFixed(2)}</span>
            </div>

            {bill.lateFee > 0 && (
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-red-600">Late Fee</span>
                <span className="text-lg text-red-600">₹{bill.lateFee.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t-2 border-slate-300 my-4"></div>

            <div className="flex justify-between items-center p-4 bg-amber-50 rounded-xl">
              <span className="text-xl font-bold text-slate-800">Total Amount</span>
              <span className="text-2xl font-bold text-amber-600">
                ₹{bill.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {bill.status !== "PAID" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() =>
                navigate("/electricity/pay-bill", {
                  state: { accountNumber, bill },
                })
              }
              className="bg-blue-800 text-white py-5 rounded-xl text-xl font-semibold hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg"
            >
              💳 Pay Bill Now
            </button>
            <button
              onClick={() => window.print()}
              className="bg-slate-700 text-white py-5 rounded-xl text-xl font-semibold hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg"
            >
              🖨️ Print Bill
            </button>
          </div>
        )}

        {bill.status === "PAID" && (
          <button
            onClick={() => window.print()}
            className="w-full bg-green-600 text-white py-5 rounded-xl text-xl font-semibold hover:bg-green-700 transition-all active:scale-[0.98] shadow-lg"
          >
            🖨️ Print Receipt
          </button>
        )}
      </div>
    </KioskLayout>
  )
}
