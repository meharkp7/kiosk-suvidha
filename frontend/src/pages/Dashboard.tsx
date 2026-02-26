import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../components/KioskLayout"
import { fetchAccounts } from "../api/accounts"

const departmentIcons: Record<string, string> = {
  electricity: "⚡",
  water: "💧",
  gas: "🔥",
  municipal: "🏛️",
  transport: "🚗",
  pds: "🍚",
}

const departmentColors: Record<string, string> = {
  electricity: "from-amber-500 to-orange-500",
  water: "from-blue-500 to-cyan-500",
  gas: "from-orange-500 to-red-500",
  municipal: "from-emerald-500 to-teal-500",
  transport: "from-indigo-500 to-purple-500",
  pds: "from-violet-500 to-purple-500",
}

type Account = {
  id: number
  department: string
  accountNumber: string
}

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [accounts, setAccounts] = useState<Account[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  
  // Session timer
  const [sessionTime, setSessionTime] = useState(300)
  
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

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAccounts()
        if (data && data.length > 0) {
          setAccounts(data)
          // Auto-select first account
          setSelected([data[0].id])
        }
      } catch (error) {
        console.error("Error fetching accounts:", error)
        setAccounts([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selected.length === accounts.length) {
      setSelected([])
    } else {
      setSelected(accounts.map((a) => a.id))
    }
  }

  if (loading) {
    return (
      <KioskLayout title={t("linkedAccounts")} subtitle={`${t("loading")}... | ⏱️ ${formatTime(sessionTime)}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout
      title={t("linkedAccounts")}
      subtitle={`${t("selectAccounts")} | ⏱️ ${formatTime(sessionTime)}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/")}
      onHome={() => navigate("/")}
    >
      <div className="max-w-4xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-6 text-white">
          <h2 className="text-2xl font-bold mb-2">👋 {t("welcome")}!</h2>
          <p>
            {t("linkedAccountsCount", { count: accounts.length })}
            {t("selectAccountsToUse")}
          </p>
        </div>

        {/* Select All Toggle */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-600 font-medium">
            {selected.length} {t("of")} {accounts.length} {t("selected")}
          </p>
          <button
            onClick={selectAll}
            className="text-blue-600 font-medium hover:text-blue-800"
          >
            {selected.length === accounts.length ? t("deselectAll") : t("selectAll")}
          </button>
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {accounts.map((acc) => {
            const isSelected = selected.includes(acc.id)
            const dept = acc.department.toLowerCase()
            return (
              <button
                key={acc.id}
                onClick={() => toggle(acc.id)}
                className={`relative overflow-hidden rounded-xl p-6 text-left transition-all duration-300 border-2 ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 shadow-lg"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:shadow"
                }`}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    ✓
                  </div>
                )}

                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${departmentColors[dept]} flex items-center justify-center text-3xl`}
                  >
                    {departmentIcons[dept] || "📋"}
                  </div>

                  {/* Info */}
                  <div>
                    <p className="font-bold text-lg text-slate-800 capitalize">
                      {acc.department}
                    </p>
                    <p className="text-sm text-slate-500">
                      {acc.accountNumber}
                    </p>
                  </div>
                </div>

                {/* Bottom Accent */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${departmentColors[dept]} ${
                    isSelected ? "opacity-100" : "opacity-0"
                  } transition-opacity`}
                />
              </button>
            )
          })}
        </div>

        {/* No Accounts State */}
        {accounts.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center">
            <span className="text-6xl mb-4 block">📭</span>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {t("noLinkedAccounts")}
            </h3>
            <p className="text-slate-500 mb-4">
              {t("visitCscToLink")}
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-800 text-white px-6 py-3 rounded-xl"
            >
              {t("returnToHome")}
            </button>
          </div>
        )}

        {/* Continue Button */}
        {accounts.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
            <div className="max-w-4xl mx-auto">
              <button
                disabled={selected.length === 0}
                onClick={() => {
                  const filteredAccounts = accounts.filter((a) => selected.includes(a.id))
                  console.log("Dashboard - Passing accounts:", filteredAccounts)
                  navigate("/services-dashboard", {
                    state: {
                      accounts: filteredAccounts,
                    },
                  })
                }}
                className="w-full bg-blue-800 text-white py-4 rounded-xl text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg"
              >
                {t("continueWith")} {selected.length} {t("dashboardAccount")}
                {selected.length !== 1 ? t("accountsPlural") : ""} →
              </button>
            </div>
          </div>
        )}
      </div>
    </KioskLayout>
  )
}