import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { verifyOtp, getMe } from "../api/auth"
import { fetchAccounts } from "../api/accounts"
import KioskLayout from "../components/KioskLayout"
import { useSession } from "../context/SessionContext"

export default function OtpVerify() {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { resetSession } = useSession()
  const { t } = useTranslation()

  const phone = sessionStorage.getItem("phone") || ""

  const handleVerify = async () => {
    try {
      setLoading(true)

      await verifyOtp(phone, otp)
      const user = await getMe()

      if (!user) {
        throw new Error("Session not created")
      }

      const accounts = await fetchAccounts()
      sessionStorage.setItem("accounts", JSON.stringify(accounts))

      setTimeout(() => {
        resetSession()
      }, 500)

      navigate("/dashboard", { replace: true })
    } catch (e) {
      alert(t("invalidOtp") || "Invalid OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const appendDigit = (digit: string) => {
    if (otp.length < 6) {
      setOtp(otp + digit)
    }
  }

  const clearLast = () => {
    setOtp(otp.slice(0, -1))
  }

  const quickFill = (code: string) => {
    setOtp(code)
  }

  return (
    <KioskLayout
      title={t("verifyOtp")}
      subtitle={`${t("enterOtp")} +91 ${phone}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/login")}
      onHome={() => navigate("/")}
    >
      <div className="max-w-md mx-auto px-4">
        {/* Phone Display */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-6 text-center">
          <p className="text-slate-600 mb-2">{t("otpSentTo")}</p>
          <p className="text-2xl font-bold text-slate-800">+91 {phone}</p>
        </div>

        {/* OTP Display */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
          <label className="block text-lg font-semibold text-slate-700 mb-6">
            {t("enter6DigitOtp")}
          </label>
          
          {/* OTP Boxes */}
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold ${
                  otp[index]
                    ? "border-blue-600 bg-blue-50 text-slate-800"
                    : "border-slate-300 text-slate-300"
                }`}
              >
                {otp[index] || "•"}
              </div>
            ))}
          </div>

          <input
            type="tel"
            value={otp}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 6)
              setOtp(val)
            }}
            className="w-full text-center text-3xl font-bold tracking-widest bg-transparent border-b-2 border-slate-300 focus:border-blue-600 outline-none py-2"
            placeholder="______"
            maxLength={6}
          />

          <p className="text-sm text-slate-500 mt-3 font-medium">
            {otp.length}/6 {t("digitsEntered")}
          </p>

          {/* Quick test codes */}
          <div className="flex gap-2 mt-4 justify-center flex-wrap">
            <button
              onClick={() => quickFill("123456")}
              className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full text-slate-600"
            >
              Test: 123456
            </button>
            <button
              onClick={() => quickFill("000000")}
              className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full text-slate-600"
            >
              Test: 000000
            </button>
          </div>
        </div>

        {/* Numeric Keypad */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-3 gap-3">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"].map(
              (key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === "⌫") clearLast()
                    else if (key === "✓") handleVerify()
                    else appendDigit(key)
                  }}
                  disabled={key === "✓" && (loading || otp.length !== 6)}
                  className={`h-16 rounded-xl text-2xl font-bold transition-all active:scale-95 ${
                    key === "✓"
                      ? otp.length === 6
                        ? "bg-green-600 text-white hover:bg-green-700 shadow-lg"
                        : "bg-slate-200 text-slate-400"
                      : key === "⌫"
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  {loading && key === "✓" ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    key
                  )}
                </button>
              )
            )}
          </div>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading || otp.length !== 6}
          className="w-full bg-blue-800 text-white py-5 rounded-xl text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              {t("verifying")}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {t("verifyContinue")} →
            </span>
          )}
        </button>

        {/* Resend & Help */}
        <div className="mt-6 flex justify-between items-center">
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            {t("resendOtp")}
          </button>
          <button className="text-slate-500 hover:text-slate-700 text-sm">
            {t("needHelp")}
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-amber-50 rounded-xl p-4">
          <p className="text-sm text-amber-800 text-center">
            <span className="font-semibold">⏱️ {t("note") || "Note"}:</span> {t("otpExpires")}
          </p>
        </div>
      </div>
    </KioskLayout>
  )
}