import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { API_BASE } from "../../api/config"
import { useAccountNumber } from "../../hooks/useAccountNumber"

interface Entitlement {
  cardType: string
  riceKg: number
  wheatKg: number
  sugarKg: number
  keroseneL: number
  validFrom: string
  validUpto: string
}

export default function ViewEntitlement() {
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("pds")

  const [entitlement, setEntitlement] = useState<Entitlement | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accountNumber) {
      setLoading(false)
      return
    }
    
    async function loadEntitlement() {
      try {
        const res = await fetch(`${API_BASE}/pds/entitlement/${accountNumber}`, {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setEntitlement(data)
        }
      } catch (err) {
        console.error("Failed to load entitlement")
      } finally {
        setLoading(false)
      }
    }

    loadEntitlement()
  }, [accountNumber])

  // Show error when no account
  if (!accountNumber) {
    return (
      <KioskLayout
        title="🍚 Ration Entitlement"
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

  if (loading) {
    return (
      <KioskLayout title="Entitlement" showHeader={true} showNav={true}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-violet-600"></div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout
      title="🍚 Ration Entitlement"
      subtitle={`Card: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
    >
      <div className="max-w-4xl mx-auto">
        {entitlement ? (
          <>
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-6 mb-6 text-white text-center">
              <p className="text-violet-200">Card Type</p>
              <h2 className="text-3xl font-bold">{entitlement.cardType}</h2>
              <p className="text-violet-200 mt-2">
                Valid: {new Date(entitlement.validFrom).toLocaleDateString()} - {new Date(entitlement.validUpto).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Monthly Quota</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-amber-50 rounded-xl p-6 text-center">
                  <span className="text-4xl mb-2 block">🍚</span>
                  <p className="text-3xl font-bold text-amber-800">{entitlement.riceKg}</p>
                  <p className="text-amber-600">kg Rice</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-6 text-center">
                  <span className="text-4xl mb-2 block">🌾</span>
                  <p className="text-3xl font-bold text-yellow-800">{entitlement.wheatKg}</p>
                  <p className="text-yellow-600">kg Wheat</p>
                </div>
                <div className="bg-pink-50 rounded-xl p-6 text-center">
                  <span className="text-4xl mb-2 block">🍬</span>
                  <p className="text-3xl font-bold text-pink-800">{entitlement.sugarKg}</p>
                  <p className="text-pink-600">kg Sugar</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <span className="text-4xl mb-2 block">⛽</span>
                  <p className="text-3xl font-bold text-blue-800">{entitlement.keroseneL}</p>
                  <p className="text-blue-600">L Kerosene</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-violet-50 rounded-xl p-4 text-center">
              <p className="text-violet-700">
                <span className="font-semibold">📍 Note:</span> Collect your ration from your designated FPS shop
              </p>
            </div>
          </>
        ) : (
          <div className="bg-violet-50 rounded-2xl p-8 text-center">
            <span className="text-6xl mb-4 block">📭</span>
            <h2 className="text-2xl font-bold text-violet-800">No Entitlement Data</h2>
          </div>
        )}
      </div>
    </KioskLayout>
  )
}
