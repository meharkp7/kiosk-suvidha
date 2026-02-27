import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import KioskLayout from "../components/KioskLayout"
import Sidebar from "../components/Sidebar"
import { API_BASE } from "../api/config"
import { useSession } from "../context/SessionContext"

const departmentIcons: Record<string, string> = {
  electricity: "⚡",
  water: "💧",
  gas: "🔥",
  municipal: "🏛️",
  transport: "🚗",
  pds: "🍚",
}

const departmentColors: Record<string, string> = {
  electricity: "from-amber-500 to-orange-600",
  water: "from-blue-500 to-cyan-600",
  gas: "from-orange-500 to-red-600",
  municipal: "from-emerald-500 to-teal-600",
  transport: "from-indigo-500 to-purple-600",
  pds: "from-violet-500 to-purple-600",
}

type Account = {
  id: number
  department: string
  accountNumber: string
}

type Service = {
  key: string
  label: string
  icon?: string
  description?: string
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
  "raise-issue": "🔧",
  status: "📍",
  history: "📜",
  "meter-reading": "📏",
  "new-connection": "🔌",
  "load-change": "⚡",
  "name-change": "📝",
  "billing-issues": "💰",
  surrender: "🚫",
  "damaged-cylinder": "⚠️",
  "regulator-issue": "🔧",
  "double-bottle": "🫙",
  "birth-certificate": "👶",
  "death-certificate": "⚰️",
  "marriage-certificate": "💒",
  "trade-license": "🏪",
  "street-light": "💡",
  garbage: "🗑️",
  drainage: "🚿",
  roads: "🛣️",
  "renew-license": "🔄",
  "learner-license": "📚",
  "vehicle-registration": "🚗",
  "permit-renewal": "📄",
  "fitness-certificate": "✅",
  noc: "📋",
  "add-member": "👨‍👩‍👧‍👦",
  "remove-member": "👤",
  "address-change": "📍",
  "card-duplicate": "📋",
  "fps-change": "🏪",
  "quality-complaint": "🍞",
  sewerage: "🚰",
}

