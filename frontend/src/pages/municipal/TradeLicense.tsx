import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"

export default function TradeLicense() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    ownerName: "",
    address: "",
    mobile: "",
    establishmentDate: "",
    area: ""
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 2000)
  }

  if (submitted) {
    return (
      <KioskLayout title="✅ Submitted" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-xl p-8">
            <div className="text-6xl mb-4">🏪</div>
            <h2 className="text-2xl font-bold text-green-800">Application Submitted!</h2>
            <p className="text-green-600 mt-2">License will be issued within 30 days</p>
            <button onClick={() => navigate("/services-dashboard")} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">Back to Services</button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout title="🏪 Trade License" subtitle="Apply/Renew Trade License" showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Business Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Business Name" value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <select value={formData.businessType} onChange={(e) => setFormData({...formData, businessType: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                <option value="">Select Business Type</option>
                <option value="retail">Retail Shop</option>
                <option value="wholesale">Wholesale</option>
                <option value="restaurant">Restaurant/Hotel</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="service">Service</option>
                <option value="other">Other</option>
              </select>
              <input type="text" placeholder="Owner Name" value={formData.ownerName} onChange={(e) => setFormData({...formData, ownerName: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <input type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <input type="date" value={formData.establishmentDate} onChange={(e) => setFormData({...formData, establishmentDate: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <input type="number" placeholder="Shop Area (sq ft)" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
            </div>
            <textarea placeholder="Business Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-4" rows={3} required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium">{loading ? "Submitting..." : "Submit Application"}</button>
        </form>
      </div>
    </KioskLayout>
  )
}
