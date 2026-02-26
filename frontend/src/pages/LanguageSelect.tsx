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
  const { i18n } = useTranslation()

  const handleLanguageSelect = (langCode: string) => {
    i18n.changeLanguage(langCode)
    navigate("/login")
  }

  return (
    <KioskLayout
      title="SUVIDHA Kiosk"
      subtitle="Government Services Portal"
      showHeader={true}
      showNav={false}
      onHome={() => navigate("/")}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-2xl p-8 mb-8 text-white text-center">
          <h1 className="text-4xl font-bold mb-4">सुविधा / SUVIDHA</h1>
          <p className="text-xl">One Nation One Kiosk - Government Services</p>
          <p className="text-blue-200 mt-2">Accessible • Digital • Inclusive</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
            Select Your Language
          </h2>
          <p className="text-center text-slate-500 mb-8">
            अपनी भाषा चुनें / Select language / భాష ఎంచుకోండి
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`group relative overflow-hidden rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 ${
                  i18n.language === lang.code
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <span className="text-4xl mb-3 block">{lang.flag}</span>
                <p className="font-bold text-lg text-slate-800">{lang.native}</p>
                <p className="text-sm text-slate-500">{lang.name}</p>
                
                {i18n.language === lang.code && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-800 text-white py-5 rounded-xl text-xl font-semibold hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg"
            >
              Continue / आगे बढ़ें →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <span className="text-4xl mb-2 block">🔒</span>
            <h3 className="font-semibold text-green-900">Secure</h3>
            <p className="text-sm text-green-700">Aadhaar verified login</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <span className="text-4xl mb-2 block">⚡</span>
            <h3 className="font-semibold text-blue-900">Fast</h3>
            <p className="text-sm text-blue-700">Quick service delivery</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-6 text-center">
            <span className="text-4xl mb-2 block">♿</span>
            <h3 className="font-semibold text-purple-900">Accessible</h3>
            <p className="text-sm text-purple-700">Designed for everyone</p>
          </div>
        </div>
      </div>
    </KioskLayout>
  )
}