import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"

export default function RegulatorIssue() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const consumerNumber = useAccountNumber("gas")
  const [issueType, setIssueType] = useState("")
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
            <div className="text-6xl mb-4">🔧</div>
            <h2 className="text-2xl font-bold text-green-800">Report Submitted!</h2>
            <p className="text-green-600 mt-2">Technician will visit within 48 hours</p>
            <button onClick={() => navigate("/services-dashboard")} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">Back to Services</button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout title="🔧 Regulator Issue" subtitle={`Consumer: ${consumerNumber}`} showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Report Regulator Problem</h3>
            <div className="space-y-4">
              <select value={issueType} onChange={(e) => setIssueType(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                <option value="">Select issue</option>
                <option value="low-flame">Low Flame Pressure</option>
                <option value="no-gas">No Gas Flow</option>
                <option value="auto-off">Auto Shut-off Not Working</option>
                <option value="leak">Regulator Leak</option>
                <option value="damaged">Physical Damage</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium">{loading ? "Submitting..." : "Report Issue"}</button>
        </form>
      </div>
    </KioskLayout>
  )
}
