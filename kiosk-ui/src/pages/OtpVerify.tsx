import { useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"

export default function OtpVerify() {
  const navigate = useNavigate()

  return (
    <PageWrapper>
      <h2 className="text-2xl font-semibold text-center mb-4">
        OTP Verification
      </h2>

      <p className="text-center text-gray-500 mb-8">
        Enter the OTP sent to your mobile number
      </p>

      <input
        type="text"
        placeholder="Enter 6-digit OTP"
        className="w-full border rounded-lg py-4 px-4 text-lg mb-8 text-center"
      />

      <button
        onClick={() => navigate("/dashboard")}
        className="w-full bg-blue-800 text-white py-4 rounded-lg text-lg"
      >
        Verify OTP
      </button>
    </PageWrapper>
  )
}