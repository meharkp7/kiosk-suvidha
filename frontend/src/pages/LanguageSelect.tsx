import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import KioskLayout from "../components/KioskLayout"

const languages = [
  { code: "en", name: "English", native: "English", flag: "🇮🇳" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇮🇳" },
  { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
]

export default function LanguageSelect() {
  const navigate = useNavigate()
  const { i18n, t } = useTranslation()

  const handleLanguageSelect = (langCode: string) => {
    i18n.changeLanguage(langCode)
    navigate("/login")
  }

  return (
    <KioskLayout
      title="SUVIDHA Kiosk"
      subtitle={t("governmentServices")}
      showHeader={true}
      showNav={false}
      onHome={() => navigate("/")}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-3xl p-12 mb-8 text-white text-center shadow-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            सुविधा / SUVIDHA
          </h1>
          <p className="text-2xl md:text-3xl mb-4 font-medium">
            {t("oneNationOneKiosk")}
          </p>
          <div className="flex justify-center gap-6 text-lg">
            <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur">
              {t("accessible")}
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur">
              {t("digital")}
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur">
              {t("inclusive")}
            </span>
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4">
            {t("selectLanguage")}
          </h2>
          <p className="text-center text-slate-500 mb-8 text-lg">
            अपनी भाषा चुनें / Select language / భాష ఎంచుకోండి
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`group relative overflow-hidden rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-2xl hover:scale-105 border-3 ${
                  i18n.language === lang.code
                    ? "border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                    : "border-slate-200 hover:border-blue-400 bg-white"
                }`}
              >
                <span className="text-5xl mb-4 block filter drop-shadow-md">{lang.flag}</span>
                <p className="font-bold text-xl text-slate-800 mb-2 leading-tight">
                  {lang.native}
                </p>
                <p className="text-sm text-slate-600 font-medium">{lang.name}</p>
                
                {i18n.language === lang.code && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg shadow-lg animate-pulse">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t-2 border-slate-200">
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-blue-800 to-blue-600 text-white py-6 rounded-2xl text-2xl font-bold hover:from-blue-700 hover:to-blue-500 transition-all active:scale-[0.98] shadow-xl"
            >
              {t("continue")} / आगे बढ़ें →
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center border border-green-200 shadow-lg">
            <span className="text-5xl mb-4 block filter drop-shadow">🔒</span>
            <h3 className="font-bold text-2xl text-green-900 mb-3">{t("secure")}</h3>
            <p className="text-green-700 font-medium">{t("aadhaarVerified")}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center border border-blue-200 shadow-lg">
            <span className="text-5xl mb-4 block filter drop-shadow">⚡</span>
            <h3 className="font-bold text-2xl text-blue-900 mb-3">{t("fast")}</h3>
            <p className="text-blue-700 font-medium">{t("quickService")}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center border border-purple-200 shadow-lg">
            <span className="text-5xl mb-4 block filter drop-shadow">♿</span>
            <h3 className="font-bold text-2xl text-purple-900 mb-3">{t("accessible")}</h3>
            <p className="text-purple-700 font-medium">{t("accessibleDesc")}</p>
          </div>
        </div>
      </div>
    </KioskLayout>
  )
}