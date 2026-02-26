import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { API_BASE } from "../../api/config"
import { useAccountNumber } from "../../hooks/useAccountNumber"

export default function TransferConnection() {
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("electricity")

  const [newAddress, setNewAddress] = useState("")
  const [reason, setReason] = useState("")
  const [documentsSubmitted, setDocumentsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [requestId, setRequestId] = useState("")

  // Show error when no account
  if (!accountNumber) {
    return (
      <KioskLayout
        title="⚡ Transfer Connection"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-amber-50 rounded-2xl p-8">
            <span className="text-6xl mb-4 block">⚡</span>
            <h2 className="text-2xl font-bold text-amber-800 mb-2">No Account Selected</h2>
            <p className="text-amber-600 mb-6">Please select your Electricity account from the services dashboard</p>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold"
            >
              Go to Services Dashboard →
            </button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  const handleSubmit = async () => {
    if (!newAddress.trim()) {
      alert("Please enter new address")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/electricity/transfer`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountNumber,
          newAddress,
          reason,
          documentSubmitted: documentsSubmitted,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setRequestId(data.requestId)
        setSubmitted(true)
      } else {
        alert("Failed to submit request")
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
        title="✅ Request Submitted"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-2xl p-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl text-white">✓</span>
            </div>
            <h2 className="text-3xl font-bold text-green-800 mb-2">Transfer Requested!</h2>
            <p className="text-green-600 mb-6">Your connection transfer request has been submitted</p>

            <div className="bg-white rounded-xl p-6 mb-6">
              <p className="text-slate-500 mb-2">Request ID</p>
              <p className="text-3xl font-bold text-slate-800">{requestId}</p>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 mb-6">
              <p className="text-amber-800">
                <span className="font-semibold">⏱️ Note:</span> You may need to visit the office with original documents for verification.
              </p>
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
      title="⚡ Transfer Connection"
      subtitle={`Account: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">New Address</h3>
          <textarea
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Enter complete new address..."
            className="w-full h-32 p-4 border-2 border-slate-200 rounded-xl focus:border-amber-500 outline-none resize-none"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Reason for Transfer</h3>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Moved to new house..."
            className="w-full h-24 p-4 border-2 border-slate-200 rounded-xl focus:border-amber-500 outline-none resize-none"
          />
        </div>

        <div className="bg-amber-50 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-amber-800 mb-2">📋 Required Documents</h3>
          <ul className="text-amber-700 space-y-2">
            <li>• ID Proof (Aadhaar/PAN)</li>
            <li>• Address Proof of new location</li>
            <li>• Recent Photograph</li>
            <li>• Old connection NOC</li>
          </ul>

          <label className="flex items-center gap-3 mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={documentsSubmitted}
              onChange={(e) => setDocumentsSubmitted(e.target.checked)}
              className="w-6 h-6 rounded border-2 border-amber-400"
            />
            <span className="text-amber-800 font-medium">
              I have all required documents ready
            </span>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !newAddress.trim()}
          className="w-full bg-amber-600 text-white py-5 rounded-xl text-xl font-bold hover:bg-amber-700 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="animate-spin">⏳</span>
              Submitting...
            </span>
          ) : (
            "🔄 Submit Transfer Request"
          )}
        </button>
      </div>
    </KioskLayout>
  )
}
