import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"
import { fetchLatestComplaint } from "../api/electricity"

export default function ElectricityComplaintStatus() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const accountNumber = state?.accountNumber

  const [complaint, setComplaint] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accountNumber) {
      navigate("/services-dashboard")
      return
    }

    fetchLatestComplaint(accountNumber)
      .then(setComplaint)
      .catch(() => setComplaint(null))
      .finally(() => setLoading(false))
  }, [accountNumber, navigate])

  if (loading) {
    return (
      <PageWrapper>
        <ScreenLayout title="Complaint Status">
          <p className="text-center text-gray-500 text-lg">
            Checking status...
          </p>
        </ScreenLayout>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <ScreenLayout
        title="Complaint Status"
        subtitle="Latest registered complaint"
      >
        <div className="space-y-6">

          {!complaint ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <p className="text-yellow-700 text-lg font-semibold">
                No complaint found
              </p>
            </div>
          ) : (
            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">

              <div className="flex justify-between">
                <span className="text-gray-600">Issue</span>
                <span className="font-semibold">
                  {complaint.category}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Registered On</span>
                <span className="font-semibold">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Status</span>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${
                    complaint.status === "RESOLVED"
                      ? "bg-green-100 text-green-700"
                      : complaint.status === "IN_PROGRESS"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {complaint.status.replace("_", " ")}
                </span>
              </div>

            </div>
          )}

        </div>
      </ScreenLayout>
    </PageWrapper>
  )
}