import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import { API_BASE } from "../../api/config"

export default function DeathCertificate() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const propertyId = useAccountNumber("municipal")
  const [formData, setFormData] = useState({
    deceasedName: "",
    dateOfDeath: "",
    placeOfDeath: "",
    fatherName: "",
    age: "",
    address: "",
    informantName: "",
    informantMobile: ""
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [requestId, setRequestId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.deceasedName || !formData.dateOfDeath || !formData.informantName) {
      alert("Please fill all required fields")
      return
    }
    setLoading(true)
    
    try {
      const res = await fetch(`${API_BASE}/municipal/certificate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          propertyId,
          certificateType: "DEATH",
          applicantName: formData.informantName,
          details: formData
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
      <KioskLayout title="✅ Submitted" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-xl p-8">
            <div className="text-6xl mb-4">⚰️</div>
            <h2 className="text-2xl font-bold text-green-800">Application Submitted!</h2>
            <p className="text-green-600 mt-2">Application ID: {requestId}</p>
            <button onClick={() => navigate("/services-dashboard")} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">Back to Services</button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout title="⚰️ Death Certificate" subtitle="Apply for Death Certificate" showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Deceased Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" value={formData.deceasedName} onChange={(e) => setFormData({...formData, deceasedName: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <input type="date" placeholder="Date of Death" value={formData.dateOfDeath} onChange={(e) => setFormData({...formData, dateOfDeath: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <input type="text" placeholder="Place of Death" value={formData.placeOfDeath} onChange={(e) => setFormData({...formData, placeOfDeath: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <input type="text" placeholder="Father/Husband Name" value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <input type="number" placeholder="Age" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <input type="text" placeholder="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Informant Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Informant Name" value={formData.informantName} onChange={(e) => setFormData({...formData, informantName: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <input type="tel" placeholder="Mobile Number" value={formData.informantMobile} onChange={(e) => setFormData({...formData, informantMobile: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium">{loading ? "Submitting..." : "Submit Application"}</button>
        </form>
      </div>
    </KioskLayout>
  )
}
