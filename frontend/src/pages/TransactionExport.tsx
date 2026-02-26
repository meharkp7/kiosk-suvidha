import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import KioskLayout from "../components/KioskLayout"
import { API_BASE } from "../api/config"

type Transaction = {
  id: string
  date: string
  department: string
  service: string
  amount: number
  status: string
  reference: string
}

export default function TransactionExport() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "pdf">("json")

  useEffect(() => {
    // Mock transaction data
    const mockTransactions: Transaction[] = [
      {
        id: "TXN001",
        date: "2024-03-15",
        department: "Electricity",
        service: "Bill Payment",
        amount: 990.50,
        status: "PAID",
        reference: "EL123456789"
      },
      {
        id: "TXN002",
        date: "2024-03-14",
        department: "Water",
        service: "Bill Payment",
        amount: 247.50,
        status: "PAID",
        reference: "WA987654321"
      },
      {
        id: "TXN003",
        date: "2024-03-13",
        department: "Gas",
        service: "Cylinder Booking",
        amount: 900.00,
        status: "PAID",
        reference: "GS123456789"
      },
      {
        id: "TXN004",
        date: "2024-03-12",
        department: "Municipal",
        service: "Property Tax",
        amount: 4500.00,
        status: "PAID",
        reference: "PROP123456"
      },
      {
        id: "TXN005",
        date: "2024-03-11",
        department: "Transport",
        service: "Challan Payment",
        amount: 1000.00,
        status: "PAID",
        reference: "KA01AB1234"
      }
    ]

    setTransactions(mockTransactions)
    setLoading(false)
  }, [])

  const exportToJSON = () => {
    const dataStr = JSON.stringify(transactions, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportToCSV = () => {
    const headers = ["ID", "Date", "Department", "Service", "Amount", "Status", "Reference"]
    const csvContent = [
      headers.join(","),
      ...transactions.map(t => [
        t.id,
        t.date,
        t.department,
        t.service,
        t.amount,
        t.status,
        t.reference
      ].join(","))
    ].join("\n")

    const dataBlob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportToPDF = () => {
    // Simple PDF generation using window.print
    const printContent = transactions.map(t => `
      <tr>
        <td>${t.id}</td>
        <td>${t.date}</td>
        <td>${t.department}</td>
        <td>${t.service}</td>
        <td>₹${t.amount.toFixed(2)}</td>
        <td>${t.status}</td>
        <td>${t.reference}</td>
      </tr>
    `).join("")

    const html = `
      <html>
        <head>
          <title>Transaction History</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <h1>Transaction History</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Department</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              ${printContent}
            </tbody>
          </table>
        </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleExport = () => {
    switch (exportFormat) {
      case "json":
        exportToJSON()
        break
      case "csv":
        exportToCSV()
        break
      case "pdf":
        exportToPDF()
        break
    }
  }

  if (loading) {
    return (
      <KioskLayout title="📊 Transaction Export" showHeader={true} showNav={true}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout
      title="📊 Transaction Export"
      subtitle="Download your transaction history"
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/dashboard")}
      onHome={() => navigate("/")}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Export Options */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Export Format</h3>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setExportFormat("json")}
              className={`p-4 rounded-lg border-2 transition-all ${
                exportFormat === "json"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl mb-2">📄</div>
              <div className="font-medium">JSON</div>
              <div className="text-sm text-gray-500">Structured data</div>
            </button>
            <button
              onClick={() => setExportFormat("csv")}
              className={`p-4 rounded-lg border-2 transition-all ${
                exportFormat === "csv"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium">CSV</div>
              <div className="text-sm text-gray-500">Excel compatible</div>
            </button>
            <button
              onClick={() => setExportFormat("pdf")}
              className={`p-4 rounded-lg border-2 transition-all ${
                exportFormat === "pdf"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl mb-2">📋</div>
              <div className="font-medium">PDF</div>
              <div className="text-sm text-gray-500">Printable format</div>
            </button>
          </div>
        </div>

        {/* Transaction Preview */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">
            Transaction History ({transactions.length} records)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.status === "PAID"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-center">
          <button
            onClick={handleExport}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            📥 Export as {exportFormat.toUpperCase()}
          </button>
        </div>
      </div>
    </KioskLayout>
  )
}
