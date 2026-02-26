import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"
import { createTransferRequest } from "../api/electricity"

export default function ElectricityTransfer() {
  const { t } = useTranslation()
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
      alert(t("failedToSubmitRequest"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <ScreenLayout
        title={t("transferConnection")}
        subtitle={t("requestShiftToNewResidence")}
      >
        <div className="space-y-8">

          {!success ? (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                <p className="text-yellow-700 font-semibold text-lg">
                  {t("connectionTransferRequest")}
                </p>
                <p className="text-yellow-700 text-sm mt-2">
                  {t("kioskWillRegisterRequest")}
                  {t("visitLocalOfficeToComplete")}
                </p>
              </div>

              <button
                onClick={handleTransfer}
                disabled={loading}
                className="w-full h-16 bg-blue-800 text-white text-xl font-semibold rounded-2xl disabled:opacity-50"
              >
                {loading ? t("submitting") : t("submitTransferRequest")}
              </button>
            </>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <p className="text-green-700 text-lg font-semibold">
                {t("transferRequestRegistered")}
              </p>
              <p className="text-green-600 text-sm mt-2">
                {t("visitOfficeWithDocuments")}
              </p>
            </div>
          )}
        </div>
      </ScreenLayout>
    </PageWrapper>
  )
}