import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"
import { QRCodeSVG } from "qrcode.react"
import KioskLayout from "../components/KioskLayout"
import { useEffect, useRef } from "react"

interface ReceiptData {
  amount: number
  reference: string
  department: string
  accountNumber: string
  consumerName?: string
  billMonth?: string
  paymentDate: string
  paymentMethod?: string
  transactionId?: string
}

export default function PaymentReceipt() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state } = useLocation()
  const printRef = useRef<HTMLDivElement>(null)

  const data = state as ReceiptData | null

  if (!data || !data.amount || !data.reference) {
    navigate("/services-dashboard")
    return null
  }

  const {
    amount,
    reference,
    department = "electricity",
    accountNumber,
    consumerName = "",
    billMonth = "",
    paymentDate = new Date().toLocaleString("en-IN"),
    paymentMethod = "Online",
    transactionId = reference
  } = data

  // Create QR code data for e-bill
  const qrData = JSON.stringify({
    reference,
    amount,
    department,
    accountNumber,
    date: paymentDate,
    transactionId
  })

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Please allow popups to print receipt")
      return
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Payment Receipt - SUVIDHA</title>
          <style>
            @media print {
              body { font-family: 'Courier New', monospace; font-size: 12px; }
              .thermal { width: 80mm; padding: 10px; }
              .center { text-align: center; }
              .bold { font-weight: bold; }
              .border-top { border-top: 1px dashed #000; margin: 10px 0; }
              .qr { text-align: center; margin: 10px 0; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const departmentIcons: Record<string, string> = {
    electricity: "⚡",
    water: "💧",
    gas: "🔥",
    municipal: "🏛️",
    transport: "🚗",
    pds: "🍚"
  }

  const departmentNames: Record<string, string> = {
    electricity: t("electricityDept") || "Electricity Department",
    water: t("waterDept") || "Water Department",
    gas: t("gasDept") || "Gas Department",
    municipal: t("municipalDept") || "Municipal Corporation",
    transport: t("transportDept") || "Transport Department",
    pds: t("pdsDept") || "Public Distribution System"
  }

  return (
    <KioskLayout
      title={t("paymentReceipt") || "Payment Receipt"}
      subtitle={t("transactionSuccessful") || "Transaction Successful"}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
    >
      <div className="max-w-2xl mx-auto">
        {/* Hidden print template */}
        <div ref={printRef} className="hidden">
          <div className="thermal">
            <div className="center bold" style={{ fontSize: "16px" }}>
              SUVIDHA KIOSK
            </div>
            <div className="center">{departmentNames[department]}</div>
            <div className="border-top"></div>
            <div className="center bold">PAYMENT RECEIPT</div>
            <div className="border-top"></div>
            <div>Date: {paymentDate}</div>
            <div>Ref: {reference}</div>
            <div>Account: {accountNumber}</div>
            {consumerName && <div>Consumer: {consumerName}</div>}
            {billMonth && <div>Bill Month: {billMonth}</div>}
            <div className="border-top"></div>
            <div className="center bold" style={{ fontSize: "14px" }}>
              Amount Paid: ₹{amount.toFixed(2)}
            </div>
            <div className="border-top"></div>
            <div>Payment Method: {paymentMethod}</div>
            <div>Txn ID: {transactionId}</div>
            <div className="border-top"></div>
            <div className="qr">
              <div>Scan for e-bill:</div>
              <QRCodeSVG value={qrData} size={100} />
            </div>
            <div className="border-top"></div>
            <div className="center">Thank you for using SUVIDHA!</div>
            <div className="center">www.suvidha.gov.in</div>
          </div>
        </div>

        {/* On-screen receipt */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {/* Success Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              {t("paymentSuccessful") || "Payment Successful!"}
            </h2>
            <p className="text-gray-500">
              {t("transactionCompleted") || "Your transaction has been completed successfully"}
            </p>
          </div>

          {/* Department Info */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
            <span className="text-3xl">{departmentIcons[department]}</span>
            <div>
              <p className="font-semibold text-gray-800">{departmentNames[department]}</p>
              <p className="text-sm text-gray-500">{accountNumber}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">{t("amountPaid") || "Amount Paid"}</span>
              <span className="font-bold text-xl text-green-600">₹{amount.toFixed(2)}</span>
            </div>
            {consumerName && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">{t("consumerName") || "Consumer Name"}</span>
                <span className="font-medium">{consumerName}</span>
              </div>
            )}
            {billMonth && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">{t("billMonth") || "Bill Month"}</span>
                <span className="font-medium">{billMonth}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">{t("referenceId") || "Reference ID"}</span>
              <span className="font-mono text-sm">{reference}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">{t("paymentDate") || "Payment Date"}</span>
              <span className="font-medium">{paymentDate}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">{t("paymentMethod") || "Payment Method"}</span>
              <span className="font-medium">{paymentMethod}</span>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-gray-50 rounded-xl p-6 text-center mb-6">
            <p className="text-gray-600 mb-4">{t("scanForEBill") || "Scan QR code for e-bill"}</p>
            <div className="inline-block bg-white p-4 rounded-xl shadow-sm">
              <QRCodeSVG value={qrData} size={180} level="H" />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {t("saveReceipt") || "Save this receipt for your records"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 h-14 bg-blue-800 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
            >
              <span>🖨️</span>
              {t("printReceipt") || "Print Receipt"}
            </button>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="flex items-center justify-center gap-2 h-14 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-500 transition-all"
            >
              <span>🏠</span>
              {t("backToServices") || "Back to Services"}
            </button>
          </div>

          {/* Download Options */}
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500 mb-2">
              {t("receiptAlsoSent") || "Receipt also sent to registered mobile"}
            </p>
          </div>
        </div>
      </div>
    </KioskLayout>
  )
}
