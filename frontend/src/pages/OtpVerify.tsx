import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { verifyOtp, getMe } from "../api/auth"
import { fetchAccounts } from "../api/accounts"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"
import { useSession } from "../context/SessionContext"

export default function OtpVerify() {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { resetSession } = useSession()

  const phone = sessionStorage.getItem("phone") || ""

  const handleVerify = async () => {
    try {
      setLoading(true)

      await verifyOtp(phone, otp)

      const user = await getMe()
      if (!user) throw new Error("Session not created")

      const accounts = await fetchAccounts()
      sessionStorage.setItem("accounts", JSON.stringify(accounts))

      // 🔥 START GLOBAL SESSION TIMER
      resetSession()

      navigate("/dashboard")
    } catch (e) {
      alert("Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <ScreenLayout
        title="OTP Verification"
        subtitle="Enter the 6-digit OTP sent to your mobile number"
      >
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full border rounded-xl p-6 text-center text-xl mb-8"
        />

        <button
          onClick={handleVerify}
          disabled={loading || otp.length !== 6}
          className="w-full min-h-[72px] bg-blue-800 text-white text-xl rounded-2xl disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </ScreenLayout>
    </PageWrapper>
  )
}