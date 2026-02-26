import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { API_BASE } from "../../api/config"
import { useAccountNumber } from "../../hooks/useAccountNumber"

const grievanceTypes = [
  { id: "quality_issue", label: "Food Quality Issue", icon: "🍞" },
  { id: "shortage", label: "Quantity Shortage", icon: "⚖️" },
  { id: "fps_closed", label: "FPS Shop Closed", icon: "🏪" },
  { id: "behavior", label: "Staff Behavior", icon: "👤" },
  { id: "card_issue", label: "Card Related", icon: "🆔" },
  { id: "other", label: "Other", icon: "❓" },
]

export default function PdsRaiseGrievance() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("pds")

  const [grievanceType, setGrievanceType] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [grievanceId, setGrievanceId] = useState("")

  // Show error when no account
  if (!accountNumber) {
    return (
      <KioskLayout
        title={`🍚 ${t("raiseGrievance")}`}
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-violet-50 rounded-2xl p-8">
            <span className="text-6xl mb-4 block">🍚</span>
            <h2 className="text-2xl font-bold text-violet-800 mb-2">{t("noCardSelected")}</h2>
            <p className="text-violet-600 mb-6">{t("selectPdsAccount")}</p>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-violet-600 text-white px-8 py-4 rounded-xl font-semibold"
            >
              {t("goToServicesDashboard")} →
            </button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  const handleSubmit = async () => {
    if (!grievanceType) {
      alert(t("selectGrievanceType"))
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/pds/grievance`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber: accountNumber,
          grievanceType,
          description,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setGrievanceId(data.grievanceId)
        setSubmitted(true)
      } else {
        alert("Failed to submit grievance")
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
        title="✅ Grievance Submitted"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-2xl p-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl text-white">✓</span>
            </div>
            <h2 className="text-3xl font-bold text-green-800 mb-2">Grievance Registered!</h2>
            <p className="text-green-600 mb-6">Your grievance has been successfully submitted</p>

            <div className="bg-white rounded-xl p-6 mb-6">
              <p className="text-slate-500 mb-2">Grievance ID</p>
              <p className="text-3xl font-bold text-slate-800">{grievanceId}</p>
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
      title="🍚 Raise Grievance"
      subtitle={`Card: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Select Grievance Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {grievanceTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setGrievanceType(type.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  grievanceType === type.id
                    ? "border-violet-500 bg-violet-50"
                    : "border-slate-200 hover:border-violet-300"
                }`}
              >
                <span className="text-3xl mb-2 block">{type.icon}</span>
                <p className="font-semibold text-slate-800">{type.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Description</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your grievance in detail..."
            className="w-full h-32 p-4 border-2 border-slate-200 rounded-xl focus:border-violet-500 outline-none resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !grievanceType}
          className="w-full bg-violet-600 text-white py-5 rounded-xl text-xl font-bold hover:bg-violet-700 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="animate-spin">⏳</span>
              Submitting...
            </span>
          ) : (
            "📢 Submit Grievance"
          )}
        </button>
      </div>
    </KioskLayout>
  )
}
