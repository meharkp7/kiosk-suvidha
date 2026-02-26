import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { API_BASE } from "../../api/config"
import { useAccountNumber } from "../../hooks/useAccountNumber"

const complaintTypes = [
  { id: "street_light", label: "Street Light Issue", icon: "💡" },
  { id: "garbage", label: "Garbage Collection", icon: "🗑️" },
  { id: "drainage", label: "Drainage Blockage", icon: "🚿" },
  { id: "roads", label: "Road Damage", icon: "🛣️" },
  { id: "sewerage", label: "Sewerage Issue", icon: "🚰" },
  { id: "other", label: "Other", icon: "❓" },
]

export default function MunicipalRaiseComplaint() {
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("municipal")

  const [complaintType, setComplaintType] = useState("")
  const [location_text, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [complaintId, setComplaintId] = useState("")

  // Show error when no account
  if (!accountNumber) {
    return (
      <KioskLayout
        title="🏛️ Raise Civic Complaint"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-emerald-50 rounded-2xl p-8">
            <span className="text-6xl mb-4 block">🏛️</span>
            <h2 className="text-2xl font-bold text-emerald-800 mb-2">No Property Selected</h2>
            <p className="text-emerald-600 mb-6">Please select your Municipal account from the services dashboard</p>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold"
            >
              Go to Services Dashboard →
            </button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  const handleSubmit = async () => {
    if (!complaintType) {
      alert("Please select complaint type")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/municipal/complaint`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: accountNumber,
          complaintType,
          location: location_text,
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
            <p className="text-green-600 mb-6">Your civic complaint has been submitted</p>

            <div className="bg-white rounded-xl p-6 mb-6">
              <p className="text-slate-500 mb-2">Complaint ID</p>
              <p className="text-3xl font-bold text-slate-800">{complaintId}</p>
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
      title="🏛️ Raise Civic Complaint"
      subtitle={`Property: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Select Complaint Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {complaintTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setComplaintType(type.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  complaintType === type.id
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 hover:border-emerald-300"
                }`}
              >
                <span className="text-3xl mb-2 block">{type.icon}</span>
                <p className="font-semibold text-slate-800">{type.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Location</h3>
          <input
            type="text"
            value={location_text}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter specific location/address..."
            className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Description</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail..."
            className="w-full h-32 p-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 outline-none resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !complaintType}
          className="w-full bg-emerald-600 text-white py-5 rounded-xl text-xl font-bold hover:bg-emerald-700 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
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
