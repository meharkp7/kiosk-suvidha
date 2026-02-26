import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { API_BASE } from "../../api/config"
import { useAccountNumber } from "../../hooks/useAccountNumber"

interface Transaction {
  id: string
  transactionId: string
  transactionDate: string
  riceTaken: number
  wheatTaken: number
  sugarTaken: number
  keroseneTaken: number
  totalAmount: number
  fpsCode: string
}

export default function ViewTransactions() {
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("pds")

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accountNumber) {
      setLoading(false)
      return
    }
    
    async function loadTransactions() {
      try {
        const res = await fetch(`${API_BASE}/pds/transactions/${accountNumber}`, {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setTransactions(data)
        }
      } catch (err) {
        console.error("Failed to load transactions")
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [accountNumber])

  // Show error when no account
  if (!accountNumber) {
    return (
      <KioskLayout
        title="🍚 Ration Transactions"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-violet-50 rounded-2xl p-8">
            <span className="text-6xl mb-4 block">🍚</span>
            <h2 className="text-2xl font-bold text-violet-800 mb-2">No Card Selected</h2>
            <p className="text-violet-600 mb-6">Please select your PDS account from the services dashboard</p>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-violet-600 text-white px-8 py-4 rounded-xl font-semibold"
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
      title="🍚 Ration Transactions"
      subtitle={`Card: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
    >
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-violet-600"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-violet-50 rounded-2xl p-8 text-center">
            <span className="text-6xl mb-4 block">📭</span>
            <h2 className="text-2xl font-bold text-violet-800">No Transactions</h2>
            <p className="text-violet-600">No ration purchases recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((t) => (
              <div key={t.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-500">Transaction ID</p>
                    <p className="text-lg font-bold text-slate-800">{t.transactionId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Date</p>
                    <p className="font-semibold">
                      {new Date(t.transactionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  {t.riceTaken > 0 && (
                    <div className="bg-amber-50 rounded-lg p-3 text-center">
                      <p className="font-bold text-amber-800">{t.riceTaken} kg</p>
                      <p className="text-xs text-amber-600">Rice</p>
                    </div>
                  )}
                  {t.wheatTaken > 0 && (
                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                      <p className="font-bold text-yellow-800">{t.wheatTaken} kg</p>
                      <p className="text-xs text-yellow-600">Wheat</p>
                    </div>
                  )}
                  {t.sugarTaken > 0 && (
                    <div className="bg-pink-50 rounded-lg p-3 text-center">
                      <p className="font-bold text-pink-800">{t.sugarTaken} kg</p>
                      <p className="text-xs text-pink-600">Sugar</p>
                    </div>
                  )}
                  {t.keroseneTaken > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="font-bold text-blue-800">{t.keroseneTaken} L</p>
                      <p className="text-xs text-blue-600">Kerosene</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-violet-50 rounded-lg">
                  <span className="text-violet-800 font-semibold">Total: ₹{t.totalAmount}</span>
                  <span className="text-sm text-violet-600">FPS: {t.fpsCode}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </KioskLayout>
  )
}
