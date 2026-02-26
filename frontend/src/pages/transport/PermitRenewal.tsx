import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"

export default function PermitRenewal() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const vehicleNumber = useAccountNumber("transport")
  const [permitData, setPermitData] = useState({
    permitNumber: "PER123456",
    vehicleNumber: vehicleNumber || "DL01AB1234",
    permitType: "National Permit",
    validFrom: "2023-01-01",
    validTo: "2024-12-31"
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 1500)
  }

  if (submitted) {
    return (
      <KioskLayout title="✅ Renewed" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-xl p-8">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-bold text-green-800">Permit Renewed!</h2>
            <p className="text-green-600 mt-2">Valid for 5 more years</p>
            <button onClick={() => navigate("/services-dashboard")} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">Back to Services</button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout title="📄 Permit Renewal" subtitle={`Vehicle: ${vehicleNumber}`} showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Current Permit Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-gray-600">Permit Number:</span><span className="font-semibold">{permitData.permitNumber}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Vehicle:</span><span className="font-semibold">{permitData.vehicleNumber}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Type:</span><span className="font-semibold">{permitData.permitType}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Valid To:</span><span className="font-semibold">{permitData.validTo}</span></div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium">{loading ? "Processing..." : "Renew Permit (₹5,000)"}</button>
        </form>
      </div>
    </KioskLayout>
  )
}
