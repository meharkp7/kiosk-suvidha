import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import { API_BASE } from "../../api/config"

export default function FpsChange() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const cardNumber = useAccountNumber("pds")
  const [currentFps, setCurrentFps] = useState("FPS001 - Delhi Store")
  const [newFps, setNewFps] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [requestId, setRequestId] = useState("")

  const fpsList = [
    { id: "FPS001", name: "Delhi Store - 123 Main Road" },
    { id: "FPS002", name: "Khan Market - 45 Khan Market" },
    { id: "FPS003", name: "Connaught Place - 78 CP" },
    { id: "FPS004", name: "Karol Bagh - 89 KB Road" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFps || !reason) {
      alert(t("fillRequiredFields") || "Please fill all required fields")
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
          requestType: "FPS_CHANGE",
          details: { currentFps, newFps, reason }
        })
      })

      if (!res.ok) {
        throw new Error('Failed to submit request')
      }

      const data = await res.json()
      setRequestId(data.requestId)
      setSubmitted(true)
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to submit request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <KioskLayout title="✅ Submitted" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-xl p-8">
            <div className="text-6xl mb-4">🏪</div>
            <h2 className="text-2xl font-bold text-green-800">Request Submitted!</h2>
            <p className="text-green-600 mt-2">Request ID: {requestId}</p>
            <button onClick={() => navigate("/services-dashboard")} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">Back to Services</button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout title="🏪 Change FPS" subtitle={`Card: ${cardNumber}`} showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Current FPS</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium">{currentFps}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Select New FPS</h3>
            <div className="space-y-4">
              <select value={newFps} onChange={(e) => setNewFps(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                <option value="">Select New FPS</option>
                {fpsList.filter(fps => fps.id !== "FPS001").map(fps => (
                  <option key={fps.id} value={fps.id}>{fps.name}</option>
                ))}
              </select>
              <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                <option value="">Select Reason</option>
                <option value="shifted">Shifted to New Area</option>
                <option value="far">Current FPS Too Far</option>
                <option value="quality">Quality Issues at Current FPS</option>
                <option value="convenience">More Convenient Location</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium">{loading ? "Submitting..." : "Submit Request"}</button>
        </form>
      </div>
    </KioskLayout>
  )
}
