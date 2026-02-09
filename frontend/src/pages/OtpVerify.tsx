import { useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"
import React from "react";

export default function OtpVerify() {
  const navigate = useNavigate()

  return (
    <PageWrapper>
      <ScreenLayout
        title="OTP Verification"
        subtitle="Enter the OTP sent to your phone"
      >
        <h2 className="text-2xl font-semibold mb-2">
          OTP Verification
        </h2>

        <p className="text-gray-500 mb-8">
          Enter the OTP sent to your mobile number
        </p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          className="w-full border rounded-lg p-4 text-lg text-center mb-8"
        />

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-blue-800 text-white py-4 rounded-lg text-lg"
        >
          Verify OTP
        </button>
      </ScreenLayout>
    </PageWrapper>
  )
}