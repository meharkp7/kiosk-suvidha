import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"
import { raiseElectricityComplaint } from "../api/electricity"

const OPTIONS = [
  "No supply",
  "Meter issue",
  "Voltage fluctuation",
]

export default function ElectricityComplaint() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const accountNumber = state?.accountNumber

  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!accountNumber) {
    navigate("/services-dashboard")
    return null
  }

  async function handleSubmit() {
    if (!selected) return

    try {
      setLoading(true)

      await raiseElectricityComplaint(accountNumber, selected)

      setSuccess(true)
    } catch {
      alert("Failed to register complaint")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <ScreenLayout
        title="Raise Power Complaint"
        subtitle="Select issue type"
      >
        <div className="space-y-8">

          {!success ? (
            <>
              {OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelected(option)}
                  className={`w-full h-16 rounded-2xl text-lg font-semibold border transition
                    ${
                      selected === option
                        ? "bg-blue-800 text-white"
                        : "bg-white"
                    }`}
                >
                  {option}
                </button>
              ))}

              <button
                disabled={!selected || loading}
                onClick={handleSubmit}
                className="w-full h-16 bg-green-600 text-white text-xl font-semibold rounded-2xl disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Complaint"}
              </button>
            </>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <p className="text-green-700 text-lg font-semibold">
                Complaint Registered Successfully
              </p>
              <p className="text-green-600 text-sm mt-2">
                You can track status from Electricity Services.
              </p>
            </div>
          )}

        </div>
      </ScreenLayout>
    </PageWrapper>
  )
}