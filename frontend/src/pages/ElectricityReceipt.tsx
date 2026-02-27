import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"

export default function ElectricityReceipt() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state } = useLocation()

  const { amount, reference } = state || {}

  useEffect(() => {
    if (!amount || !reference) {
      navigate("/services-dashboard")
    }
  }, [amount, reference, navigate])

  if (!amount || !reference) {
    return null
  }

  return (
    <PageWrapper>
      <ScreenLayout
        title={t("paymentReceipt")}
        subtitle={t("transactionSuccessful")}
      >
        <div className="space-y-8">

          <div className="bg-white border rounded-2xl p-8 shadow-sm space-y-4 text-center">

            <p className="text-2xl font-bold text-green-600">
              {t("paymentSuccessful")}
            </p>

            <div className="space-y-2 text-lg">
              <p>
                {t("amountPaid")}: <span className="font-semibold">₹{amount}</span>
              </p>

              <p>
                {t("referenceId")}:
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
            {t("backToServices")}
          </button>

        </div>
      </ScreenLayout>
    </PageWrapper>
  )
}