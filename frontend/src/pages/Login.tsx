import { useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"
import React from "react";

export default function Login() {
  const navigate = useNavigate()

  return (
    <PageWrapper>
      <ScreenLayout
        title="Mobile Number Login"
        subtitle="Enter your registered mobile number"
      >
        <h2 className="text-2xl font-semibold mb-2">
          Mobile Number Login
        </h2>

        <p className="text-gray-500 mb-8">
          Enter your registered mobile number
        </p>

        <input
          type="tel"
          placeholder="Enter mobile number"
          className="w-full border rounded-lg p-4 text-lg mb-8"
        />

        <button
          onClick={() => navigate("/otp")}
          className="w-full bg-blue-800 text-white py-4 rounded-lg text-lg"
        >
          Send OTP
        </button>
      </ScreenLayout>
    </PageWrapper>
  )
}