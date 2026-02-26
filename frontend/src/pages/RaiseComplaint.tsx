import { useTranslation } from "react-i18next"
import PageWrapper from "../components/PageWrapper"

export default function RaiseComplaint() {
  const { t } = useTranslation()
  return (
    <PageWrapper>
      <h2 className="text-2xl font-semibold mb-6">
        {t("raiseAComplaint")}
      </h2>

      <textarea
        placeholder={t("describeYourIssue")}
        className="w-full border rounded-lg p-4 text-lg mb-8 h-32"
      />

      <button className="w-full bg-blue-800 text-white py-4 rounded-lg text-lg">
        {t("submitComplaint")}
      </button>
    </PageWrapper>
  )
}