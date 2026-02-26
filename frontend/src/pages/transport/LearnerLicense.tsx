import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"

export default function LearnerLicense() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    fatherName: "",
    address: "",
    mobile: "",
    vehicleClass: "",
    bloodGroup: ""
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
      <KioskLayout title="✅ Applied" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-xl p-8">
            <div className="text-6xl mb-4">🎓</div>
            <h2 className="text-2xl font-bold text-green-800">Application Submitted!</h2>
            <p className="text-green-600 mt-2">LL Test scheduled. Check SMS for details.</p>
            <button onClick={() => navigate("/services-dashboard")} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">Back to Services</button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout title="🎓 Learner License" subtitle="Apply for LL" showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <input type="date" placeholder="Date of Birth" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <input type="text" placeholder="Father's Name" value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <input type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <select value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                <option value="">Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
              <select value={formData.vehicleClass} onChange={(e) => setFormData({...formData, vehicleClass: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                <option value="">Vehicle Class</option>
                <option value="MCWOG">Motorcycle Without Gear</option>
                <option value="MCWG">Motorcycle With Gear</option>
                <option value="LMV">Light Motor Vehicle</option>
              </select>
            </div>
            <textarea placeholder="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-4" rows={3} required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium">{loading ? "Submitting..." : "Apply for LL"}</button>
        </form>
      </div>
    </KioskLayout>
  )
}