export default function ServicesDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  // Get selected accounts from navigation state (passed from Dashboard) OR sessionStorage
  const selectedAccounts = location.state?.accounts as Account[] | undefined
  
  // Debug logging
  console.log("ServicesDashboard - selectedAccounts from state:", selectedAccounts)

  const [accounts, setAccounts] = useState<Account[]>(() => {
    // First check location state, then sessionStorage
    if (selectedAccounts && selectedAccounts.length > 0) {
      return selectedAccounts
    }
    // Try to load from sessionStorage
    const stored = sessionStorage.getItem("linkedAccounts")
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        console.error("Failed to parse stored accounts:", e)
      }
    }
    return []
  })
  const [activeDept, setActiveDept] = useState<string>("")
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  
  // Use global session timer
  const { timeLeft: sessionTime } = useSession()

  // Get linked departments from accounts
  const linkedDepts = accounts.map((a) => a.department.toLowerCase())
  
  console.log("ServicesDashboard - linkedDepts:", linkedDepts)
  
  // Use global session timer from SessionContext - no local timer needed

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Set initial active department when accounts load
  useEffect(() => {
    if (accounts.length > 0 && !activeDept) {
      setActiveDept(accounts[0].department.toLowerCase())
    }
  }, [accounts, activeDept])

  // Handle newly linked account - add to selected accounts only
  const handleAccountLinked = (dept: string, accountNumber: string) => {
    const newAccount: Account = {
      id: Date.now(),
      department: dept,
      accountNumber,
    }
    setAccounts((prev) => {
      const updated = [...prev, newAccount]
      // Save to sessionStorage
      sessionStorage.setItem("linkedAccounts", JSON.stringify(updated))
      return updated
    })
    setActiveDept(dept.toLowerCase())
  }

  // Save accounts to sessionStorage whenever they change
  useEffect(() => {
    if (accounts.length > 0) {
      sessionStorage.setItem("linkedAccounts", JSON.stringify(accounts))
    }
  }, [accounts])

  // Only use accounts passed from Dashboard - do NOT fetch all accounts
  useEffect(() => {
    if (selectedAccounts && selectedAccounts.length > 0) {
      setAccounts(selectedAccounts)
      setActiveDept(selectedAccounts[0].department.toLowerCase())
      // Save to sessionStorage
      sessionStorage.setItem("linkedAccounts", JSON.stringify(selectedAccounts))
    }
  }, [selectedAccounts])

  useEffect(() => {
    if (!activeDept) return

    async function fetchServices() {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/services/${activeDept}`, {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          const enhanced = data.map((s: Service) => ({
            ...s,
            icon: serviceIcons[s.key] || "📋",
            description: getServiceDescription(s.key, activeDept),
          }))
          setServices(enhanced)
        }
      } catch (err) {
        console.error("Failed to load services:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [activeDept])

  function getServiceDescription(key: string, dept: string): string {
    const descriptions: Record<string, Record<string, string>> = {
      electricity: {
        "current-bill": t("viewBillDesc"),
        "pay-bill": t("payBillDesc"),
        "bill-history": t("billHistoryDesc"),
        receipt: t("downloadReceiptDesc"),
        "raise-complaint": t("raiseComplaintDesc"),
        "complaint-status": t("complaintStatusDesc"),
        transfer: t("transferConnectionDesc"),
        "meter-reading": t("submitMeterReadingDesc"),
        "new-connection": t("newConnectionDesc"),
        "load-change": t("loadChangeDesc"),
        "name-change": t("nameChangeDesc"),
        "billing-issues": t("billingIssuesDesc"),
      },
      water: {
        "current-bill": t("viewWaterBillDesc"),
        "pay-bill": t("payWaterBillDesc"),
        history: t("waterHistoryDesc"),
        "raise-issue": t("raiseWaterComplaintDesc"),
        status: t("waterStatusDesc"),
        "meter-reading": t("waterMeterReadingDesc"),
        "new-connection": t("newWaterConnectionDesc"),
        transfer: t("transferWaterConnectionDesc"),
        "name-change": t("waterNameChangeDesc"),
        sewerage: t("sewerageConnectionDesc"),
      },
      gas: {
        "book-cylinder": t("bookCylinderDesc"),
        "booking-status": t("bookingStatusDesc"),
        "subsidy-info": t("subsidyInfoDesc"),
        receipt: t("gasReceiptDesc"),
        "raise-complaint": t("raiseGasComplaintDesc"),
        transfer: t("transferGasConnectionDesc"),
        surrender: t("surrenderConnectionDesc"),
        "damaged-cylinder": t("damagedCylinderDesc"),
        "regulator-issue": t("regulatorIssueDesc"),
        "new-connection": t("newGasConnectionDesc"),
        "double-bottle": t("doubleBottleDesc"),
      },
      municipal: {
        "pay-tax": t("payPropertyTaxDesc"),
        "tax-receipt": t("taxReceiptDesc"),
        "property-details": t("propertyDetailsDesc"),
        "apply-certificate": t("applyCertificateDesc"),
        "raise-complaint": t("raiseMunicipalComplaintDesc"),
        "complaint-status": t("municipalComplaintStatusDesc"),
        "birth-certificate": t("birthCertificateDesc"),
        "death-certificate": t("deathCertificateDesc"),
        "marriage-certificate": t("marriageCertificateDesc"),
        "trade-license": t("tradeLicenseDesc"),
        "street-light": t("streetLightDesc"),
        garbage: t("garbageDesc"),
        drainage: t("drainageDesc"),
        roads: t("roadsDesc"),
      },
      transport: {
        "vehicle-details": t("vehicleDetailsDesc"),
        "pay-challan": t("payChallanDesc"),
        "challan-history": t("challanHistoryDesc"),
        "dl-status": t("dlStatusDesc"),
        "renew-license": t("renewLicenseDesc"),
        "learner-license": t("learnerLicenseDesc"),
        "vehicle-registration": t("vehicleRegistrationDesc"),
        "permit-renewal": t("permitRenewalDesc"),
        "fitness-certificate": t("fitnessCertificateDesc"),
        noc: t("nocDesc"),
      },
      pds: {
        "card-details": t("rationCardDetailsDesc"),
        entitlement: t("entitlementDesc"),
        transactions: t("transactionsDesc"),
        "raise-grievance": t("raiseGrievanceDesc"),
        "grievance-status": t("grievanceStatusDesc"),
        "add-member": t("addMemberDesc"),
        "remove-member": t("removeMemberDesc"),
        "address-change": t("addressChangeDesc"),
        "card-duplicate": t("duplicateCardDesc"),
        "fps-change": t("fpsChangeDesc"),
        "quality-complaint": t("qualityComplaintDesc"),
      },
    }
    return descriptions[dept]?.[key] || t("accessService")
  }

  function handleNavigate(serviceKey: string) {
    const account = accounts.find(
      (a) => a.department.toLowerCase() === activeDept
    )

    if (!account) {
      alert(t("noAccountFound"))
      return
    }

    navigate(`/${activeDept}/${serviceKey}`, {
      state: {
        accountNumber: account.accountNumber,
        department: activeDept,
        service: serviceKey,
      },
    })
  }

  const activeAccount = accounts.find(
    (a) => a.department.toLowerCase() === activeDept
  )

  // Filter services for linked departments only
  const filteredServices = services.filter(() => linkedDepts.includes(activeDept))

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeDept={activeDept}
        linkedDepts={linkedDepts}
        onDeptChange={setActiveDept}
        onAccountLinked={handleAccountLinked}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Session Timer Header */}
        <div className="bg-white border-b border-slate-200 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="font-semibold text-slate-700 text-sm sm:text-base">{t("suvidhaKiosk")}</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-500 text-xs sm:text-sm">{t("servicesDashboard")}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className={`px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg font-mono font-medium text-xs sm:text-sm ${
              sessionTime < 60 ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
            }`}>
              <span className="hidden sm:inline">⏱️</span>
              <span className="sm:hidden">⏰</span>
              {formatTime(sessionTime)}
            </div>
            <button
              onClick={() => navigate("/login")}
              className="bg-red-600 text-white px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg font-medium hover:bg-red-700 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">{t("endSession")}</span>
              <span className="sm:hidden">End</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-3 sm:p-4 lg:p-6">
          {activeDept && linkedDepts.includes(activeDept) ? (
            <>
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <span className="text-2xl sm:text-3xl lg:text-4xl">{departmentIcons[activeDept]}</span>
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold capitalize text-gray-900">
                      {t(`${activeDept}Dept`)}
                    </h1>
                    <p className="text-gray-500">
                      {t("account")}: {activeAccount?.accountNumber || "N/A"}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 ml-14">
                  {t("selectServiceBelow")}
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-32 sm:h-48 lg:h-64">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-8 sm:py-12 lg:py-16 bg-white rounded-xl shadow-sm">
                  <p className="text-gray-500 text-sm sm:text-base">{t("noServicesAvailable")}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {services.map((service, index) => (
                    <button
                      key={service.key}
                      onClick={() => handleNavigate(service.key)}
                      className="group relative overflow-hidden bg-white rounded-xl p-4 sm:p-6 text-left transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-gray-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${departmentColors[activeDept]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                      />

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <span className="text-2xl sm:text-3xl bg-gray-100 rounded-lg p-2">
                            {service.icon}
                          </span>
                          <span className="text-gray-400 group-hover:text-gray-600 text-sm sm:text-base">→</span>
                        </div>

                        <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900 mb-2 line-clamp-2">
                          {service.label}
                        </h3>

                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                          {service.description}
                        </p>
                      </div>

                      <div
                        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${departmentColors[activeDept]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">💡 {t("tip")}</h4>
                  <p className="text-xs sm:text-sm text-blue-700">
                    {t("useSidebarToSwitch")}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-green-900 mb-1 text-sm sm:text-base">✅ {t("verified")}</h4>
                  <p className="text-xs sm:text-sm text-green-700">{t("secureTransactions")}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-purple-900 mb-1 text-sm sm:text-base">📞 {t("support")}</h4>
                  <p className="text-xs sm:text-sm text-purple-700">{t("helplineAvailable")}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 max-w-sm sm:max-w-md">
                <span className="text-4xl sm:text-6xl mb-4 block">👋</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
                  {t("welcomeToSuvidha")}
                </h2>
                <p className="text-slate-500 mb-6 text-sm sm:text-base">
                  {t("linkedDepartmentsCount", { count: linkedDepts.length })}
                  {linkedDepts.length === 0 && (
                    <span className="block mt-2 text-amber-600">
                      {t("clickSidebarToLink")}
                    </span>
                  )}
                </p>
                {linkedDepts.length > 0 && (
                  <p className="text-slate-600 text-sm sm:text-base">
                    {t("selectDeptFromSidebar")}
                  </p>
                )}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}