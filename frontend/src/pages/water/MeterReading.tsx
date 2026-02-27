import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import { API_BASE } from "../../api/config"

export default function WaterMeterReading() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("water")
  const [meterReading, setMeterReading] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Redirect if no account number (user accessed URL directly)
  useEffect(() => {
    if (!accountNumber) {
      navigate("/services-dashboard")
    }
  }, [accountNumber, navigate])

  if (!accountNumber) {
    return null // Will redirect
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!meterReading || !photo) {
      alert(t("enterReadingAndPhoto") || "Please enter reading and upload photo")
      return
    }

    setLoading(true)

    try {
      // Call backend API to submit meter reading
      const res = await fetch(`${API_BASE}/water/meter-reading`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          accountNumber,
          reading: parseFloat(meterReading),
          photoUrl: null // Photo upload would need separate handling
        })
      })

      if (!res.ok) {
        throw new Error('Failed to submit meter reading')
      }

      const data = await res.json()
      console.log("Water meter reading submitted:", data)
      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting meter reading:", error)
      alert("Failed to submit meter reading. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <KioskLayout title="✅ Success" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">💧</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Meter Reading Submitted!</h2>
            <p className="text-green-700 mb-2">Reading: {meterReading} KL</p>
            <p className="text-green-600">Your water meter reading has been recorded successfully.</p>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
            >
              Back to Services
            </button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout
      title="💧 Submit Water Meter Reading"
      subtitle={`Account: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
      onHome={() => navigate("/")}
    >
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">How to submit water meter reading:</h3>
            <ol className="list-decimal list-inside text-blue-800 space-y-1">
              <li>Locate your water meter (usually near water connection)</li>
              <li>Note down the current reading in kiloliters (KL)</li>
              <li>Take a clear photo of the meter display</li>
              <li>Submit both reading and photo below</li>
            </ol>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Current Meter Reading (KL) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={meterReading}
              onChange={(e) => setMeterReading(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter meter reading"
              required
            />
            <p className="text-sm text-gray-500 mt-2">Example: 1234.56 KL</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Meter Photo <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {photo ? (
                <div>
                  <p className="text-green-600 font-medium">✅ {photo.name}</p>
                  <button
                    type="button"
                    onClick={() => setPhoto(null)}
                    className="mt-2 text-red-600 hover:text-red-700"
                  >
                    Remove photo
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-gray-600">Click to upload meter photo</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
                  >
                    Choose Photo
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Previous Reading</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Last Reading</p>
                <p className="font-medium">1,234.56 KL</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Reading Date</p>
                <p className="font-medium">Feb 15, 2024</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Submitting...
              </span>
            ) : (
              "Submit Meter Reading"
            )}
          </button>
        </form>
      </div>
    </KioskLayout>
  )
}
