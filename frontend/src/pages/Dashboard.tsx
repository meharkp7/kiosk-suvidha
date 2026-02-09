import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"

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
      <h2 className="text-2xl font-semibold mb-4">
        Select Linked Accounts
      </h2>

      <div className="space-y-3 mb-8">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            onClick={() => toggle(acc.id)}
            className={`border rounded-lg p-4 flex items-center gap-4 cursor-pointer
              ${selected.includes(acc.id) ? "bg-blue-50 border-blue-800" : ""}
            `}
          >
            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
              {selected.includes(acc.id) && (
                <div className="w-2.5 h-2.5 bg-blue-800 rounded-full" />
              )}
            </div>

            <div>
              <p className="font-medium">{acc.dept}</p>
              <p className="text-sm text-gray-500">
                Account ID: {acc.accountNo}
              </p>
            </div>
          </div>
        ))}
      </div>

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
    </PageWrapper>
  )
}