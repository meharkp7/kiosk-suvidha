import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"

export default function BookCylinder() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { accountNumber } = location.state || {}

  const [cylinderType, setCylinderType] = useState("14.2KG")
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [bookingId, setBookingId] = useState("")

  const prices: Record<string, number> = {
    "14.2KG": 1100,
    "5KG": 400,
    "19KG": 1500,
  }

  const totalAmount = prices[cylinderType] * quantity

  const handleSubmit = async () => {
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const mockBookingId = `BK${Date.now()}`
      setBookingId(mockBookingId)
      setSubmitted(true)
      setLoading(false)
    }, 2000)
  }

  if (!accountNumber) {
    return (
      <KioskLayout
        title={t("bookCylinder")}
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold">{t("noAccountSelected")}</h2>
          <button
            onClick={() => navigate("/services-dashboard")}
            className="mt-4 bg-orange-600 text-white px-6 py-3 rounded-lg"
          >
            {t("goToDashboard")}
          </button>
        </div>
      </KioskLayout>
    )
  }

  if (submitted) {
    return (
      <KioskLayout
        title="✅ Booking Confirmed"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-2xl p-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl text-white">✓</span>
            </div>
            <h2 className="text-3xl font-bold text-green-800 mb-2">Cylinder Booked!</h2>
            <p className="text-green-600 mb-6">Your booking has been confirmed</p>

            <div className="bg-white rounded-xl p-6 mb-6">
              <p className="text-slate-500 mb-2">Booking ID</p>
              <p className="text-3xl font-bold text-slate-800">{bookingId}</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 mb-6">
              <p className="text-orange-800">
                <span className="font-semibold">📞 Note:</span> You will receive SMS updates on delivery status
              </p>
            </div>

            <button
              onClick={() => navigate("/gas/booking-status", { state: { accountNumber } })}
              className="bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold mr-4"
            >
              View Status
            </button>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-slate-200 text-slate-700 px-8 py-4 rounded-xl font-semibold"
            >
              Home
            </button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout
      title="Book LPG Cylinder"
      subtitle={`Account: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
    >
      <div className="max-w-4xl mx-auto">
        {/* Cylinder Type */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Select Cylinder Type</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(prices).map(([type, price]) => (
              <button
                key={type}
                onClick={() => setCylinderType(type)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  cylinderType === type
                    ? "border-orange-500 bg-orange-50"
                    : "border-slate-200 hover:border-orange-300"
                }`}
              >
                <span className="text-3xl mb-2 block">🫙</span>
                <p className="font-bold text-slate-800">{type}</p>
                <p className="text-sm text-slate-500">₹{price}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Quantity</h3>
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-16 h-16 bg-slate-100 rounded-xl text-2xl font-bold hover:bg-slate-200"
            >
              -
            </button>
            <span className="text-4xl font-bold text-slate-800 w-20 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(5, quantity + 1))}
              className="w-16 h-16 bg-slate-100 rounded-xl text-2xl font-bold hover:bg-slate-200"
            >
              +
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 mb-6 text-white text-center">
          <p className="text-orange-100">Total Amount</p>
          <h2 className="text-4xl font-bold">₹{totalAmount}</h2>
          <p className="text-orange-100 text-sm mt-2">Subsidy will be credited to your bank account</p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-orange-600 text-white py-5 rounded-xl text-xl font-bold hover:bg-orange-700 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="animate-spin">⏳</span>
              Booking...
            </span>
          ) : (
            "✓ Confirm Booking"
          )}
        </button>
      </div>
    </KioskLayout>
  )
}
