import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../components/KioskLayout"
import { API_BASE } from "../api/config"

type Analytics = {
  totalTransactions: number
  totalRevenue: number
  departmentStats: {
    electricity: { count: number; revenue: number }
    water: { count: number; revenue: number }
    gas: { count: number; revenue: number }
    municipal: { count: number; revenue: number }
    transport: { count: number; revenue: number }
    pds: { count: number; revenue: number }
  }
  monthlyTrend: {
    month: string
    transactions: number
    revenue: number
  }[]
}

export default function AnalyticsDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock analytics data
    const mockAnalytics: Analytics = {
      totalTransactions: 1247,
      totalRevenue: 2847560,
      departmentStats: {
        electricity: { count: 456, revenue: 1234560 },
        water: { count: 234, revenue: 567890 },
        gas: { count: 189, revenue: 456780 },
        municipal: { count: 167, revenue: 345670 },
        transport: { count: 123, revenue: 234560 },
        pds: { count: 78, revenue: 67100 }
      },
      monthlyTrend: [
        { month: "Jan", transactions: 198, revenue: 456780 },
        { month: "Feb", transactions: 234, revenue: 567890 },
        { month: "Mar", transactions: 267, revenue: 678900 },
        { month: "Apr", transactions: 289, revenue: 789012 },
        { month: "May", transactions: 259, revenue: 678980 }
      ]
    }

    setTimeout(() => {
      setAnalytics(mockAnalytics)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <KioskLayout title="📊 Analytics Dashboard" showHeader={true} showNav={true}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </KioskLayout>
    )
  }

  if (!analytics) return null

  return (
    <KioskLayout
      title="📊 Analytics Dashboard"
      subtitle="Kiosk Usage Statistics"
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/dashboard")}
      onHome={() => navigate("/")}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Total Transactions</h3>
            <p className="text-3xl font-bold">{analytics.totalTransactions.toLocaleString()}</p>
            <p className="text-blue-100 mt-2">All time</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold">₹{analytics.totalRevenue.toLocaleString()}</p>
            <p className="text-green-100 mt-2">All time</p>
          </div>
        </div>

        {/* Department Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Department-wise Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(analytics.departmentStats).map(([dept, stats]) => (
              <div key={dept} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 capitalize">{dept}</h4>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    Transactions: <span className="font-medium">{stats.count}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Revenue: <span className="font-medium">₹{stats.revenue.toLocaleString()}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Monthly Trend</h3>
          <div className="space-y-3">
            {analytics.monthlyTrend.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{trend.month}</p>
                  <p className="text-sm text-gray-600">{trend.transactions} transactions</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{trend.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              const dataStr = JSON.stringify(analytics, null, 2)
              const dataBlob = new Blob([dataStr], { type: "application/json" })
              const url = URL.createObjectURL(dataBlob)
              const link = document.createElement("a")
              link.href = url
              link.download = "analytics-report.json"
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              URL.revokeObjectURL(url)
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            📊 Export Analytics Report
          </button>
        </div>
      </div>
    </KioskLayout>
  )
}
