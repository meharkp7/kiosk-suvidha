import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"

export default function QualityComplaint() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const cardNumber = useAccountNumber("pds")
  const [commodity, setCommodity] = useState("")
  const [issueType, setIssueType] = useState("")
  const [fpsName, setFpsName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 1500)
  }

  if (submitted) {
    return (
      <KioskLayout title="✅ Reported" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-xl p-8">
            <div className="text-6xl mb-4">🍞</div>
            <h2 className="text-2xl font-bold text-green-800">Complaint Registered!</h2>
            <p className="text-green-600 mt-2">Complaint ID: QC{Date.now()}</p>
            <button onClick={() => navigate("/services-dashboard")} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">Back to Services</button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout title="🍞 Quality Complaint" subtitle={`Card: ${cardNumber}`} showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Report Food Quality Issue</h3>
            <div className="space-y-4">
              <select value={commodity} onChange={(e) => setCommodity(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                <option value="">Select Commodity</option>
                <option value="rice">Rice</option>
                <option value="wheat">Wheat/Atta</option>
                <option value="sugar">Sugar</option>
                <option value="dal">Dal/Pulses</option>
                <option value="oil">Cooking Oil</option>
                <option value="other">Other</option>
              </select>
              <select value={issueType} onChange={(e) => setIssueType(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                <option value="">Select Issue Type</option>
                <option value="stale">Stale/Old Stock</option>
                <option value="weevils">Insects/Weevils</option>
                <option value="stones">Stones/Dirt</option>
                <option value="moisture">Excess Moisture</option>
                <option value="underweight">Short Weight</option>
                <option value="smell">Foul Smell</option>
              </select>
              <input type="text" placeholder="FPS Name/ID" value={fpsName} onChange={(e) => setFpsName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Additional details" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium">{loading ? "Submitting..." : "Submit Complaint"}</button>
        </form>
      </div>
    </KioskLayout>
  )
}
