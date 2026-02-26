import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import KioskLayout from "../components/KioskLayout"
import Sidebar from "../components/Sidebar"
import { API_BASE } from "../api/config"

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
  const navigate = useNavigate()
  const location = useLocation()

  // Get selected accounts from navigation state (passed from Dashboard)
  const selectedAccounts = location.state?.accounts as Account[] | undefined

  const [accounts, setAccounts] = useState<Account[]>(selectedAccounts || [])
  const [activeDept, setActiveDept] = useState<string>("")
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  
  // Session timer
  const [sessionTime, setSessionTime] = useState(300)

  // Get linked departments from accounts
  const linkedDepts = accounts.map((a) => a.department.toLowerCase())
  
  // Session timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => {
        if (prev <= 1) {
          navigate("/login")
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])
  
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
    setAccounts((prev) => [...prev, newAccount])
    setActiveDept(dept.toLowerCase())
  }

  // If no accounts passed from Dashboard, fetch from API (fallback)
  useEffect(() => {
    if (selectedAccounts && selectedAccounts.length > 0) {
      // Use accounts passed from Dashboard
      setAccounts(selectedAccounts)
      setActiveDept(selectedAccounts[0].department.toLowerCase())
      return
    }

    async function loadAccounts() {
      try {
        const res = await fetch(`${API_BASE}/accounts/me`, {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setAccounts(data)
          if (data.length > 0) {
            setActiveDept(data[0].department.toLowerCase())
          }
        }
      } catch (err) {
        console.error("Failed to load accounts:", err)
      }
    }
    loadAccounts()
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
        "current-bill": "View and download your latest electricity bill",
        "pay-bill": "Pay your electricity bill online securely",
        "bill-history": "View past 12 months billing history",
        receipt: "Download payment receipts",
        "raise-complaint": "Report power issues or billing problems",
        "complaint-status": "Track status of your complaints",
        transfer: "Apply for connection transfer",
        "meter-reading": "Submit your monthly meter reading",
        "new-connection": "Apply for new electricity connection",
        "load-change": "Increase or decrease connection load",
        "name-change": "Change account holder name",
        "billing-issues": "Dispute incorrect bill charges",
      },
      water: {
        "current-bill": "View current water consumption bill",
        "pay-bill": "Pay water charges online",
        history: "View payment history",
        "raise-issue": "Report water supply issues",
        status: "Check complaint status",
        "meter-reading": "Submit water meter reading",
        "new-connection": "Apply for new water connection",
        transfer: "Transfer connection to new owner",
        "name-change": "Update account holder name",
        sewerage: "Apply for sewerage connection",
      },
      gas: {
        "book-cylinder": "Book LPG cylinder refill",
        "booking-status": "Track cylinder delivery status",
        "subsidy-info": "View subsidy and payment details",
        receipt: "Download booking receipts",
        "raise-complaint": "Report service issues",
        transfer: "Transfer connection to new address",
        surrender: "Surrender gas connection",
        "damaged-cylinder": "Report damaged/leaking cylinder",
        "regulator-issue": "Report regulator problems",
        "new-connection": "Apply for new LPG connection",
        "double-bottle": "Apply for double bottle connection",
      },
      municipal: {
        "pay-tax": "Pay property/house tax online",
        "tax-receipt": "Download property tax receipts",
        "property-details": "View your property information",
        "apply-certificate": "Apply for certificates",
        "raise-complaint": "Report civic issues",
        "complaint-status": "Track complaint resolution",
        "birth-certificate": "Apply for birth certificate",
        "death-certificate": "Apply for death certificate",
        "marriage-certificate": "Apply for marriage certificate",
        "trade-license": "Apply/renew trade license",
        "street-light": "Report street light issues",
        garbage: "Report garbage collection issues",
        drainage: "Report drainage blockage",
        roads: "Report road damage/potholes",
      },
      transport: {
        "vehicle-details": "View RC and vehicle information",
        "pay-challan": "Pay traffic challans online",
        "challan-history": "View violation history",
        "dl-status": "Check driving license status",
        "renew-license": "Renew driving license",
        "learner-license": "Apply for learner license",
        "vehicle-registration": "Register new vehicle",
        "permit-renewal": "Renew vehicle permit",
        "fitness-certificate": "Apply for fitness certificate",
        noc: "Apply for No Objection Certificate",
      },
      pds: {
        "card-details": "View ration card details",
        entitlement: "Check monthly food grain quota",
        transactions: "View ration purchase history",
        "raise-grievance": "Report ration shop issues",
        "grievance-status": "Track grievance status",
        "add-member": "Add family member to card",
        "remove-member": "Remove member from card",
        "address-change": "Update card address",
        "card-duplicate": "Apply for duplicate card",
        "fps-change": "Change Fair Price Shop",
        "quality-complaint": "Report food quality issues",
      },
    }
    return descriptions[dept]?.[key] || "Access this service"
  }

  function handleNavigate(serviceKey: string) {
    const account = accounts.find(
      (a) => a.department.toLowerCase() === activeDept
    )

    if (!account) {
      alert("No account found for this department")
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
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700">SUVIDHA Kiosk</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500">Services Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg font-mono font-medium ${
              sessionTime < 60 ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
            }`}>
              ⏱️ {formatTime(sessionTime)}
            </div>
            <button
              onClick={() => navigate("/login")}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700"
            >
              End Session
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-6">
          {activeDept && linkedDepts.includes(activeDept) ? (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{departmentIcons[activeDept]}</span>
                  <div>
                    <h1 className="text-3xl font-bold capitalize text-gray-900">
                      {activeDept} Department
                    </h1>
                    <p className="text-gray-500">
                      Account: {activeAccount?.accountNumber || "N/A"}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 ml-14">
                  Select a service below to access government e-services
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                  <p className="text-gray-500">No services available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service, index) => (
                    <button
                      key={service.key}
                      onClick={() => handleNavigate(service.key)}
                      className="group relative overflow-hidden bg-white rounded-xl p-6 text-left transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-gray-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${departmentColors[activeDept]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                      />

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <span className="text-3xl bg-gray-100 rounded-lg p-2">
                            {service.icon}
                          </span>
                          <span className="text-gray-400 group-hover:text-gray-600">→</span>
                        </div>

                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {service.label}
                        </h3>

                        <p className="text-sm text-gray-500 line-clamp-2">
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

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-1">💡 Tip</h4>
                  <p className="text-sm text-blue-700">
                    Use the sidebar to switch between departments
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-1">✅ Verified</h4>
                  <p className="text-sm text-green-700">All transactions are secure</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-1">📞 Support</h4>
                  <p className="text-sm text-purple-700">24/7 helpline available</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md">
                <span className="text-6xl mb-4 block">👋</span>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Welcome to SUVIDHA
                </h2>
                <p className="text-slate-500 mb-6">
                  You have {linkedDepts.length} linked department{linkedDepts.length !== 1 ? "s" : ""}.
                  {linkedDepts.length === 0 && (
                    <span className="block mt-2 text-amber-600">
                      Click on a department in the sidebar to link your account.
                    </span>
                  )}
                </p>
                {linkedDepts.length > 0 && (
                  <p className="text-slate-600">
                    Select a department from the sidebar to view services.
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