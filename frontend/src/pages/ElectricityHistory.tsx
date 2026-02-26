import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"
import { fetchBillHistory } from "../api/electricity"

export default function ElectricityHistory() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const accountNumber = state?.accountNumber

  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accountNumber) {
      navigate("/services-dashboard")
      return
    }

    fetchBillHistory(accountNumber)
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoading(false))
  }, [accountNumber, navigate])

  if (loading) {
    return (
      <PageWrapper>
        <ScreenLayout title="Bill History">
          <p className="text-center text-gray-500 text-lg">
            Loading history...
          </p>
        </ScreenLayout>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <ScreenLayout
        title="Bill History"
        subtitle="Last 3 electricity bills"
      >
        <div className="space-y-4">

          {history.length === 0 ? (
            <p className="text-gray-500 text-center">
              No billing records found.
            </p>
          ) : (
            history.map((bill) => (
              <div
                key={bill.id}
                className="bg-white border rounded-2xl p-6 shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold">
                    {bill.billingMonth}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{bill.totalAmount}
                  </p>
                </div>

                <div
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    bill.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {bill.status}
                </div>
              </div>
            ))
          )}

        </div>
      </ScreenLayout>
    </PageWrapper>
  )
}