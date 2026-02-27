import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import { API_BASE } from "../../api/config"

interface Challan {
  id: string
  challanNumber: string
  violationDate: string
  violationType: string
  violationLocation: string
  fineAmount: number
  status: string
  paidDate?: string
}

export default function ChallanHistory() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("transport")

  const [challans, setChallans] = useState<Challan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accountNumber) {
      setLoading(false)
      return
    }
    
    async function loadChallans() {
      try {
        const res = await fetch(`${API_BASE}/transport/challans/${accountNumber}`, {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setChallans(data)
        }
      } catch (err) {
        console.error("Failed to load challans")
      } finally {
        setLoading(false)
      }
    }

    loadChallans()
  }, [accountNumber])

  // Show error when no account
  if (!accountNumber) {
    return (
      <KioskLayout
        title="🚗 Challan History"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 rounded-2xl p-8">
            <span className="text-6xl mb-4 block">🚗</span>
            <h2 className="text-2xl font-bold text-red-800 mb-2">No Vehicle Selected</h2>
            <p className="text-red-600 mb-6">Please select your Transport account from the services dashboard</p>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-red-600 text-white px-8 py-4 rounded-xl font-semibold"
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
      <KioskLayout
        title="🚗 Challan History"
        subtitle={`Vehicle: ${accountNumber}`}
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center">
            <span className="text-6xl animate-spin">⏳</span>
            <p className="mt-4 text-xl text-slate-600">Loading challan history...</p>
          </div>
        </div>
      </KioskLayout>
    )
  }

  const paidChallans = challans.filter(c => c.status === "PAID")
  const pendingChallans = challans.filter(c => c.status === "PENDING")
  const totalPaid = paidChallans.reduce((sum, c) => sum + c.fineAmount, 0)
  const totalPending = pendingChallans.reduce((sum, c) => sum + c.fineAmount, 0)

  return (
    <KioskLayout
      title="🚗 Challan History"
      subtitle={`Vehicle: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
    >
      <div className="max-w-6xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">📋</span>
              <span className="text-2xl font-bold text-slate-800">{challans.length}</span>
            </div>
            <p className="text-slate-600">Total Challans</p>
          </div>
          <div className="bg-green-50 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">✅</span>
              <span className="text-2xl font-bold text-green-700">{paidChallans.length}</span>
            </div>
            <p className="text-green-600">Paid (₹{totalPaid})</p>
          </div>
          <div className="bg-red-50 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">⏰</span>
              <span className="text-2xl font-bold text-red-700">{pendingChallans.length}</span>
            </div>
            <p className="text-red-600">Pending (₹{totalPending})</p>
          </div>
        </div>

        {/* Pending Challans */}
        {pendingChallans.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-red-700 mb-4">Pending Challans</h3>
            <div className="space-y-4">
              {pendingChallans.map((challan) => (
                <div key={challan.id} className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🚨</span>
                        <span className="font-bold text-lg">{challan.challanNumber}</span>
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          PENDING
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Violation:</span>
                          <p className="font-semibold">{challan.violationType}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Location:</span>
                          <p className="font-semibold">{challan.violationLocation}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Date:</span>
                          <p className="font-semibold">{new Date(challan.violationDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Fine Amount:</span>
                          <p className="font-bold text-red-700 text-lg">₹{challan.fineAmount}</p>
                        </div>
                      </div>
                    </div>
                    <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700">
                      Pay Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paid Challans */}
        {paidChallans.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-green-700 mb-4">Paid Challans</h3>
            <div className="space-y-4">
              {paidChallans.map((challan) => (
                <div key={challan.id} className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">✅</span>
                        <span className="font-bold text-lg">{challan.challanNumber}</span>
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          PAID
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Violation:</span>
                          <p className="font-semibold">{challan.violationType}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Location:</span>
                          <p className="font-semibold">{challan.violationLocation}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Date:</span>
                          <p className="font-semibold">{new Date(challan.violationDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Paid Date:</span>
                          <p className="font-semibold text-green-700">
                            {challan.paidDate && new Date(challan.paidDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 text-sm">Amount Paid</p>
                      <p className="font-bold text-green-700 text-lg">₹{challan.fineAmount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {challans.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🎉</span>
            <h3 className="text-2xl font-bold text-green-700 mb-2">No Challans Found</h3>
            <p className="text-slate-600">Great driving! Keep it up!</p>
          </div>
        )}
      </div>
    </KioskLayout>
  )
}
