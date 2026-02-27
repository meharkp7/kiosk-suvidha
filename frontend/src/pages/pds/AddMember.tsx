import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import { API_BASE } from "../../api/config"

export default function AddMember() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const cardNumber = useAccountNumber("pds")
  const [formData, setFormData] = useState({
    memberName: "",
    relationship: "",
    gender: "",
    dateOfBirth: "",
    aadhaarNumber: "",
    mobileNumber: "",
    photo: null as File | null,
    aadhaarCopy: null as File | null,
    birthCertificate: null as File | null
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [applicationNumber, setApplicationNumber] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.memberName || !formData.relationship || !formData.aadhaarNumber) {
      alert(t("fillRequiredFields") || "Please fill all required fields")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/pds/member-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          cardNumber,
          requestType: "ADD_MEMBER",
          details: formData
        })
      })

      if (!res.ok) {
        throw new Error('Failed to submit application')
      }

      const data = await res.json()
      setApplicationNumber(data.requestId)
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
            <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Application Submitted!</h2>
            <p className="text-green-700 mb-2">Application ID: {applicationNumber}</p>
            <p className="text-green-600">Your request to add family member has been submitted successfully.</p>
            <div className="mt-4 text-left bg-white rounded-lg p-4">
              <h4 className="font-semibold mb-2">Next Steps:</h4>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li>Application verification (5-7 working days)</li>
                <li>Document verification (3-5 working days)</li>
                <li>Field verification (if required)</li>
                <li>Approval and card update (7-10 working days)</li>
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
      title="👨‍👩‍👧‍👦 Add Family Member"
      subtitle={`Ration Card: ${cardNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
      onHome={() => navigate("/")}
    >
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Member Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Member Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.memberName}
                  onChange={(e) => setFormData({...formData, memberName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter member's full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.relationship}
                  onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Relationship</option>
                  <option value="spouse">Spouse</option>
                  <option value="son">Son</option>
                  <option value="daughter">Daughter</option>
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="brother">Brother</option>
                  <option value="sister">Sister</option>
                  <option value="grandfather">Grandfather</option>
                  <option value="grandmother">Grandmother</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.aadhaarNumber}
                  onChange={(e) => setFormData({...formData, aadhaarNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="12-digit Aadhaar number"
                  pattern="[0-9]{12}"
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
            </div>
          </div>

          {/* Document Upload */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
            <div className="space-y-4">
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
                <p className="text-sm text-gray-500 mt-1">Recent passport size photo with white background</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Card Copy <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFormData({...formData, aadhaarCopy: e.target.files?.[0] || null})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth Certificate <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFormData({...formData, birthCertificate: e.target.files?.[0] || null})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Required for minors (below 18 years)</p>
              </div>
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Eligibility Criteria</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
                <div>
                  <p className="font-medium text-blue-800">Family Definition</p>
                  <p className="text-sm text-blue-700">Unit consisting of husband, wife, and unmarried children</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-medium text-blue-800">Documentation Required</p>
                  <p className="text-sm text-blue-700">Valid ID proof, residence proof, and income certificate</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-medium text-blue-800">Income Criteria</p>
                  <p className="text-sm text-blue-700">Annual family income should be within prescribed limits</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Card Details */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Current Card Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Card Number:</p>
                <p className="font-medium">{cardNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Card Type:</p>
                <p className="font-medium">PHH (Priority Household)</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Members:</p>
                <p className="font-medium">4</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">FPS Code:</p>
                <p className="font-medium">FPS001</p>
              </div>
            </div>
          </div>

          {/* Processing Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">Processing Information</h3>
            <div className="space-y-2">
              <p className="text-yellow-800">⏰ Processing Time: 15-20 working days</p>
              <p className="text-yellow-800">📞 Status Updates: SMS alerts on registered mobile</p>
              <p className="text-yellow-800">🏪 Card Collection: From designated FPS after approval</p>
              <p className="text-yellow-800">🔍 Verification: Field verification may be conducted</p>
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
