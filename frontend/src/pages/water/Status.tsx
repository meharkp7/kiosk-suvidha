import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"

export default function WaterStatus() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("water")
  const [requests, setRequests] = useState([
    { id: "REQ001", type: "New Connection", date: "2024-03-15", status: "Pending" },
    { id: "REQ002", type: "Meter Change", date: "2024-02-10", status: "Completed" },
  ])

  return (
    <KioskLayout title="📍 Status" subtitle={`Account: ${accountNumber}`} showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Your Requests</h3>
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{req.type}</p>
                  <p className="text-sm text-gray-500">{req.id} • {req.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${req.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </KioskLayout>
  )
}
