import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"

export default function MunicipalComplaintStatus() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const propertyId = useAccountNumber("municipal")
  const [complaints, setComplaints] = useState([
    { id: "MC001", date: "2024-03-15", type: "Street Light", status: "Resolved", description: "Light not working on Main Road" },
    { id: "MC002", date: "2024-02-10", type: "Garbage", status: "In Progress", description: "Garbage not collected for 3 days" },
    { id: "MC003", date: "2024-01-05", type: "Drainage", status: "Pending", description: "Drainage blockage near school" }
  ])

  return (
    <KioskLayout title="📍 Complaint Status" subtitle={`Property: ${propertyId}`} showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Your Complaints</h3>
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{complaint.type} Issue</p>
                    <p className="text-sm text-gray-500">{complaint.id} • {complaint.date}</p>
                    <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    complaint.status === "Resolved" ? "bg-green-100 text-green-700" : 
                    complaint.status === "In Progress" ? "bg-blue-100 text-blue-700" : 
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {complaint.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </KioskLayout>
  )
}
