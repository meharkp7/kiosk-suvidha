import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"
import {
  fetchCurrentBill,
  payElectricityBill,
  fetchBillHistory,
} from "../api/electricity"

export default function ElectricityDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state } = useLocation()

  const accountNumber = state?.accountNumber || "E12345"

  const [bill, setBill] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    setLoading(true)

    fetchCurrentBill(accountNumber)
      .then(setBill)
      .catch(() => setBill(null))

    fetchBillHistory(accountNumber)
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setLoading(false))
  }, [accountNumber])

  async function handlePay() {
    try {
      setPaying(true)
      const result = await payElectricityBill(accountNumber)

      navigate("/success", {
        state: {
          amount: result.amount,
          reference: result.reference,
        },
      })
    } catch {
      alert(t("paymentFailed"))
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <PageWrapper>
        <ScreenLayout title={t("electricityBill")}>
          <p className="text-center text-gray-500 text-lg">
            {t("loadingBill")}
          </p>
        </ScreenLayout>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <ScreenLayout
        title="Electricity Services"
        subtitle="Manage your electricity account"
      >
        <div className="space-y-8">

          {/* CURRENT BILL SECTION */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Current Bill
            </h3>

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
                  className="w-full h-16 mt-4 bg-green-600 hover:bg-green-700 text-white text-xl font-semibold rounded-2xl shadow-md transition active:scale-95 disabled:opacity-60"
                >
                  {paying ? "Processing..." : "Pay Now"}
                </button>
              </>
            )}
          </div>

          {/* BILL HISTORY SECTION */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Previous Bills
            </h3>

            {history.length === 0 ? (
              <p className="text-gray-500">
                No previous records found.
              </p>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-xl p-4 bg-slate-50 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">
                        {item.billingMonth}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{item.totalAmount}
                      </p>
                    </div>

                    <div
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        item.status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </ScreenLayout>
    </PageWrapper>
  )
}