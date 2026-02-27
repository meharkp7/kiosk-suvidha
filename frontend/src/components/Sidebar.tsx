import { useState } from "react"
import { useTranslation } from "react-i18next"
import LinkAccountModal from "./LinkAccountModal"

const allDepartments = [
  { id: "electricity", nameKey: "electricity", icon: "⚡", color: "#fbbf24" },
  { id: "water", nameKey: "water", icon: "💧", color: "#3b82f6" },
  { id: "gas", nameKey: "gas", icon: "🔥", color: "#f97316" },
  { id: "municipal", nameKey: "municipal", icon: "🏛️", color: "#10b981" },
  { id: "transport", nameKey: "transport", icon: "🚗", color: "#6366f1" },
  { id: "pds", nameKey: "ration", icon: "🍚", color: "#8b5cf6" },
]

interface SidebarProps {
  activeDept: string
  linkedDepts: string[]
  onDeptChange: (dept: string) => void
  onAccountLinked: (dept: string, accountNumber: string) => void
}

export default function Sidebar({
  activeDept,
  linkedDepts,
  onDeptChange,
  onAccountLinked,
}: SidebarProps) {
  const { t } = useTranslation()
  const [collapsed, setCollapsed] = useState(false)
  const [linkingDept, setLinkingDept] = useState<string | null>(null)

  const handleLinkSuccess = (deptId: string, accountNumber: string) => {
    onAccountLinked(deptId, accountNumber)
    setLinkingDept(null)
    onDeptChange(deptId)
  }

  const linkingDeptInfo = allDepartments.find((d) => d.id === linkingDept)

  return (
    <>
      <div
        className={`${
          collapsed ? "w-16 sm:w-20" : "w-56 sm:w-64 lg:w-72"
        } h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 flex-shrink-0 relative z-20`}
      >
        {/* Logo Area */}
        <div className="p-3 sm:p-4 border-b border-slate-700 flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="font-bold text-base sm:text-lg">SUVIDHA</h1>
              <p className="text-xs text-slate-400 hidden sm:inline">e-Governance</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-slate-700 text-slate-400"
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Department Navigation */}
        <nav className="flex-1 py-2 sm:py-4 overflow-y-auto">
          {allDepartments.map((dept) => {
            const isLinked = linkedDepts.includes(dept.id)
            const isActive = activeDept === dept.id

            return (
              <div key={dept.id} className="px-2 sm:px-3 mb-1 sm:mb-2">
                {isLinked ? (
                  <button
                    onClick={() => onDeptChange(dept.id)}
                    className={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-all hover:bg-slate-800 ${
                      isActive ? "bg-slate-800 border-r-2 sm:border-r-4" : ""
                    }`}
                    style={{
                      borderRightColor: isActive ? dept.color : "transparent",
                    }}
                  >
                    <span className="text-xl sm:text-2xl">{dept.icon}</span>
                    {!collapsed && (
                      <div className="text-left flex-1">
                        <p className="font-medium text-xs sm:text-sm">{t(dept.nameKey)}</p>
                        <p className="text-xs text-green-400 hidden sm:inline">{t("linked")} ✓</p>
                      </div>
                    )}
                    {isActive && !collapsed && (
                      <span className="text-xs text-slate-400 hidden sm:inline">●</span>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setLinkingDept(dept.id)}
                    className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-all hover:bg-slate-800 opacity-60"
                  >
                    <span className="text-xl sm:text-2xl opacity-50">{dept.icon}</span>
                    {!collapsed && (
                      <div className="text-left flex-1">
                        <p className="font-medium text-xs sm:text-sm text-slate-400">{t(dept.nameKey)}</p>
                        <p className="text-xs text-amber-400 hidden sm:inline">{t("clickToLink")} +</p>
                      </div>
                    )}
                  </button>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-700">
          {!collapsed && (
            <div className="text-xs text-slate-400">
              <p className="font-semibold mb-1">{t("linked")}: {linkedDepts.length}/6</p>
              <p className="hidden sm:inline">{t("linkAccountsToAccess")}</p>
              <p className="sm:hidden">{t("linkAccounts")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Link Account Modal */}
      {linkingDept && linkingDeptInfo && (
        <LinkAccountModal
          department={linkingDept}
          departmentName={t(linkingDeptInfo.nameKey)}
          icon={linkingDeptInfo.icon}
          onClose={() => setLinkingDept(null)}
          onSuccess={(accountNumber) =>
            handleLinkSuccess(linkingDept, accountNumber)
          }
        />
      )}
    </>
  )
}
