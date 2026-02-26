import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"

const departments = [
  "Electricity Department",
  "Water Supply Board",
  "Municipal Corporation",
  "Transport Department",
]

export default function ServiceSelect() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string[]>([])

  const toggleDept = (dept: string) => {
    setSelected((prev) =>
      prev.includes(dept)
        ? prev.filter((d) => d !== dept)
        : [...prev, dept]
    )
  }

  return (
    <PageWrapper>
      <h2 className="text-2xl font-semibold mb-4">
        {t("selectDepartments")}
      </h2>

      <p className="text-gray-500 mb-8">
        {t("youMaySelectMultipleDepartments")}
      </p>

      <div className="space-y-4 mb-10">
        {departments.map((dept) => (
          <label
            key={dept}
            className="flex items-center gap-4 border rounded-lg p-5 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(dept)}
              onChange={() => toggleDept(dept)}
              className="w-5 h-5"
            />
            <span className="text-lg">{dept}</span>
          </label>
        ))}
      </div>

      <button
        disabled={selected.length === 0}
        onClick={() =>
          navigate("/services-dashboard", {
            state: { selectedDepartments: selected },
          })
        }
        className="w-full bg-blue-800 text-white py-4 rounded-lg text-lg disabled:opacity-50"
      >
        {t("viewAvailableServices")}
      </button>
    </PageWrapper>
  )
}