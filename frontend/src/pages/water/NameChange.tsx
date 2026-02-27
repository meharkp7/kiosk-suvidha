import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import { API_BASE } from "../../api/config"

export default function WaterNameChange() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("water")
  const [currentName, setCurrentName] = useState("John Doe")
  const [newName, setNewName] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !reason) {
      alert(t("fillRequiredFields") || "Please fill all required fields")
      return
    }
    setLoading(true)
    
    try {
      const res = await fetch(`${API_BASE}/water/name-change`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          accountNumber,
          newName,
          reason
        })
      })

      if (!res.ok) {
        throw new Error('Failed to submit request')
      }

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
      <KioskLayout title="✅ Success" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-xl p-8">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-green-800">Request Submitted!</h2>
            <button onClick={() => navigate("/services-dashboard")} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">Back to Services</button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout title="📝 Name Change" subtitle={`Account: ${accountNumber}`} showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Change Account Name</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Name</label>
                <input type="text" value={currentName} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Name</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                  <option value="">Select reason</option>
                  <option value="marriage">Marriage</option>
                  <option value="sale">Property Sale/Purchase</option>
                  <option value="correction">Correction</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium">{loading ? "Submitting..." : "Submit Request"}</button>
        </form>
      </div>
    </KioskLayout>
  )
}
