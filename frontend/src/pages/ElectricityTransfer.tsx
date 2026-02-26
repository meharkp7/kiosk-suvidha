import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"
import { createTransferRequest } from "../api/electricity"

export default function ElectricityTransfer() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const accountNumber = state?.accountNumber

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!accountNumber) {
    navigate("/services-dashboard")
    return null
  }

  async function handleTransfer() {
    try {
      setLoading(true)

      await createTransferRequest(accountNumber)

      setSuccess(true)
    } catch {
      alert("Failed to submit request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <ScreenLayout
        title="Transfer Connection"
        subtitle="Request shift to new residence"
      >
        <div className="space-y-8">

          {!success ? (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                <p className="text-yellow-700 font-semibold text-lg">
                  Connection Transfer Request
                </p>
                <p className="text-yellow-700 text-sm mt-2">
                  This kiosk will only register your request.
                  You must visit the local electricity office
                  with required documents to complete transfer.
                </p>
              </div>

              <button
                onClick={handleTransfer}
                disabled={loading}
                className="w-full h-16 bg-blue-800 text-white text-xl font-semibold rounded-2xl disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Transfer Request"}
              </button>
            </>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <p className="text-green-700 text-lg font-semibold">
                Transfer request submitted successfully
              </p>
              <p className="text-green-600 text-sm mt-2">
                Please visit your local electricity office
                with valid address proof to complete the process.
              </p>
            </div>
          )}

        </div>
      </ScreenLayout>
    </PageWrapper>
  )
}