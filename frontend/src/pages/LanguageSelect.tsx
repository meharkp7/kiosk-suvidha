import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"

import React from "react";

export default function LanguageSelect() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  return (
    <PageWrapper>
      <ScreenLayout
        title="Welcome to SUVIDHA Kiosk"
        subtitle="Select your preferred language"
      >
        <h2 className="text-2xl font-semibold mb-2">
          {t("welcome")}
        </h2>

        <p className="text-gray-500 mb-8">
          Select your preferred language
        </p>

        <div className="grid grid-cols-2 gap-6 mb-10">
          <button
            onClick={() => i18n.changeLanguage("en")}
            className="border rounded-lg py-6 text-lg"
          >
            English
          </button>

          <button
            onClick={() => i18n.changeLanguage("hi")}
            className="border rounded-lg py-6 text-lg"
          >
            हिन्दी
          </button>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="w-full bg-blue-800 text-white py-4 rounded-lg text-lg"
        >
          Continue
        </button>
      </ScreenLayout>
    </PageWrapper>
  )
}