import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"

export default function GrievanceStatus() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const cardNumber = useAccountNumber("pds")
  const [grievances, setGrievances] = useState([
    { id: "GR001", date: "2024-03-15", subject: "Short weight", status: "Pending", dept: "FPS Delhi" },
    { id: "GR002", date: "2024-02-10", subject: "Quality issue", status: "Resolved", dept: "FPS Mumbai" }
  ])

  return (
    <KioskLayout title="📋 Grievance Status" subtitle={`Card: ${cardNumber}`} showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Your Grievances</h3>
          <div className="space-y-4">
            {grievances.map((g) => (
              <div key={g.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{g.subject}</p>
                    <p className="text-sm text-gray-500">{g.id} • {g.date} • {g.dept}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${g.status === "Resolved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {g.status}
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
