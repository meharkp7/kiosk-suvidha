import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { API_BASE } from "../../api/config"
import { useAccountNumber } from "../../hooks/useAccountNumber"

interface PropertyData {
  propertyId: string
  ownerName: string
  address: string
  wardNumber: string
  propertyType: string
  builtUpArea: number
  annualValue: number
}

export default function PropertyDetails() {
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("municipal")

  const [property, setProperty] = useState<PropertyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accountNumber) {
      setLoading(false)
      return
    }
    
    async function loadProperty() {
      try {
        const res = await fetch(`${API_BASE}/municipal/property/${accountNumber}`, {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setProperty(data)
        }
      } catch (err) {
        console.error("Failed to load property")
      } finally {
        setLoading(false)
      }
    }

    loadProperty()
  }, [accountNumber])

  // Show error when no account
  if (!accountNumber) {
    return (
      <KioskLayout
        title="🏛️ Property Details"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-emerald-50 rounded-2xl p-8">
            <span className="text-6xl mb-4 block">🏛️</span>
            <h2 className="text-2xl font-bold text-emerald-800 mb-2">No Property Selected</h2>
            <p className="text-emerald-600 mb-6">Please select your Municipal account from the services dashboard</p>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold"
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
      <KioskLayout title="Property Details" showHeader={true} showNav={true}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600"></div>
        </div>
      </KioskLayout>
    )
  }

  if (!property) {
    return (
      <KioskLayout title="Property Details" showHeader={true} showNav={true}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Property Not Found</h2>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout
      title="🏛️ Property Details"
      subtitle={`Property ID: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 mb-6 text-white">
          <h2 className="text-2xl font-bold">{property.ownerName}</h2>
          <p className="text-emerald-200">{property.propertyType}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Property Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-slate-500 mb-1">Ward Number</p>
              <p className="text-lg font-semibold">{property.wardNumber}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Built-up Area</p>
              <p className="text-lg font-semibold">{property.builtUpArea} sq.ft</p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-500 mb-1">Address</p>
              <p className="text-lg font-semibold">{property.address}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Annual Value</p>
              <p className="text-lg font-semibold text-emerald-600">₹{property.annualValue}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/municipal/pay-tax", { state: { accountNumber } })}
          className="w-full bg-emerald-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700"
        >
          💳 Pay Property Tax
        </button>
      </div>
    </KioskLayout>
  )
}
