import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import { API_BASE } from "../../api/config"

export default function DrivingLicenseRenewal() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("transport")
  const [formData, setFormData] = useState({
    licenseNumber: "",
    dateOfBirth: "",
    issueDate: "",
    expiryDate: "",
    vehicleClass: "",
    address: "",
    mobileNumber: "",
    email: "",
    aadhaarNumber: "",
    medicalCertificate: null as File | null,
    licenseCopy: null as File | null,
    photo: null as File | null,
    signature: null as File | null
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [applicationNumber, setApplicationNumber] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.licenseNumber || !formData.dateOfBirth || !formData.mobileNumber) {
      alert(t("fillRequiredFields") || "Please fill all required fields")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/transport/application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          registrationNumber: accountNumber,
          applicationType: "LICENSE_RENEWAL",
          applicantName: formData.licenseNumber,
          details: formData
        })
      })

      if (!res.ok) {
        throw new Error('Failed to submit application')
      }

      const data = await res.json()
      setApplicationNumber(data.applicationNumber)
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
            <div className="text-6xl mb-4">🪪</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Application Submitted!</h2>
            <p className="text-green-700 mb-2">Application ID: {applicationNumber}</p>
            <p className="text-green-600">Your driving license renewal application has been submitted successfully.</p>
            <div className="mt-4 text-left bg-white rounded-lg p-4">
              <h4 className="font-semibold mb-2">Next Steps:</h4>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li>Application verification (3-5 working days)</li>
                <li>Document verification (2-3 working days)</li>
                <li>Test appointment (if required)</li>
                <li>License printing (5-7 working days)</li>
                <li>Delivery to address (7-10 working days)</li>
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
      title="🔄 Renew Driving License"
      subtitle="Renew your driving license"
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
      onHome={() => navigate("/")}
    >
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* License Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">License Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter license number"
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
                  Issue Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.vehicleClass}
                  onChange={(e) => setFormData({...formData, vehicleClass: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Vehicle Class</option>
                  <option value="MCWG">MCWG (Motor Cycle With Gear)</option>
                  <option value="LMV">LMV (Light Motor Vehicle)</option>
                  <option value="HMV">HMV (Heavy Motor Vehicle)</option>
                  <option value="MCWOG">MCWOG (Motor Cycle Without Gear)</option>
                  <option value="TRANS">TRANS (Transport Vehicle)</option>
                </select>
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
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Address <span className="text-red-500">*</span>
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

          {/* Document Upload */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Certificate (Form 1A) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFormData({...formData, medicalCertificate: e.target.files?.[0] || null})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Required for applicants over 40 years of age</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current License Copy <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFormData({...formData, licenseCopy: e.target.files?.[0] || null})}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digital Signature <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({...formData, signature: e.target.files?.[0] || null})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Renewal Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Renewal Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-medium text-blue-800">Renewal Period</p>
                  <p className="text-sm text-blue-700">License can be renewed within 1 year before expiry or up to 5 years after expiry</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🧪</span>
                <div>
                  <p className="font-medium text-blue-800">Test Requirement</p>
                  <p className="text-sm text-blue-700">Test required if license expired more than 1 year ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="font-medium text-blue-800">Processing Time</p>
                  <p className="text-sm text-blue-700">15-20 working days for normal processing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fees */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Renewal Fees</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-800">Renewal Fee:</span>
                <span className="font-medium">₹200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800">Service Charge:</span>
                <span className="font-medium">₹100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-800">Late Fee (if applicable):</span>
                <span className="font-medium">₹300</span>
              </div>
              <div className="border-t border-green-300 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-green-900">
                  <span>Total:</span>
                  <span>₹600</span>
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
