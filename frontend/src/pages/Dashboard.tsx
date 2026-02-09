import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"

const accounts = [
  { id: "elec", dept: "Electricity Department", accountNo: "ELEC-982374" },
  { id: "water", dept: "Water Supply Board", accountNo: "WATER-128374" },
  { id: "municipal", dept: "Municipal Corporation", accountNo: "PROP-556677" },
  { id: "transport", dept: "Transport Department", accountNo: "DL-01-AB-1234" },
  { id: "gas", dept: "Gas Authority", accountNo: "GAS-772211" },
  { id: "telecom", dept: "Telecom Services", accountNo: "TEL-998877" },
  { id: "housing", dept: "Housing Board", accountNo: "HOUSE-445566" },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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
          {/* SCROLLABLE ACCOUNTS LIST */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 sm:pr-2 mb-4">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                onClick={() => toggle(acc.id)}
                className={`border rounded-lg p-3 sm:p-4 flex items-start gap-3 sm:gap-4 cursor-pointer ${
                  selected.includes(acc.id)
                    ? "bg-blue-50 border-blue-800"
                    : "hover:bg-slate-50"
                }`}
              >
                {/* Selection Circle */}
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0">
                  {selected.includes(acc.id) && (
                    <div className="w-2.5 h-2.5 bg-blue-800 rounded-full" />
                  )}
                </div>

                {/* Account Info */}
                <div>
                  <p className="font-medium text-sm sm:text-base">{acc.dept}</p>
                  <p className="text-sm text-gray-500">
                    Account ID: {acc.accountNo}
                  </p>
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