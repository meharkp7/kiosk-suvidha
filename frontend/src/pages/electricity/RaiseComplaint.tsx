import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { API_BASE } from "../../api/config"
import { useAccountNumber } from "../../hooks/useAccountNumber"

const complaintTypes = [
  { id: "power_cut", label: "Power Cut", icon: "⚡" },
  { id: "low_voltage", label: "Low Voltage", icon: "📉" },
  { id: "billing_issue", label: "Billing Issue", icon: "💰" },
  { id: "meter_fault", label: "Meter Fault", icon: "🔧" },
  { id: "line_fault", label: "Line Fault", icon: "🌩️" },
  { id: "other", label: "Other", icon: "❓" },
]

const priorities = [
  { id: "LOW", label: "Low", color: "bg-blue-100 text-blue-700" },
  { id: "NORMAL", label: "Normal", color: "bg-amber-100 text-amber-700" },
  { id: "HIGH", label: "High", color: "bg-red-100 text-red-700" },
]

export default function RaiseComplaint() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("electricity")

  const [complaintType, setComplaintType] = useState("")
  const [priority, setPriority] = useState("NORMAL")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [complaintId, setComplaintId] = useState("")

  // Show error when no account
  if (!accountNumber) {
    return (
      <KioskLayout
        title={`⚡ ${t("raiseComplaint")}`}
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-amber-50 rounded-2xl p-8">
            <span className="text-6xl mb-4 block">⚡</span>
            <h2 className="text-2xl font-bold text-amber-800 mb-2">{t("noAccountSelected")}</h2>
            <p className="text-amber-600 mb-6">{t("selectElectricityAccount")}</p>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold"
            >
              {t("goToServicesDashboard")} →
            </button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  const handleSubmit = async () => {
    if (!complaintType) {
      alert(t("selectComplaintType"))
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/electricity/complaint`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountNumber,
          complaintType,
          priority,
          description,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setComplaintId(data.complaintId)
        setSubmitted(true)
      } else {
        alert("Failed to submit complaint")
      }
    } catch (err) {
      alert("Network error")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <KioskLayout
        title="✅ Complaint Submitted"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-2xl p-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl text-white">✓</span>
            </div>
            <h2 className="text-3xl font-bold text-green-800 mb-2">Complaint Registered!</h2>
            <p className="text-green-600 mb-6">Your complaint has been successfully submitted</p>

            <div className="bg-white rounded-xl p-6 mb-6">
              <p className="text-slate-500 mb-2">Complaint ID</p>
              <p className="text-3xl font-bold text-slate-800">{complaintId}</p>
              <p className="text-sm text-slate-400 mt-2">Save this for future reference</p>
            </div>

            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold"
            >
              Back to Services
            </button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout
      title="⚡ Raise Complaint"
      subtitle={`Account: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
      onHome={() => navigate("/")}
    >
      <div className="max-w-4xl mx-auto">
        {/* Complaint Type */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Select Complaint Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {complaintTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setComplaintType(type.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  complaintType === type.id
                    ? "border-amber-500 bg-amber-50"
                    : "border-slate-200 hover:border-amber-300"
                }`}
              >
                <span className="text-3xl mb-2 block">{type.icon}</span>
                <p className="font-semibold text-slate-800">{type.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Priority Level</h3>
          <div className="flex gap-4">
            {priorities.map((p) => (
              <button
                key={p.id}
                onClick={() => setPriority(p.id)}
                className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                  priority === p.id ? p.color : "bg-slate-100 text-slate-600"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Description (Optional)</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your issue in detail..."
            className="w-full h-32 p-4 border-2 border-slate-200 rounded-xl focus:border-amber-500 outline-none resize-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !complaintType}
          className="w-full bg-amber-600 text-white py-5 rounded-xl text-xl font-bold hover:bg-amber-700 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="animate-spin">⏳</span>
              Submitting...
            </span>
          ) : (
            "📢 Submit Complaint"
          )}
        </button>
      </div>
    </KioskLayout>
  )
}
