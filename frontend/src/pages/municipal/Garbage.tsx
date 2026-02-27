import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import { API_BASE } from "../../api/config"

export default function Garbage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const propertyId = useAccountNumber("municipal")
  const [issueType, setIssueType] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [complaintId, setComplaintId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!issueType || !location) {
      alert("Please fill all required fields")
      return
    }
    setLoading(true)
    
    try {
      const res = await fetch(`${API_BASE}/municipal/complaint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          propertyId,
          complaintType: "GARBAGE",
          location,
          description: `${issueType}: ${description}`
        })
      })

      if (!res.ok) {
        throw new Error('Failed to submit complaint')
      }

      const data = await res.json()
      setComplaintId(data.complaintId)
      setSubmitted(true)
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to submit complaint. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <KioskLayout title="✅ Reported" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-xl p-8">
            <div className="text-6xl mb-4">🗑️</div>
            <h2 className="text-2xl font-bold text-green-800">Complaint Registered!</h2>
            <p className="text-green-600 mt-2">Complaint ID: {complaintId}</p>
            <button onClick={() => navigate("/services-dashboard")} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">Back to Services</button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout title="🗑️ Garbage Issue" subtitle="Report garbage collection problems" showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Report Garbage Collection Issue</h3>
            <div className="space-y-4">
              <select value={issueType} onChange={(e) => setIssueType(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                <option value="">Select Issue Type</option>
                <option value="not-collected">Garbage Not Collected</option>
                <option value="overflow">Garbage Bin Overflow</option>
                <option value="missed">Missed Collection</option>
                <option value="no-bin">Need New Garbage Bin</option>
                <option value="litter">Illegal Garbage Dumping</option>
              </select>
              <input type="text" placeholder="Street/Area Name" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Additional details (optional)" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium">{loading ? "Submitting..." : "Submit Complaint"}</button>
        </form>
      </div>
    </KioskLayout>
  )
}
