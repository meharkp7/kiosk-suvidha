import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { API_BASE } from "../../api/config"
import { useAccountNumber } from "../../hooks/useAccountNumber"

interface VehicleData {
  registrationNumber: string
  ownerName: string
  vehicleClass: string
  fuelType: string
  chassisNumber: string
  engineNumber: string
  registrationDate: string
  fitnessValidUpto?: string
  insuranceValidUpto?: string
  pucValidUpto?: string
}

export default function VehicleDetails() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("transport")

  const [vehicle, setVehicle] = useState<VehicleData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accountNumber) {
      setLoading(false)
      return
    }
    
    async function loadVehicle() {
      try {
        const res = await fetch(`${API_BASE}/transport/vehicle/${accountNumber}`, {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setVehicle(data)
        }
      } catch (err) {
        console.error("Failed to load vehicle details")
      } finally {
        setLoading(false)
      }
    }

    loadVehicle()
  }, [accountNumber])

  // Show error when no account
  if (!accountNumber) {
    return (
      <KioskLayout
        title={`🚗 ${t("vehicleDetails")}`}
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-indigo-50 rounded-2xl p-8">
            <span className="text-6xl mb-4 block">🚗</span>
            <h2 className="text-2xl font-bold text-indigo-800 mb-2">{t("noAccountSelected")}</h2>
            <p className="text-indigo-600 mb-6">{t("selectTransportAccount")}</p>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold"
            >
              {t("goToServicesDashboard")} →
            </button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  const isValid = (date?: string) => {
    if (!date) return false
    return new Date(date) > new Date()
  }

  if (loading) {
    return (
      <KioskLayout title="Vehicle Details" showHeader={true} showNav={true}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        </div>
      </KioskLayout>
    )
  }

  if (!vehicle) {
    return (
      <KioskLayout title="Vehicle Details" showHeader={true} showNav={true}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Vehicle Not Found</h2>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout
      title="🚗 Vehicle Details"
      subtitle={`Registration: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
    >
      <div className="max-w-4xl mx-auto">
        {/* Vehicle Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-200">Owner</p>
              <h2 className="text-2xl font-bold">{vehicle.ownerName}</h2>
            </div>
            <div className="text-right">
              <p className="text-indigo-200">Vehicle Class</p>
              <h2 className="text-2xl font-bold">{vehicle.vehicleClass}</h2>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Registration Details</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-slate-500 mb-1">Fuel Type</p>
              <p className="text-lg font-semibold text-slate-800">{vehicle.fuelType}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Registration Date</p>
              <p className="text-lg font-semibold text-slate-800">
                {new Date(vehicle.registrationDate).toLocaleDateString()}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-500 mb-1">Chassis Number</p>
              <p className="text-lg font-semibold text-slate-800">{vehicle.chassisNumber}</p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-500 mb-1">Engine Number</p>
              <p className="text-lg font-semibold text-slate-800">{vehicle.engineNumber}</p>
            </div>
          </div>
        </div>

        {/* Validity Status */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Document Validity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-semibold text-slate-800">Fitness Certificate</p>
                {vehicle.fitnessValidUpto && (
                  <p className="text-sm text-slate-500">
                    Valid till: {new Date(vehicle.fitnessValidUpto).toLocaleDateString()}
                  </p>
                )}
              </div>
              <span
                className={`px-4 py-2 rounded-full font-semibold ${
                  isValid(vehicle.fitnessValidUpto)
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isValid(vehicle.fitnessValidUpto) ? "Valid" : "Expired"}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-semibold text-slate-800">Insurance</p>
                {vehicle.insuranceValidUpto && (
                  <p className="text-sm text-slate-500">
                    Valid till: {new Date(vehicle.insuranceValidUpto).toLocaleDateString()}
                  </p>
                )}
              </div>
              <span
                className={`px-4 py-2 rounded-full font-semibold ${
                  isValid(vehicle.insuranceValidUpto)
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isValid(vehicle.insuranceValidUpto) ? "Valid" : "Expired"}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-semibold text-slate-800">PUC</p>
                {vehicle.pucValidUpto && (
                  <p className="text-sm text-slate-500">
                    Valid till: {new Date(vehicle.pucValidUpto).toLocaleDateString()}
                  </p>
                )}
              </div>
              <span
                className={`px-4 py-2 rounded-full font-semibold ${
                  isValid(vehicle.pucValidUpto)
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isValid(vehicle.pucValidUpto) ? "Valid" : "Expired"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/transport/challan-history", { state: { accountNumber } })}
            className="bg-indigo-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700"
          >
            🎫 View Challans
          </button>
          <button
            onClick={() => window.print()}
            className="bg-slate-700 text-white py-4 rounded-xl text-lg font-semibold hover:bg-slate-800"
          >
            🖨️ Print Details
          </button>
        </div>
      </div>
    </KioskLayout>
  )
}
