import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import { API_BASE } from "../../api/config"

export default function Noc() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const vehicleNumber = useAccountNumber("transport")
  const [reason, setReason] = useState("")
  const [toState, setToState] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [applicationNumber, setApplicationNumber] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason) {
      alert("Please select a reason")
      return
    }
    setLoading(true)
    
    try {
      const res = await fetch(`${API_BASE}/transport/application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          registrationNumber: vehicleNumber,
          applicationType: "NOC",
          applicantName: vehicleNumber,
          details: { reason, toState }
        })
      })

      if (!res.ok) {
        throw new Error('Failed to submit application')
      }

      const data = await res.json()
      setApplicationNumber(data.applicationNumber)
      setSubmitted(true)
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to submit application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <KioskLayout title="✅ NOC Issued" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-xl p-8">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-green-800">NOC Generated!</h2>
            <p className="text-green-600 mt-2">Application Number: {applicationNumber}</p>
            <button onClick={() => navigate("/services-dashboard")} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">Back to Services</button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout title="📋 NOC" subtitle={`Vehicle: ${vehicleNumber}`} showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Apply for No Objection Certificate</h3>
            <div className="space-y-4">
              <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                <option value="">Select Reason</option>
                <option value="sale">Vehicle Sale</option>
                <option value="transfer">Inter-State Transfer</option>
                <option value="re-registration">Re-registration</option>
                <option value="scrap">Vehicle Scrapping</option>
              </select>
              <input type="text" placeholder="To State (if inter-state)" value={toState} onChange={(e) => setToState(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-600">Vehicle: <span className="font-bold">{vehicleNumber || "DL01AB1234"}</span></p>
              <p className="text-sm text-gray-600">NOC Fee: <span className="font-bold">₹200</span></p>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium">{loading ? "Processing..." : "Generate NOC"}</button>
        </form>
      </div>
    </KioskLayout>
  )
}
