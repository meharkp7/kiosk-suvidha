import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import { API_BASE } from "../../api/config"

export default function GasSurrender() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const consumerNumber = useAccountNumber("gas")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [requestId, setRequestId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason) {
      alert("Please provide a reason for surrender")
      return
    }
    setLoading(true)
    
    try {
      const res = await fetch(`${API_BASE}/gas/surrender`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          consumerNumber,
          reason
        })
      })

      if (!res.ok) {
        throw new Error('Failed to submit surrender request')
      }

      const data = await res.json()
      setRequestId(data.requestId)
      setSubmitted(true)
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to submit surrender request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <KioskLayout title="✅ Submitted" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-xl p-8">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-green-800">Surrender Request Submitted!</h2>
            <p className="text-green-600 mt-2">Reference: {requestId}</p>
            <button onClick={() => navigate("/services-dashboard")} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">Back to Services</button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout title="🚫 Surrender Connection" subtitle={`Consumer: ${consumerNumber}`} showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-600">⚠️ Surrender LPG Connection</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">This will permanently close your LPG connection. Your security deposit will be refunded within 30 days.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Surrender</label>
                <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                  <option value="">Select reason</option>
                  <option value="moving">Moving to different city</option>
                  <option value="piped">Switching to PNG/Piped Gas</option>
                  <option value="deceased">Consumer deceased</option>
                  <option value="duplicate">Duplicate connection</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-xl text-lg font-medium">{loading ? "Submitting..." : "Submit Surrender Request"}</button>
        </form>
      </div>
    </KioskLayout>
  )
}
