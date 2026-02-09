import i18n from "i18next"
import { initReactI18next } from "react-i18next"

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcome: "Welcome",
        continue: "Continue",
      },
    },
    hi: {
      translation: {
        welcome: "स्वागत है",
        continue: "जारी रखें",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n