import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import { API_BASE } from "../../api/config"

export default function BirthCertificate() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const propertyId = useAccountNumber("municipal")
  const [formData, setFormData] = useState({
    childName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    gender: "",
    fatherName: "",
    motherName: "",
    address: "",
    hospitalName: "",
    deliveryType: "hospital",
    parentMobile: "",
    parentEmail: "",
    birthProof: null as File | null,
    parentIdProof: null as File | null,
    addressProof: null as File | null
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [requestId, setRequestId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.childName || !formData.dateOfBirth || !formData.fatherName || !formData.motherName) {
      alert(t("fillRequiredFields") || "Please fill all required fields")
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
          certificateType: "BIRTH",
          applicantName: formData.fatherName,
          details: {
            childName: formData.childName,
            dateOfBirth: formData.dateOfBirth,
            placeOfBirth: formData.placeOfBirth,
            gender: formData.gender,
            motherName: formData.motherName,
            address: formData.address,
            hospitalName: formData.hospitalName,
            deliveryType: formData.deliveryType,
            parentMobile: formData.parentMobile,
            parentEmail: formData.parentEmail
          }
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
            <div className="text-6xl mb-4">👶</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Application Submitted!</h2>
            <p className="text-green-700 mb-2">Application ID: {requestId}</p>
            <p className="text-green-600">Your birth certificate application has been submitted successfully.</p>
            <div className="mt-4 text-left bg-white rounded-lg p-4">
              <h4 className="font-semibold mb-2">Next Steps:</h4>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li>Application verification (3-5 working days)</li>
                <li>Document verification (2-3 working days)</li>
                <li>Certificate generation (5-7 working days)</li>
                <li>Delivery to registered address (7-10 working days)</li>
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
      title="👶 Birth Certificate"
      subtitle="Apply for Birth Certificate"
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
      onHome={() => navigate("/")}
    >
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Child Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Child Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Child's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.childName}
                  onChange={(e) => setFormData({...formData, childName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter child's full name"
                  required
                />
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
                  Place of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.placeOfBirth}
                  onChange={(e) => setFormData({...formData, placeOfBirth: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="City, Hospital, etc."
                  required
                />
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
            </div>
          </div>

          {/* Parent Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Father's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter father's full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mother's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.motherName}
                  onChange={(e) => setFormData({...formData, motherName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter mother's full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.parentMobile}
                  onChange={(e) => setFormData({...formData, parentMobile: e.target.value})}
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
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="parent@email.com"
                />
              </div>
            </div>
          </div>

          {/* Birth Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Birth Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Birth <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.deliveryType}
                  onChange={(e) => setFormData({...formData, deliveryType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="hospital">Hospital Birth</option>
                  <option value="home">Home Birth</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {formData.deliveryType === "hospital" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hospital Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter hospital name"
                    required={formData.deliveryType === "hospital"}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permanent Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Complete address with PIN code"
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
                  Birth Proof (Hospital discharge summary) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFormData({...formData, birthProof: e.target.files?.[0] || null})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent ID Proof (Aadhaar/Voter ID) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFormData({...formData, parentIdProof: e.target.files?.[0] || null})}
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
            </div>
          </div>

          {/* Fees */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Application Fees</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-800">Certificate Fee:</span>
                <span className="font-medium">₹50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-800">Service Charge:</span>
                <span className="font-medium">₹20</span>
              </div>
              <div className="border-t border-blue-300 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-blue-900">
                  <span>Total:</span>
                  <span>₹70</span>
                </div>
              </div>
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
