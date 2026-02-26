import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"

export default function DlStatus() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const licenseNumber = useAccountNumber("transport")
  const [dlData, setDlData] = useState({
    number: licenseNumber || "DL1234567890",
    name: "John Doe",
    validFrom: "2020-01-15",
    validTo: "2030-01-14",
    status: "Active",
    classes: ["LMV", "MCWG"],
    address: "123, Main Street, Delhi"
  })

  return (
    <KioskLayout title="🪪 License Status" subtitle="Check your DL status" showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl">🪪</div>
            <div>
              <h3 className="text-xl font-bold">{dlData.name}</h3>
              <p className="text-gray-500">{dlData.number}</p>
              <span className={`px-3 py-1 rounded-full text-sm ${dlData.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {dlData.status}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Valid From</p>
              <p className="font-semibold">{dlData.validFrom}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Valid To</p>
              <p className="font-semibold">{dlData.validTo}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Vehicle Classes</p>
              <p className="font-semibold">{dlData.classes.join(", ")}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Days to Expiry</p>
              <p className="font-semibold text-green-600">{Math.max(0, Math.floor((new Date(dlData.validTo).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days</p>
            </div>
          </div>
        </div>
      </div>
    </KioskLayout>
  )
}
