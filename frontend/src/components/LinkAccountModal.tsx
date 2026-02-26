import { useState } from "react"
import { API_BASE } from "../api/config"

interface LinkAccountModalProps {
  department: string
  departmentName: string
  icon: string
  onClose: () => void
  onSuccess: (accountNumber: string) => void
}

export default function LinkAccountModal({
  department,
  departmentName,
  icon,
  onClose,
  onSuccess,
}: LinkAccountModalProps) {
  const [step, setStep] = useState<"account" | "verify" | "success">("account")
  const [accountNumber, setAccountNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmitAccount = async () => {
    if (!accountNumber.trim()) {
      setError("Please enter account number")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Request OTP for account linking
      const res = await fetch(`${API_BASE}/accounts/link-request`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department,
          accountNumber: accountNumber.trim(),
        }),
      })

      if (res.ok) {
        setStep("verify")
      } else {
        const data = await res.json()
        setError(data.message || "Failed to send OTP. Please check your account number.")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter 6-digit OTP")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Verify OTP and link account
      const res = await fetch(`${API_BASE}/accounts/link-verify`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department,
          accountNumber: accountNumber.trim(),
          otp,
        }),
      })

      if (res.ok) {
        setStep("success")
        setTimeout(() => {
          onSuccess(accountNumber.trim())
        }, 1500)
      } else {
        const data = await res.json()
        setError(data.message || "Invalid OTP. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const appendDigit = (digit: string) => {
    if (step === "account") {
      if (accountNumber.length < 20) {
        setAccountNumber(accountNumber + digit)
      }
    } else {
      if (otp.length < 6) {
        setOtp(otp + digit)
      }
    }
  }

  const clearLast = () => {
    if (step === "account") {
      setAccountNumber(accountNumber.slice(0, -1))
    } else {
      setOtp(otp.slice(0, -1))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 text-white text-center">
          <span className="text-4xl mb-2 block">{icon}</span>
          <h2 className="text-2xl font-bold">Link {departmentName}</h2>
          <p className="text-blue-200 text-sm mt-1">
            Verify your account to access services
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}

          {step === "account" && (
            <>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enter Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.toUpperCase())}
                placeholder="e.g., ELEC123456"
                className="w-full text-2xl font-bold text-center border-2 border-slate-300 rounded-xl p-4 mb-4 focus:border-blue-600 outline-none"
              />

              {/* Alphanumeric Keypad */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map(
                  (key) => (
                    <button
                      key={key}
                      onClick={() => appendDigit(key)}
                      className="h-12 bg-slate-100 rounded-lg text-lg font-bold hover:bg-slate-200 active:scale-95 transition-all"
                    >
                      {key}
                    </button>
                  )
                )}
                <button
                  onClick={clearLast}
                  className="h-12 bg-red-100 text-red-600 rounded-lg text-lg font-bold hover:bg-red-200 active:scale-95 transition-all"
                >
                  ⌫
                </button>
              </div>

              <button
                onClick={handleSubmitAccount}
                disabled={loading || accountNumber.length < 5}
                className="w-full bg-blue-800 text-white py-4 rounded-xl text-lg font-semibold disabled:opacity-50 hover:bg-blue-700 active:scale-[0.98] transition-all"
              >
                {loading ? "Sending OTP..." : "Send OTP 📱"}
              </button>
            </>
          )}

          {step === "verify" && (
            <>
              <p className="text-center text-slate-600 mb-4">
                Enter 6-digit OTP sent to your registered mobile
              </p>

              {/* OTP Boxes */}
              <div className="flex justify-center gap-2 mb-4">
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
                className="w-full text-center text-3xl font-bold tracking-widest bg-transparent border-b-2 border-slate-300 focus:border-blue-600 outline-none py-2 mb-4"
                placeholder="______"
                maxLength={6}
              />

              {/* Numeric Keypad */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"].map(
                  (key) => (
                    <button
                      key={key}
                      onClick={() => {
                        if (key === "⌫") clearLast()
                        else if (key === "✓") handleVerifyOtp()
                        else appendDigit(key)
                      }}
                      disabled={key === "✓" && (loading || otp.length !== 6)}
                      className={`h-14 rounded-xl text-xl font-bold transition-all active:scale-95 ${
                        key === "✓"
                          ? otp.length === 6
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-slate-200 text-slate-400"
                          : key === "⌫"
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                      }`}
                    >
                      {key}
                    </button>
                  )
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep("account")}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-200"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="flex-1 bg-blue-800 text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-700"
                >
                  {loading ? "Verifying..." : "Verify ✓"}
                </button>
              </div>
            </>
          )}

          {step === "success" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✓</span>
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                Account Linked!
              </h3>
              <p className="text-slate-600">
                You can now access {departmentName} services
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== "success" && (
          <div className="bg-slate-50 p-4 text-center border-t">
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 font-medium"
            >
              Cancel & Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
