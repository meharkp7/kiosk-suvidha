import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"

type Account = {
  id: number
  department: string
  accountNumber: string
}

export default function ServicesDashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  const [accounts, setAccounts] = useState<Account[]>([])
  const [activeDept, setActiveDept] = useState<string | null>(null)

  useEffect(() => {
    if (location.state?.accounts) {
      setAccounts(location.state.accounts)
      setActiveDept(location.state.accounts[0]?.department)
      sessionStorage.setItem(
        "selectedAccounts",
        JSON.stringify(location.state.accounts)
      )
    } else {
      const saved = sessionStorage.getItem("selectedAccounts")
      if (saved) {
        const parsed = JSON.parse(saved)
        setAccounts(parsed)
        setActiveDept(parsed[0]?.department)
      } else {
        navigate("/dashboard")
      }
    }
  }, [location.state, navigate])

  const departments = [...new Set(accounts.map((a) => a.department))]

  if (!activeDept) return null

  return (
    <PageWrapper>
      <ScreenLayout
        title="Available Services"
        subtitle="Choose a department and service"
      >
        <div className="flex h-full">
          <div className="w-20 bg-slate-50 border-r flex flex-col items-center py-6 gap-4">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`w-12 h-12 rounded-full text-xl flex items-center justify-center
                  ${
                    activeDept === dept
                      ? "bg-blue-800 text-white"
                      : "bg-white border"
                  }`}
              >
                {dept.charAt(0)}
              </button>
            ))}
          </div>

          <div className="flex-1 p-8 overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">
              {activeDept}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() =>
                  navigate("/service-dashboard", {
                    state: {
                      department: activeDept,
                      account: accounts.find(
                        (a) => a.department === activeDept
                      ),
                    },
                  })
                }
                className="border rounded-lg p-4 text-left hover:bg-slate-50"
              >
                Open Services
              </button>
            </div>
          </div>
        </div>
      </ScreenLayout>
    </PageWrapper>
  )
}