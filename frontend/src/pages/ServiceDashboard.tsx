import { useLocation, useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"

export default function ServiceDashboard() {
  const navigate = useNavigate()
  const { state } = useLocation()

  if (!state) {
    return (
      <PageWrapper>
        <p>No service selected.</p>
      </PageWrapper>
    )
  }

  const { department, service } = state

  return (
    <PageWrapper>
      <h2 className="text-2xl font-semibold mb-2">
        {service}
      </h2>

      <p className="text-gray-500 mb-8">
        {department}
      </p>

      <div className="grid gap-6">
        <button
          onClick={() => navigate("/pay-bill")}
          className="border rounded-lg p-6 text-left hover:bg-slate-50"
        >
          <p className="font-medium">Proceed with Service</p>
          <p className="text-sm text-gray-500">
            Continue to complete this service
          </p>
        </button>

        <button
          onClick={() => navigate("/complaint")}
          className="border rounded-lg p-6 text-left hover:bg-slate-50"
        >
          <p className="font-medium">Raise a Complaint</p>
          <p className="text-sm text-gray-500">
            Report an issue related to this service
          </p>
        </button>
      </div>
    </PageWrapper>
  )
}