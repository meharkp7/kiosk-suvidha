import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../components/KioskLayout"

type Feedback = {
  rating: number
  category: string
  message: string
  phone?: string
  email?: string
}

export default function FeedbackSystem() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState<Feedback>({
    rating: 0,
    category: "",
    message: "",
    phone: "",
    email: ""
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const categories = [
    { id: "service", label: "Service Quality" },
    { id: "ui", label: "User Interface" },
    { id: "payment", label: "Payment Process" },
    { id: "technical", label: "Technical Issue" },
    { id: "suggestion", label: "Suggestion" },
    { id: "complaint", label: "Complaint" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (feedback.rating === 0 || !feedback.category || !feedback.message.trim()) {
      alert(t("fillRequiredFields"))
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Feedback submitted:", feedback)
      setSubmitted(true)
      setLoading(false)
    }, 1500)
  }

  if (submitted) {
    return (
      <KioskLayout title="✅ Thank You" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">🙏</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Feedback Submitted!</h2>
            <p className="text-green-700 mb-6">
              Thank you for your feedback. We appreciate your input and will use it to improve our services.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout
      title="💬 Feedback System"
      subtitle="Help us improve your experience"
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/dashboard")}
      onHome={() => navigate("/")}
    >
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedback({ ...feedback, rating: star })}
                  className={`text-4xl transition-colors ${
                    star <= feedback.rating ? "text-yellow-400" : "text-gray-300"
                  } hover:text-yellow-400`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Feedback Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFeedback({ ...feedback, category: cat.id })}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    feedback.category === cat.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              value={feedback.message}
              onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please share your detailed feedback..."
              required
            />
          </div>

          {/* Contact Info (Optional) */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Contact Information (Optional)
            </label>
            <div className="space-y-3">
              <input
                type="tel"
                value={feedback.phone}
                onChange={(e) => setFeedback({ ...feedback, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Phone Number"
              />
              <input
                type="email"
                value={feedback.email}
                onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email Address"
              />
            </div>
          </div>

          {/* Submit Button */}
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
              "Submit Feedback"
            )}
          </button>
        </form>
      </div>
    </KioskLayout>
  )
}
