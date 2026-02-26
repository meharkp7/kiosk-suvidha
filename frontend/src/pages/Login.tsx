import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { sendOtp } from "../api/auth"
import KioskLayout from "../components/KioskLayout"

export default function Login() {
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleSendOtp = async () => {
    try {
      setLoading(true)

      if (!phone || phone.length !== 10) {
        alert(t("invalidPhone") || "Please enter a valid 10-digit phone number")
        return
      }

      await sendOtp(phone)
      sessionStorage.setItem("phone", phone)
      navigate("/otp")
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error"
      alert(`Failed to send OTP: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const appendDigit = (digit: string) => {
    if (phone.length < 10) {
      setPhone(phone + digit)
    }
  }

  const clearLast = () => {
    setPhone(phone.slice(0, -1))
  }

  const quickFill = (number: string) => {
    setPhone(number)
  }

  return (
    <KioskLayout
      title={t("mobileLogin")}
      subtitle={t("enterMobile")}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/")}
      onHome={() => navigate("/")}
    >
      <div className="max-w-md mx-auto px-4">
        {/* Phone Display */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
          <label className="block text-lg font-semibold text-slate-700 mb-6">
            {t("mobileNumber")}
          </label>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl font-bold text-slate-400">+91</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10)
                setPhone(val)
              }}
              placeholder="Enter number"
              className="text-4xl font-bold text-slate-800 bg-transparent border-b-2 border-slate-300 focus:border-blue-600 outline-none py-2 text-center w-48"
              readOnly
            />
          </div>
          
          <p className="text-sm text-slate-500 font-medium">
            {phone.length}/10 {t("digitsEntered")}
          </p>

          {/* Quick test numbers */}
          <div className="flex gap-2 mt-4 justify-center flex-wrap">
            <button
              onClick={() => quickFill("9876543210")}
              className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full text-slate-600"
            >
              Test: 9876543210
            </button>
            <button
              onClick={() => quickFill("9999999999")}
              className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full text-slate-600"
            >
              Test: 9999999999
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
                    else if (key === "✓") handleSendOtp()
                    else appendDigit(key)
                  }}
                  disabled={key === "✓" && (loading || phone.length !== 10)}
                  className={`h-16 rounded-xl text-2xl font-bold transition-all active:scale-95 ${
                    key === "✓"
                      ? phone.length === 10
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

        {/* Alternative: Send OTP Button */}
        <button
          onClick={handleSendOtp}
          disabled={loading || phone.length !== 10}
          className="w-full bg-blue-800 text-white py-5 rounded-xl text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              {t("sendingOtp")}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {t("sendOtp")} 📱
            </span>
          )}
        </button>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-800 text-center">
            <span className="font-semibold">💡 {t("tip")}:</span> {t("otpTip") || "You will receive a 6-digit OTP on your mobile number"}
          </p>
        </div>
      </div>
    </KioskLayout>
  )
}