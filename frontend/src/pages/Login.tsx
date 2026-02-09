import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { sendOtp } from "../api/auth" 
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"

export default function Login() {
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    try {
      setLoading(true)
      await sendOtp(phone)
      sessionStorage.setItem("phone", phone)
      navigate("/otp")
    } catch (e) {
      alert("Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <ScreenLayout title="Mobile Number Login" subtitle="Enter your mobile number">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter mobile number"
          className="w-full border rounded-lg p-4 mb-6"
        />

        <button
          onClick={handleSendOtp}
          disabled={loading || phone.length !== 10}
          className="w-full bg-blue-800 text-white py-4 rounded-lg disabled:opacity-50"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </ScreenLayout>
    </PageWrapper>
  )
}