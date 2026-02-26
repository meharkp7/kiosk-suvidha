import { useTranslation } from "react-i18next"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"

export default function PaymentSuccess() {
  const { t } = useTranslation()
  return (
    <PageWrapper>
      <ScreenLayout
        title={t("paymentSuccessful")}
        subtitle={t("transactionCompleted")}
      >
        <h2 className="text-2xl font-semibold text-green-700 mb-4">
          {t("paymentSuccessful")}
        </h2>

        <p className="text-gray-600 mb-8">
          {t("receiptGenerated")}
        </p>

        <div className="border rounded-lg p-6">
          <p className="mb-1">{t("transactionId")}</p>
          <p className="font-mono">TXN-982374982</p>
        </div>
      </ScreenLayout>
    </PageWrapper>
  )
}