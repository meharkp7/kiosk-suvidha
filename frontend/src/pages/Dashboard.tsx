import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"
import { fetchAccounts } from "../api/accounts"

type Account = {
  id: string
  dept: string
  accountNo: string
}

export default function Dashboard() {
  const navigate = useNavigate()

  const [accounts, setAccounts] = useState<Account[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAccounts()
      .then(setAccounts)
      .finally(() => setLoading(false))
  }, [])

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  if (loading) {
    return (
      <PageWrapper>
        <ScreenLayout title="Linked Accounts">
          <p className="text-gray-500">Loading accounts...</p>
        </ScreenLayout>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <ScreenLayout
        title="Linked Accounts"
        subtitle="Select one or more accounts to continue"
      >
        {/* FULL HEIGHT COLUMN */}
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-6">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                onClick={() => toggle(acc.id)}
                className={`border rounded-lg p-4 cursor-pointer transition
                  ${
                    selected.includes(acc.id)
                      ? "border-blue-800 bg-blue-50"
                      : "hover:bg-slate-50"
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* SELECTION CIRCLE */}
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 shrink-0">
                    {selected.includes(acc.id) && (
                      <div className="w-2.5 h-2.5 bg-blue-800 rounded-full" />
                    )}
                  </div>

                  {/* ACCOUNT INFO */}
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      {acc.dept}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Account ID: {acc.accountNo}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FIXED CONTINUE BUTTON */}
          <button
            disabled={selected.length === 0}
            onClick={() =>
              navigate("/services-dashboard", {
                state: {
                  departments: accounts
                    .filter((a) => selected.includes(a.id))
                    .map((a) => a.dept),
                },
              })
            }
            className="w-full bg-blue-800 text-white py-4 rounded-lg text-lg disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </ScreenLayout>
    </PageWrapper>
  )
}