import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"

export default function GasSubsidyInfo() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const consumerNumber = useAccountNumber("gas")
  const [subsidyData, setSubsidyData] = useState({
    currentSubsidy: 200,
    annualSubsidy: 2400,
    cylindersPerYear: 12,
    nextSubsidyDate: "2024-04-01",
    bankAccount: "****1234",
    aadhaarLinked: true,
    lastCredit: "2024-03-15",
    totalCredited: 2400
  })

  return (
    <KioskLayout
      title={`💰 ${t("subsidyInfo")}`}
      subtitle={`${t("consumer")}: ${consumerNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
      onHome={() => navigate("/")}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Current Subsidy Status */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-semibold mb-4">Current Subsidy Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-lg p-4">
              <p className="text-green-100 text-sm">Per Cylinder</p>
              <p className="text-2xl font-bold">₹{subsidyData.currentSubsidy}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <p className="text-green-100 text-sm">Annual Total</p>
              <p className="text-2xl font-bold">₹{subsidyData.annualSubsidy}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <p className="text-green-100 text-sm">Cylinders/Year</p>
              <p className="text-2xl font-bold">{subsidyData.cylindersPerYear}</p>
            </div>
          </div>
        </div>

        {/* Bank Account Details */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Bank Account Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Account Number:</span>
              <span className="font-medium">{subsidyData.bankAccount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Aadhaar Linking:</span>
              <span className={`font-medium ${subsidyData.aadhaarLinked ? "text-green-600" : "text-red-600"}`}>
                {subsidyData.aadhaarLinked ? "✅ Linked" : "❌ Not Linked"}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Last Credit Date:</span>
              <span className="font-medium">{subsidyData.lastCredit}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Credited:</span>
              <span className="font-medium text-green-600">₹{subsidyData.totalCredited}</span>
            </div>
          </div>
        </div>

        {/* Subsidy History */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Subsidy Credits</h3>
          <div className="space-y-3">
            {[
              { date: "2024-03-15", amount: 200, bookingId: "BK1709123456791", status: "Credited" },
              { date: "2024-02-13", amount: 200, bookingId: "BK1709123456790", status: "Credited" },
              { date: "2024-01-18", amount: 200, bookingId: "BK1709123456789", status: "Credited" },
              { date: "2023-12-20", amount: 200, bookingId: "BK1709123456788", status: "Credited" },
              { date: "2023-11-15", amount: 200, bookingId: "BK1709123456787", status: "Credited" }
            ].map((credit, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">{credit.date}</p>
                  <p className="text-sm text-gray-500">Booking: {credit.bookingId}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">₹{credit.amount}</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {credit.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PM Ujjwala Yojana Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">PM Ujjwala Yojana</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-medium text-blue-800">Eligibility Criteria</p>
                <p className="text-sm text-blue-700">BPL families, women-headed households, SC/ST communities</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <p className="font-medium text-blue-800">Benefits</p>
                <p className="text-sm text-blue-700">Free LPG connection, ₹1600 subsidy, 5 free refills</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📞</span>
              <div>
                <p className="font-medium text-blue-800">Helpline</p>
                <p className="text-sm text-blue-700">1906 (PMUY Toll-free)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => alert("Link Aadhaar feature coming soon!")}
            className="bg-blue-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            🔗 Link Aadhaar
          </button>
          <button
            onClick={() => alert("Update Bank Account feature coming soon!")}
            className="bg-green-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            🏦 Update Bank Account
          </button>
        </div>
      </div>
    </KioskLayout>
  )
}
