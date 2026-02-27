import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import { API_BASE } from "../../api/config"

export default function GasNewConnection() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const consumerNumber = useAccountNumber("gas")
  const [formData, setFormData] = useState({
    applicantName: "",
    mobileNumber: "",
    email: "",
    address: "",
    connectionType: "domestic",
    distributorCode: "",
    idProof: null as File | null,
    addressProof: null as File | null,
    photo: null as File | null,
    pmuyBeneficiary: "no"
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [requestId, setRequestId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.applicantName || !formData.mobileNumber || !formData.address) {
      alert(t("fillRequiredFields") || "Please fill all required fields")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/gas/new-connection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          applicantName: formData.applicantName,
          mobileNumber: formData.mobileNumber,
          email: formData.email,
          address: formData.address,
          connectionType: formData.connectionType,
          distributorCode: formData.distributorCode
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
      <KioskLayout title="✅ Application Submitted" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">🔥</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Application Submitted!</h2>
            <p className="text-green-700 mb-2">Application ID: {requestId}</p>
            <p className="text-green-600">Your new LPG connection application has been submitted successfully.</p>
            <div className="mt-4 text-left bg-white rounded-lg p-4">
              <h4 className="font-semibold mb-2">Next Steps:</h4>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li>Application verification (3-5 working days)</li>
                <li>Document verification (2-3 working days)</li>
                <li>Connection approval (2-3 working days)</li>
                <li>Installation and first cylinder delivery (7-10 working days)</li>
              </ol>
            </div>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
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
      title="🔥 New LPG Connection"
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
      onHome={() => navigate("/")}
    >
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Applicant Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.applicantName}
                  onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Connection Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complete Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="House No., Street, Area, City, State, PIN"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connection Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.connectionType}
                  onChange={(e) => setFormData({...formData, connectionType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="domestic">Domestic</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Distributor Code
                </label>
                <input
                  type="text"
                  value={formData.distributorCode}
                  onChange={(e) => setFormData({...formData, distributorCode: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., BG001"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">PM Ujjwala Yojana</h3>
            <div className="space-y-3">
              <p className="text-gray-600">Are you a beneficiary of PM Ujjwala Yojana?</p>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="yes"
                    checked={formData.pmuyBeneficiary === "yes"}
                    onChange={(e) => setFormData({...formData, pmuyBeneficiary: e.target.value})}
                    className="mr-2"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="no"
                    checked={formData.pmuyBeneficiary === "no"}
                    onChange={(e) => setFormData({...formData, pmuyBeneficiary: e.target.value})}
                    className="mr-2"
                  />
                  <span>No</span>
                </label>
              </div>
              {formData.pmuyBeneficiary === "yes" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">PM Ujjwala Benefits:</p>
                  <ul className="list-disc list-inside text-green-700 text-sm mt-2">
                    <li>Free LPG connection</li>
                    <li>₹1600 financial assistance</li>
                    <li>5 free refills</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Proof (Aadhaar/Voter ID) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFormData({...formData, idProof: e.target.files?.[0] || null})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Proof <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFormData({...formData, addressProof: e.target.files?.[0] || null})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passport Size Photo <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({...formData, photo: e.target.files?.[0] || null})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Connection Charges</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-800">Connection Fee:</span>
                <span className="font-medium">₹1,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Security Deposit:</span>
                <span className="font-medium">₹2,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">First Cylinder (14.2kg):</span>
                <span className="font-medium">₹1,100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Regulator & Pipe:</span>
                <span className="font-medium">₹400</span>
              </div>
              <div className="border-t border-blue-300 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-blue-900">
                  <span>Total:</span>
                  <span>₹5,500</span>
                </div>
              </div>
              {formData.pmuyBeneficiary === "yes" && (
                <div className="bg-green-100 text-green-800 p-3 rounded-lg mt-3">
                  <p className="font-medium">PM Ujjwala Benefit: -₹1,600</p>
                  <p className="text-sm">Net payable: ₹3,900</p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Submitting Application...
              </span>
            ) : (
              "Submit Application"
            )}
          </button>
        </form>
      </div>
    </KioskLayout>
  )
}
