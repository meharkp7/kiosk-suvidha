import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"

export default function FitnessCertificate() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const vehicleNumber = useAccountNumber("transport")
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
      <KioskLayout title="✅ Applied" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-xl p-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-800">Application Submitted!</h2>
            <p className="text-green-600 mt-2">Visit RTO for vehicle inspection</p>
            <button onClick={() => navigate("/services-dashboard")} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">Back to Services</button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout title="✅ Fitness Certificate" subtitle={`Vehicle: ${vehicleNumber}`} showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Vehicle Fitness Check</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 text-sm">Required Documents:</p>
            <ul className="list-disc list-inside text-yellow-700 text-sm mt-2">
              <li>Registration Certificate (RC)</li>
              <li>Insurance Certificate</li>
              <li>PUC Certificate</li>
              <li>Tax Receipt</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Vehicle Number: <span className="font-bold">{vehicleNumber || "DL01AB1234"}</span></p>
            <p className="text-sm text-gray-600">Inspection Fee: <span className="font-bold">₹600</span></p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium">{loading ? "Processing..." : "Book Fitness Test"}</button>
        </form>
      </div>
    </KioskLayout>
  )
}
