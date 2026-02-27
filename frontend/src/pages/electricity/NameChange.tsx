import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import { API_BASE } from "../../api/config"

export default function NameChange() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("electricity")
  const [currentName, setCurrentName] = useState("John Doe")
  const [newName, setNewName] = useState("")
  const [reason, setReason] = useState("")
  const [idProof, setIdProof] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !reason) {
      alert(t("fillRequiredFields") || "Please fill all required fields")
      return
    }
    setLoading(true)
    
    try {
      const res = await fetch(`${API_BASE}/electricity/name-change`, {
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Request Submitted!</h2>
            <p className="text-green-600">Your name change request has been submitted successfully.</p>
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
            <h3 className="text-lg font-semibold mb-4">Current Details</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600">Current Name: <span className="font-bold">{currentName}</span></p>
              <p className="text-gray-600">Account: <span className="font-bold">{accountNumber}</span></p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">New Name Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Name</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Enter new name" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Change</label>
                <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                  <option value="">Select reason</option>
                  <option value="marriage">Marriage</option>
                  <option value="divorce">Divorce</option>
                  <option value="legal">Legal Name Change</option>
                  <option value="correction">Name Correction</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof</label>
                <input type="file" accept="image/*,.pdf" onChange={(e) => setIdProof(e.target.files?.[0] || null)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium">{loading ? "Submitting..." : "Submit Request"}</button>
        </form>
      </div>
    </KioskLayout>
  )
}
