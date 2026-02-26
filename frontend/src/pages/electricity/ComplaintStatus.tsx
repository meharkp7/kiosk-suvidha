import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { API_BASE } from "../../api/config"
import { useAccountNumber } from "../../hooks/useAccountNumber"

interface Complaint {
  id: string
  complaintId: string
  complaintType: string
  status: string
  priority: string
  createdAt: string
  estimatedResolution?: string
}

export default function ComplaintStatus() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("electricity")

  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accountNumber) {
      setLoading(false)
      return
    }
    
    async function loadComplaints() {
      try {
        const res = await fetch(`${API_BASE}/electricity/complaints/${accountNumber}`, {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setComplaints(data)
        }
      } catch (err) {
        console.error("Failed to load complaints")
      } finally {
        setLoading(false)
      }
    }

    loadComplaints()
  }, [accountNumber])

  // Show error when no account
  if (!accountNumber) {
    return (
      <KioskLayout
        title={`⚡ ${t("complaintStatus")}`}
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-amber-50 rounded-2xl p-8">
            <span className="text-6xl mb-4 block">⚡</span>
            <h2 className="text-2xl font-bold text-amber-800 mb-2">{t("noAccountSelected")}</h2>
            <p className="text-amber-600 mb-6">{t("selectElectricityAccount")}</p>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold"
            >
              {t("goToServicesDashboard")} →
            </button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-100 text-green-700"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700"
      case "REGISTERED":
        return "bg-amber-100 text-amber-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <KioskLayout
      title="⚡ Complaint Status"
      subtitle={`Account: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
    >
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600"></div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-amber-50 rounded-2xl p-8 text-center">
            <span className="text-6xl mb-4 block">📭</span>
            <h2 className="text-2xl font-bold text-amber-800">No Complaints</h2>
            <p className="text-amber-600">You haven't raised any complaints yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((c) => (
              <div key={c.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-500">Complaint ID</p>
                    <p className="text-xl font-bold text-slate-800">{c.complaintId}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(c.status)}`}>
                    {c.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Type</p>
                    <p className="font-semibold text-slate-800">{c.complaintType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Priority</p>
                    <p className="font-semibold text-slate-800">{c.priority}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Raised On</p>
                    <p className="font-semibold text-slate-800">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {c.estimatedResolution && (
                    <div>
                      <p className="text-sm text-slate-500">Est. Resolution</p>
                      <p className="font-semibold text-slate-800">
                        {new Date(c.estimatedResolution).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </KioskLayout>
  )
}
