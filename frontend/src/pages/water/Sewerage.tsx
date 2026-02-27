import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import { API_BASE } from "../../api/config"

export default function Sewerage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("water")
  const [formData, setFormData] = useState({
    applicantName: "",
    propertyAddress: "",
    propertyType: "residential",
    idProof: null as File | null,
    propertyProof: null as File | null
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [requestId, setRequestId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch(`${API_BASE}/water/sewerage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          accountNumber,
          requestType: "NEW_CONNECTION",
          description: `Applicant: ${formData.applicantName}, Address: ${formData.propertyAddress}, Type: ${formData.propertyType}`
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
      <KioskLayout title="✅ Success" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-xl p-8">
            <div className="text-6xl mb-4">🚰</div>
            <h2 className="text-2xl font-bold text-green-800">Application Submitted!</h2>
            <p className="text-green-600 mt-2">Reference: {requestId}</p>
            <button onClick={() => navigate("/services-dashboard")} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">Back to Services</button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout title="🚰 Sewerage Connection" subtitle={`Account: ${accountNumber}`} showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Apply for Sewerage Connection</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Applicant Name" value={formData.applicantName} onChange={(e) => setFormData({...formData, applicantName: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <textarea placeholder="Property Address" value={formData.propertyAddress} onChange={(e) => setFormData({...formData, propertyAddress: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <select value={formData.propertyType} onChange={(e) => setFormData({...formData, propertyType: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium">{loading ? "Submitting..." : "Submit Application"}</button>
        </form>
      </div>
    </KioskLayout>
  )
}
