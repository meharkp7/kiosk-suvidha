import { useLocation, useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"

export default function ElectricityReceipt() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const { amount, reference } = state || {}

  if (!amount || !reference) {
    navigate("/services-dashboard")
    return null
  }

  return (
    <PageWrapper>
      <ScreenLayout
        title="Payment Receipt"
        subtitle="Transaction Successful"
      >
        <div className="space-y-8">

          <div className="bg-white border rounded-2xl p-8 shadow-sm space-y-4 text-center">

            <p className="text-2xl font-bold text-green-600">
              Payment Successful
            </p>

            <div className="space-y-2 text-lg">
              <p>
                Amount Paid: <span className="font-semibold">₹{amount}</span>
              </p>

              <p>
                Reference ID:
                <span className="font-semibold block mt-1">
                  {reference}
                </span>
              </p>
            </div>

          </div>

          <button
            onClick={() => navigate("/services-dashboard")}
            className="w-full h-16 bg-blue-800 text-white text-xl font-semibold rounded-2xl"
          >
            Back to Services
          </button>

        </div>
      </ScreenLayout>
    </PageWrapper>
  )
}