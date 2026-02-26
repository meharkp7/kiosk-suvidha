import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"
import {
  fetchCurrentBill,
  payElectricityBill,
} from "../api/electricity"

export default function ElectricityPay() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const accountNumber = state?.accountNumber

  const [bill, setBill] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    if (!accountNumber) {
      navigate("/services-dashboard")
      return
    }

    fetchCurrentBill(accountNumber)
      .then(setBill)
      .catch(() => setBill(null))
      .finally(() => setLoading(false))
  }, [accountNumber, navigate])

  async function handlePay() {
    try {
      setPaying(true)

      const result = await payElectricityBill(accountNumber)

      navigate("/electricity/receipt", {
        state: {
          amount: result.amount,
          reference: result.reference,
        },
      })
    } catch {
      alert("Payment failed")
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <PageWrapper>
        <ScreenLayout title="Pay Electricity Bill">
          <p className="text-center text-gray-500 text-lg">
            Loading bill...
          </p>
        </ScreenLayout>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <ScreenLayout
        title="Pay Electricity Bill"
        subtitle="Review your current unpaid bill"
      >
        <div className="space-y-6">

          {!bill ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <p className="text-green-700 text-lg font-semibold">
                No unpaid bill 🎉
              </p>
              <p className="text-green-600 text-sm mt-1">
                All payments are up to date.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">

                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Billing Month</span>
                  <span className="font-semibold">
                    {bill.billingMonth}
                  </span>
                </div>

                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Units Consumed</span>
                  <span className="font-semibold">
                    {bill.unitsConsumed} kWh
                  </span>
                </div>

                <hr />

                <div className="flex justify-between">
                  <span>Fixed Charge</span>
                  <span>₹{bill.fixedCharge}</span>
                </div>

                <div className="flex justify-between">
                  <span>Energy Charge</span>
                  <span>₹{bill.energyCharge}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{bill.tax}</span>
                </div>

                <hr />

                <div className="flex justify-between text-2xl font-bold">
                  <span>Total Amount</span>
                  <span>₹{bill.totalAmount}</span>
                </div>

                <div className="text-right text-red-600 text-sm">
                  Due by {bill.dueDate}
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={paying}
                className="w-full h-16 bg-green-600 hover:bg-green-700 text-white text-xl font-semibold rounded-2xl shadow-md transition active:scale-95 disabled:opacity-60"
              >
                {paying ? "Processing..." : "Pay Now"}
              </button>
            </>
          )}

        </div>
      </ScreenLayout>
    </PageWrapper>
  )
}