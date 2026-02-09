import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PageWrapper from "../components/PageWrapper"

export default function LanguageSelect() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  return (
    <PageWrapper>
      <h2 className="text-3xl font-semibold text-center mb-3">
        {t("welcome")}
      </h2>

      <p className="text-center text-gray-500 mb-10">
        Please select your preferred language
      </p>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <button
          onClick={() => i18n.changeLanguage("en")}
          className="border rounded-lg py-6 text-xl hover:border-blue-800 hover:bg-blue-50"
        >
          English
        </button>

        <button
          onClick={() => i18n.changeLanguage("hi")}
          className="border rounded-lg py-6 text-xl hover:border-blue-800 hover:bg-blue-50"
        >
          हिन्दी
        </button>
      </div>

      <button
        onClick={() => navigate("/login")}
        className="w-full bg-blue-800 text-white py-4 rounded-lg text-xl hover:bg-blue-900"
      >
        {t("continue")}
      </button>
    </PageWrapper>
  )
}