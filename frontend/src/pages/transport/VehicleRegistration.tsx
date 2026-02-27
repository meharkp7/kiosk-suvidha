import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import { API_BASE } from "../../api/config"

export default function VehicleRegistration() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("transport")
  const [formData, setFormData] = useState({
    ownerName: "",
    vehicleType: "",
    make: "",
    model: "",
    fuelType: "",
    chassisNumber: "",
    engineNumber: "",
    color: "",
    seatingCapacity: ""
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [applicationNumber, setApplicationNumber] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.ownerName || !formData.vehicleType || !formData.chassisNumber) {
      alert("Please fill all required fields")
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
          applicationType: "VEHICLE_REGISTRATION",
          applicantName: formData.ownerName,
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
      <KioskLayout title="✅ Applied" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-xl p-8">
            <div className="text-6xl mb-4">🚗</div>
            <h2 className="text-2xl font-bold text-green-800">Application Submitted!</h2>
            <p className="text-green-600 mt-2">Application Number: {applicationNumber}</p>
            <button onClick={() => navigate("/services-dashboard")} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">Back to Services</button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout title="🚗 Vehicle Registration" subtitle="Register new vehicle" showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Owner Name" value={formData.ownerName} onChange={(e) => setFormData({...formData, ownerName: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <select value={formData.vehicleType} onChange={(e) => setFormData({...formData, vehicleType: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                <option value="">Vehicle Type</option>
                <option value="2w">Two Wheeler</option>
                <option value="3w">Three Wheeler</option>
                <option value="4w">Four Wheeler</option>
                <option value="commercial">Commercial</option>
              </select>
              <input type="text" placeholder="Make (e.g., Maruti)" value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <input type="text" placeholder="Model (e.g., Swift)" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <select value={formData.fuelType} onChange={(e) => setFormData({...formData, fuelType: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required>
                <option value="">Fuel Type</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="cng">CNG</option>
                <option value="electric">Electric</option>
              </select>
              <input type="text" placeholder="Color" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <input type="text" placeholder="Chassis Number" value={formData.chassisNumber} onChange={(e) => setFormData({...formData, chassisNumber: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <input type="text" placeholder="Engine Number" value={formData.engineNumber} onChange={(e) => setFormData({...formData, engineNumber: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
              <input type="number" placeholder="Seating Capacity" value={formData.seatingCapacity} onChange={(e) => setFormData({...formData, seatingCapacity: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium">{loading ? "Submitting..." : "Submit Registration"}</button>
        </form>
      </div>
    </KioskLayout>
  )
}
