import { useState, useEffect } from "react"
import { printReceipt, generateThermalReceipt, type ReceiptData } from "../utils/receipt"
import QRCode from "qrcode"

interface ReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  receiptData: ReceiptData | null
}

export default function ReceiptModal({ isOpen, onClose, receiptData }: ReceiptModalProps) {
  const [isPrinting, setIsPrinting] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>("")

  useEffect(() => {
    if (receiptData && isOpen) {
      // Generate QR code with receipt data encoded
      const receiptJson = JSON.stringify({
        id: receiptData.id,
        amount: receiptData.amount,
        department: receiptData.department,
        date: receiptData.date,
        reference: receiptData.reference
      })
      QRCode.toDataURL(receiptJson, { width: 200, margin: 2 })
        .then((url: string) => setQrDataUrl(url))
        .catch((err: Error) => console.error("QR generation failed:", err))
    }
  }, [receiptData, isOpen])

  if (!isOpen || !receiptData) return null

  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => {
      printReceipt(receiptData)
      setIsPrinting(false)
    }, 500)
  }

  const handleThermalPrint = async () => {
    try {
      // Check if Web Serial API is available (for USB thermal printers)
      if ('serial' in navigator) {
        const port = await (navigator as any).serial.requestPort()
        await port.open({ baudRate: 9600 })
        
        const thermalData = generateThermalReceipt(receiptData)
        const encoder = new TextEncoder()
        const writer = port.writable.getWriter()
        await writer.write(encoder.encode(thermalData))
        writer.releaseLock()
        await port.close()
        
        alert("Receipt printed successfully!")
      } else {
        // Fallback: show thermal commands for manual printing
        const thermalData = generateThermalReceipt(receiptData)
        console.log("Thermal print commands:", thermalData)
        alert("Web Serial API not available. Copy commands from console for manual printing.")
      }
    } catch (error) {
      console.error("Thermal print error:", error)
      alert("Failed to connect to thermal printer. Please check USB connection.")
    }
  }

  const downloadReceiptData = () => {
    const dataStr = JSON.stringify(receiptData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `receipt-${receiptData.id}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="rounded-t-2xl bg-slate-900 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Payment Receipt</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Receipt ID: {receiptData.id}
          </p>
        </div>

        {/* Receipt Preview */}
        <div className="max-h-[50vh] overflow-y-auto p-6">
          <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-6">
            {/* Header */}
            <div className="border-b-2 border-dashed border-slate-300 pb-4 text-center">
              <h3 className="text-2xl font-bold text-slate-900">SUVIDHA Kiosk</h3>
              <p className="text-sm text-slate-600">Government Services Payment</p>
            </div>

            {/* Details */}
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Receipt ID:</span>
                <span className="font-medium text-slate-900">{receiptData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Date:</span>
                <span className="font-medium text-slate-900">{receiptData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Department:</span>
                <span className="font-medium text-slate-900">{receiptData.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Service:</span>
                <span className="font-medium text-slate-900">{receiptData.serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Account Number:</span>
                <span className="font-medium text-slate-900">{receiptData.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Payment Method:</span>
                <span className="font-medium text-slate-900">{receiptData.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Reference:</span>
                <span className="font-medium text-slate-900">{receiptData.reference}</span>
              </div>
            </div>

            {/* Items */}
            <div className="mt-4 border-t-2 border-dashed border-slate-300 pt-4">
              <h4 className="mb-2 font-semibold text-slate-900">Payment Details</h4>
              <div className="space-y-1 text-sm">
                {receiptData.items.map((item: { description: string; amount: number }, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-slate-600">{item.description}</span>
                    <span className="font-medium text-slate-900">
                      ₹{item.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="mt-4 border-t-2 border-slate-900 pt-4">
              <div className="flex justify-between text-lg font-bold text-slate-900">
                <span>TOTAL AMOUNT</span>
                <span>₹{receiptData.amount.toFixed(2)}</span>
              </div>
            </div>

            {/* QR Code for Soft Copy */}
            <div className="mt-6 flex flex-col items-center">
              <p className="mb-3 text-sm font-medium text-slate-700">Scan to download soft copy</p>
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="Receipt QR Code" 
                  className="h-40 w-40 rounded-lg border-2 border-slate-300"
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white">
                  <span className="animate-spin text-2xl">⏳</span>
                </div>
              )}
              <p className="mt-2 text-xs text-slate-500">Or click "Save Receipt" below</p>
            </div>

            {/* Footer */}
            <div className="mt-4 border-t-2 border-dashed border-slate-300 pt-4 text-center text-xs text-slate-500">
              <p>This is a computer generated receipt. No signature required.</p>
              <p className="mt-1">For queries: support@suvidhakiosk.in | 1800-123-4567</p>
              <p className="mt-1">Visit: suvidhakiosk.in</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-slate-200 p-4">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 font-medium text-white transition-all hover:bg-slate-900 active:scale-95 disabled:opacity-50"
            >
              {isPrinting ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>
                  <span>�️</span>
                  <span>Print</span>
                </>
              )}
            </button>

            <button
              onClick={handleThermalPrint}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition-all hover:bg-blue-700 active:scale-95"
            >
              <span>🧾</span>
              <span>Thermal Print</span>
            </button>

            <button
              onClick={downloadReceiptData}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-medium text-white transition-all hover:bg-green-700 active:scale-95"
            >
              <span>💾</span>
              <span>Save Receipt</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="mt-3 w-full rounded-xl border-2 border-slate-200 py-3 font-medium text-slate-600 transition-all hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
