import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import KioskLayout from "../components/KioskLayout"
import { API_BASE } from "../api/config"

const departmentIcons: Record<string, string> = {
  electricity: "⚡",
  water: "💧",
  gas: "🔥",
  municipal: "🏛️",
  transport: "🚗",
  pds: "🍚",
}

const serviceIcons: Record<string, string> = {
  "current-bill": "📄",
  "pay-bill": "💳",
  "bill-history": "📊",
  receipt: "🧾",
  "raise-complaint": "📢",
  "complaint-status": "🔍",
  transfer: "🔄",
  "book-cylinder": "⛽",
  "booking-status": "📦",
  "subsidy-info": "💰",
  "pay-tax": "🏠",
  "tax-receipt": "📃",
  "property-details": "🏘️",
  "apply-certificate": "📜",
  "vehicle-details": "🚙",
  "pay-challan": "🎫",
  "challan-history": "📋",
  "dl-status": "🪪",
  "card-details": "🆔",
  entitlement: "📋",
  transactions: "💸",
  "raise-grievance": "📢",
  "grievance-status": "🔍",
}

export default function ServicePage() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { accountNumber, department, service } = location.state || {}

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accountNumber || !department || !service) {
      setError(t("missingRequiredInfo"))
      setLoading(false)
      return
    }

    async function loadServiceData() {
      try {
        setLoading(true)
        let endpoint = ""

        switch (department) {
          case "electricity":
            if (service === "current-bill") endpoint = `/electricity/bill/${accountNumber}`
            else if (service === "bill-history") endpoint = `/electricity/history/${accountNumber}`
            break
          case "water":
            if (service === "current-bill") endpoint = `/water/bill/${accountNumber}`
            else if (service === "history") endpoint = `/water/history/${accountNumber}`
            break
          case "gas":
            endpoint = `/gas/account/${accountNumber}`
            break
          case "municipal":
            if (service === "property-details") endpoint = `/municipal/property/${accountNumber}`
            else if (service === "pay-tax") endpoint = `/municipal/tax-bill/${accountNumber}`
            break
          case "transport":
            if (service === "vehicle-details") endpoint = `/transport/vehicle/${accountNumber}`
            else if (service === "challan-history") endpoint = `/transport/challans/${accountNumber}`
            break
          case "pds":
            if (service === "card-details") endpoint = `/pds/card/${accountNumber}`
            else if (service === "entitlement") endpoint = `/pds/entitlement/${accountNumber}`
            else if (service === "transactions") endpoint = `/pds/transactions/${accountNumber}`
            break
        }

        if (endpoint) {
          const res = await fetch(`${API_BASE}${endpoint}`, {
            credentials: "include",
          })
          if (res.ok) {
            const result = await res.json()
            setData(result)
          } else {
            setError("Failed to load data from server")
          }
        } else {
          setData({ message: "Service form will be displayed here" })
        }
      } catch (err) {
        setError("Network error. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadServiceData()
  }, [accountNumber, department, service])

  if (loading) {
    return (
      <KioskLayout title="Loading..." showHeader={true} showNav={true}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </div>
      </KioskLayout>
    )
  }

  if (error) {
    return (
      <KioskLayout
        title="Error"
        subtitle="Something went wrong"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 rounded-2xl p-8 text-center">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h2 className="text-2xl font-bold text-red-800 mb-2">{error}</h2>
            <p className="text-red-600 mb-6">
              Unable to load the requested service. Please try again or contact support.
            </p>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700"
            >
              Return to Services
            </button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout
      title={`${departmentIcons[department] || "📋"} ${t(department || "")} ${t("services")}`}
      subtitle={`Account: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
      onHome={() => navigate("/")}
    >
      <div className="max-w-4xl mx-auto">
        {/* Service Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{serviceIcons[service] || "📋"}</span>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 capitalize">
                {t(service.replace(/-([a-z])/g, (g: string[]) => g[1].toUpperCase()))}
              </h1>
              <p className="text-slate-500 text-lg">
                {t(department || "")} {t("department")}
              </p>
            </div>
          </div>
        </div>

        {/* Data Display */}
        {data && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">{t("serviceDetails")}</h2>
            <div className="bg-slate-50 rounded-xl p-6 overflow-auto max-h-96">
              <pre className="text-sm text-slate-700 whitespace-pre-wrap">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Action Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">{t("actions")}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.includes("pay") && (
              <button className="flex items-center justify-center gap-3 bg-blue-600 text-white py-5 rounded-xl text-xl font-semibold hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg">
                <span>💳</span>
                {t("proceedToPayment")}
              </button>
            )}
            
            {service.includes("complaint") && (
              <button className="flex items-center justify-center gap-3 bg-amber-600 text-white py-5 rounded-xl text-xl font-semibold hover:bg-amber-700 transition-all active:scale-[0.98] shadow-lg">
                <span>📢</span>
                {t("submitComplaint")}
              </button>
            )}
            
            {service.includes("book") && (
              <button className="flex items-center justify-center gap-3 bg-green-600 text-white py-5 rounded-xl text-xl font-semibold hover:bg-green-700 transition-all active:scale-[0.98] shadow-lg">
                <span>✓</span>
                {t("bookNow")}
              </button>
            )}
            
            {service.includes("apply") && (
              <button className="flex items-center justify-center gap-3 bg-purple-600 text-white py-5 rounded-xl text-xl font-semibold hover:bg-purple-700 transition-all active:scale-[0.98] shadow-lg">
                <span>📝</span>
                {t("applyNow")}
              </button>
            )}
            
            {service.includes("transfer") && (
              <button className="flex items-center justify-center gap-3 bg-indigo-600 text-white py-5 rounded-xl text-xl font-semibold hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-lg">
                <span>🔄</span>
                {t("requestTransfer")}
              </button>
            )}
            
            {service.includes("download") || service.includes("receipt") && (
              <button className="flex items-center justify-center gap-3 bg-slate-700 text-white py-5 rounded-xl text-xl font-semibold hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg">
                <span>⬇️</span>
                {t("downloadPDF")}
              </button>
            )}
          </div>

          {/* Cancel Button */}
          <button
            onClick={() => navigate("/services-dashboard")}
            className="w-full mt-4 bg-slate-100 text-slate-700 py-4 rounded-xl text-lg font-medium hover:bg-slate-200 transition-all"
          >
            {t("backToServices")}
          </button>
        </div>

        {/* Help Card */}
        <div className="mt-6 bg-blue-50 rounded-2xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 {t("needHelp")}</h3>
          <p className="text-blue-700 text-sm">
            {t("serviceHelpText")}
          </p>
        </div>
      </div>
    </KioskLayout>
  )
}
