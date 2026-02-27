import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import { API_BASE } from "../../api/config"

export default function BillingIssues() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("electricity")
  const [issueType, setIssueType] = useState("")
  const [billMonth, setBillMonth] = useState("")
  const [description, setDescription] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [requestId, setRequestId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!issueType || !description) {
      alert(t("fillRequiredFields") || "Please fill all required fields")
      return
    }
    setLoading(true)
    
    try {
      const res = await fetch(`${API_BASE}/electricity/billing-issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          accountNumber,
          issueType,
          description: `${billMonth ? `Month: ${billMonth}. ` : ''}${description}`
        })
      })

      if (!res.ok) {
        throw new Error('Failed to submit complaint')
      }

      const data = await res.json()
      setRequestId(data.requestId)
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
      <KioskLayout title="✅ Submitted" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Complaint Submitted!</h2>
            <p className="text-green-600">Your billing issue has been registered. Reference: {requestId}</p>
            <button onClick={() => navigate("/services-dashboard")} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">Back to Services</button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout title="💰 Billing Issues" subtitle={`Account: ${accountNumber}`} showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Report Billing Issue</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type</label>
                <select value={issueType} onChange={(e) => setIssueType(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                  <option value="">Select issue type</option>
                  <option value="high-bill">Unusually High Bill</option>
                  <option value="wrong-reading">Wrong Meter Reading</option>
                  <option value="duplicate">Duplicate Charges</option>
                  <option value="wrong-tariff">Wrong Tariff Applied</option>
                  <option value="late-fee">Unjustified Late Fee</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Billing Month</label>
                <input type="month" value={billMonth} onChange={(e) => setBillMonth(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Describe your billing issue in detail" required />
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium">{loading ? "Submitting..." : "Submit Complaint"}</button>
        </form>
      </div>
    </KioskLayout>
  )
}
