import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"

export default function ServiceDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state } = useLocation()

  if (!state) {
    return (
      <PageWrapper>
        <p>{t("noServiceSelected")}</p>
      </PageWrapper>
    )
  }

  const { department, service } = state

  return (
    <PageWrapper>
      <h2 className="text-2xl font-semibold mb-2">
        {service}
      </h2>

      <p className="text-gray-500 mb-8">
        {department}
      </p>

      <div className="grid gap-6">
        <button
          onClick={() => navigate("/pay-bill")}
          className="border rounded-lg p-6 text-left hover:bg-slate-50"
        >
          <p className="font-medium">{t("proceedWithService")}</p>
          <p className="text-sm text-gray-500">
            {t("continueToCompleteService")}
          </p>
        </button>

        <button
          onClick={() => navigate("/complaint")}
          className="border rounded-lg p-6 text-left hover:bg-slate-50"
        >
          <p className="font-medium">{t("raiseAComplaint")}</p>
          <p className="text-sm text-gray-500">
            {t("reportIssueRelatedToService")}
          </p>
        </button>
      </div>
    </PageWrapper>
  )
}