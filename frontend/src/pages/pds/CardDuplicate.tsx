import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import { API_BASE } from "../../api/config"

export default function CardDuplicate() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const cardNumber = useAccountNumber("pds")
  const [reason, setReason] = useState("")
  const [firCopy, setFirCopy] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [requestId, setRequestId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason) {
      alert("Please select a reason")
      return
    }
    setLoading(true)
    
    try {
      const res = await fetch(`${API_BASE}/pds/member-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          cardNumber,
          requestType: "DUPLICATE_CARD",
          details: { reason }
        })
      })

      if (!res.ok) {
        throw new Error('Failed to submit application')
      }

      const data = await res.json()
      setRequestId(data.requestId)
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
      <KioskLayout title="✅ Applied" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-xl p-8">
            <div className="text-6xl mb-4">🆔</div>
            <h2 className="text-2xl font-bold text-green-800">Application Submitted!</h2>
            <p className="text-green-600 mt-2">Request ID: {requestId}</p>
            <button onClick={() => navigate("/services-dashboard")} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">Back to Services</button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout title="🆔 Duplicate Card" subtitle={`Card: ${cardNumber}`} showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Apply for Duplicate Ration Card</h3>
            <div className="space-y-4">
              <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                <option value="">Select Reason</option>
                <option value="lost">Card Lost</option>
                <option value="damaged">Card Damaged</option>
                <option value="stolen">Card Stolen</option>
                <option value="torn">Card Torn</option>
              </select>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload FIR Copy (if lost/stolen)</label>
                <input type="file" accept="image/*,.pdf" onChange={(e) => setFirCopy(e.target.files?.[0] || null)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-600">Card Number: <span className="font-bold">{cardNumber}</span></p>
              <p className="text-sm text-gray-600">Fee: <span className="font-bold">₹50</span></p>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium">{loading ? "Submitting..." : "Apply for Duplicate"}</button>
        </form>
      </div>
    </KioskLayout>
  )
}
