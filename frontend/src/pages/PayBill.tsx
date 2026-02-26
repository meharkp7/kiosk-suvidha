import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"

export default function PayBill() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <PageWrapper>
      <ScreenLayout
        title={t("billPayment")}
        subtitle={t("reviewBeforeProceeding")}
      >
        <h2 className="text-2xl font-semibold mb-6">
          {t("billDetails")}
        </h2>

        <div className="border rounded-lg p-6 mb-8">
          <p className="mb-2">{t("service")}: {t("electricity")}</p>
          <p className="mb-2">{t("billMonth")}: {t("january")}</p>
          <p className="text-lg font-semibold">
            {t("amount")}: ₹1,240
          </p>
        </div>

        <button
          onClick={() => navigate("/success")}
          className="w-full bg-blue-800 text-white py-4 rounded-lg text-lg"
        >
          {t("proceedToPayment")}
        </button>
      </ScreenLayout>
    </PageWrapper>
  )
}