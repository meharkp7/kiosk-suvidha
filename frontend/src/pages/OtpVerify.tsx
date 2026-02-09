import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { verifyOtp } from "../api/auth"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"

export default function OtpVerify() {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const phone = sessionStorage.getItem("phone") || ""

  const handleVerify = async () => {
    try {
      setLoading(true)
      const res = await verifyOtp(phone, otp)
      console.log("JWT:", res.token)
      sessionStorage.setItem("token", res.token)
      navigate("/dashboard")
    } catch (e) {
      alert("Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <ScreenLayout title="OTP Verification" subtitle="Enter the 6-digit OTP">
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full border rounded-lg p-4 text-center mb-6"
        />

        <button
          onClick={handleVerify}
          disabled={loading || otp.length !== 6}
          className="w-full bg-blue-800 text-white py-4 rounded-lg disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </ScreenLayout>
    </PageWrapper>
  )
}