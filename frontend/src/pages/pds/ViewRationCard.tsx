import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { API_BASE } from "../../api/config"
import { useAccountNumber } from "../../hooks/useAccountNumber"

interface RationCard {
  cardNumber: string
  cardType: string
  headOfFamily: string
  address: string
  fpsCode: string
  fpsName: string
  totalMembers: number
}

interface Entitlement {
  riceKg: number
  wheatKg: number
  sugarKg: number
  keroseneL: number
}

export default function ViewRationCard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("pds")

  const [card, setCard] = useState<RationCard | null>(null)
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accountNumber) {
      setLoading(false)
      return
    }
    
    async function loadData() {
      try {
        const [cardRes, entitlementRes] = await Promise.all([
          fetch(`${API_BASE}/pds/card/${accountNumber}`, { credentials: "include" }),
          fetch(`${API_BASE}/pds/entitlement/${accountNumber}`, { credentials: "include" }),
        ])

        if (cardRes.ok) {
          setCard(await cardRes.json())
        }
        if (entitlementRes.ok) {
          setEntitlement(await entitlementRes.json())
        }
      } catch (err) {
        console.error("Failed to load ration card")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [accountNumber])

  // Show error when no account
  if (!accountNumber) {
    return (
      <KioskLayout
        title="🍚 Ration Card"
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
      <KioskLayout title="Ration Card" showHeader={true} showNav={true}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-violet-600"></div>
        </div>
      </KioskLayout>
    )
  }

  if (!card) {
    return (
      <KioskLayout title="Ration Card" showHeader={true} showNav={true}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Card Not Found</h2>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout
      title="🍚 Ration Card"
      subtitle={`Card: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
    >
      <div className="max-w-4xl mx-auto">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-200">Card Type</p>
              <h2 className="text-3xl font-bold">{card.cardType}</h2>
            </div>
            <div className="text-right">
              <p className="text-violet-200">Members</p>
              <h2 className="text-4xl font-bold">{card.totalMembers}</h2>
            </div>
          </div>
        </div>

        {/* Card Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Card Details</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-slate-500 mb-1">Head of Family</p>
              <p className="text-lg font-semibold text-slate-800">{card.headOfFamily}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Card Number</p>
              <p className="text-lg font-semibold text-slate-800">{card.cardNumber}</p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-500 mb-1">Address</p>
              <p className="text-lg font-semibold text-slate-800">{card.address}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">FPS Code</p>
              <p className="text-lg font-semibold text-slate-800">{card.fpsCode}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">FPS Name</p>
              <p className="text-lg font-semibold text-slate-800">{card.fpsName}</p>
            </div>
          </div>
        </div>

        {/* Entitlement */}
        {entitlement && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Monthly Entitlement</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <span className="text-3xl mb-2 block">🍚</span>
                <p className="text-2xl font-bold text-amber-800">{entitlement.riceKg} kg</p>
                <p className="text-sm text-amber-600">Rice</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 text-center">
                <span className="text-3xl mb-2 block">🌾</span>
                <p className="text-2xl font-bold text-yellow-800">{entitlement.wheatKg} kg</p>
                <p className="text-sm text-yellow-600">Wheat</p>
              </div>
              <div className="bg-pink-50 rounded-xl p-4 text-center">
                <span className="text-3xl mb-2 block">🍬</span>
                <p className="text-2xl font-bold text-pink-800">{entitlement.sugarKg} kg</p>
                <p className="text-sm text-pink-600">Sugar</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <span className="text-3xl mb-2 block">⛽</span>
                <p className="text-2xl font-bold text-blue-800">{entitlement.keroseneL} L</p>
                <p className="text-sm text-blue-600">Kerosene</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/pds/transactions", { state: { accountNumber } })}
            className="bg-violet-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-violet-700"
          >
            📊 View Transactions
          </button>
          <button
            onClick={() => window.print()}
            className="bg-slate-700 text-white py-4 rounded-xl text-lg font-semibold hover:bg-slate-800"
          >
            🖨️ Print Card
          </button>
        </div>
      </div>
    </KioskLayout>
  )
}
