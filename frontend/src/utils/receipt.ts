import { jsPDF } from "jspdf"

export interface ReceiptData {
  id: string
  department: string
  serviceType: string
  accountNumber: string
  amount: number
  customerName?: string
  date: string
  paymentMethod: string
  reference: string
  items: {
    description: string
    amount: number
  }[]
}

export function generateReceiptPDF(data: ReceiptData): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - 2 * margin

  let y = margin

  // Header
  doc.setFillColor(15, 23, 42) // Slate-900
  doc.rect(0, 0, pageWidth, 50, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("SUVIDHA Kiosk", pageWidth / 2, 25, { align: "center" })

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("Government Services Payment Receipt", pageWidth / 2, 35, { align: "center" })

  y = 65

  // Receipt Info Box
  doc.setFillColor(241, 245, 249) // Slate-100
  doc.roundedRect(margin, y, contentWidth, 60, 3, 3, "F")

  doc.setTextColor(15, 23, 42)
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")

  const leftCol = margin + 10
  const rightCol = margin + contentWidth / 2 + 10

  doc.text("Receipt ID:", leftCol, y + 15)
  doc.text("Date:", leftCol, y + 25)
  doc.text("Department:", leftCol, y + 35)
  doc.text("Service:", leftCol, y + 45)

  doc.setFont("helvetica", "normal")
  doc.text(data.id, leftCol + 35, y + 15)
  doc.text(data.date, leftCol + 35, y + 25)
  doc.text(data.department, leftCol + 35, y + 35)
  doc.text(data.serviceType, leftCol + 35, y + 45)

  doc.setFont("helvetica", "bold")
  doc.text("Account Number:", rightCol, y + 15)
  doc.text("Payment Method:", rightCol, y + 25)
  doc.text("Reference:", rightCol, y + 35)

  doc.setFont("helvetica", "normal")
  doc.text(data.accountNumber, rightCol + 40, y + 15)
  doc.text(data.paymentMethod, rightCol + 40, y + 25)
  doc.text(data.reference, rightCol + 40, y + 35)

  y += 75

  // Payment Details Table
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Payment Details", margin, y)

  y += 10

  // Table header
  doc.setFillColor(51, 65, 85) // Slate-700
  doc.rect(margin, y, contentWidth, 12, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("Description", margin + 10, y + 8)
  doc.text("Amount", pageWidth - margin - 10, y + 8, { align: "right" })

  y += 15
  doc.setTextColor(15, 23, 42)
  doc.setFont("helvetica", "normal")

  // Table rows
  data.items.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252) // Slate-50
      doc.rect(margin, y - 5, contentWidth, 10, "F")
    }

    doc.text(item.description, margin + 10, y + 3)
    doc.text(`₹${item.amount.toFixed(2)}`, pageWidth - margin - 10, y + 3, { align: "right" })
    y += 10
  })

  // Total
  y += 5
  doc.setFillColor(15, 23, 42) // Slate-900
  doc.rect(margin, y, contentWidth, 15, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("TOTAL AMOUNT", margin + 10, y + 10)
  doc.text(`₹${data.amount.toFixed(2)}`, pageWidth - margin - 10, y + 10, { align: "right" })

  y += 30

  // Footer
  doc.setTextColor(100, 116, 139) // Slate-500
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text("This is a computer generated receipt. No signature required.", pageWidth / 2, y, { align: "center" })
  doc.text("For queries, contact: support@suvidhakiosk.in | 1800-123-4567", pageWidth / 2, y + 6, { align: "center" })
  doc.text("Visit: https://suvidhakiosk.in", pageWidth / 2, y + 12, { align: "center" })

  // QR Code placeholder
  doc.setDrawColor(200, 200, 200)
  doc.rect(pageWidth / 2 - 20, y + 20, 40, 40)
  doc.setFontSize(8)
  doc.text("Scan to verify", pageWidth / 2, y + 55, { align: "center" })

  // Save the PDF
  doc.save(`receipt-${data.id}.pdf`)
}

export function printReceipt(data: ReceiptData): void {
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Receipt ${data.id}</title>
  <style>
    @media print {
      body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
      .receipt { max-width: 300px; margin: 0 auto; }
      .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 10px; margin-bottom: 15px; }
      .header h1 { margin: 0; font-size: 18px; }
      .header p { margin: 5px 0 0; font-size: 12px; color: #666; }
      .details { margin: 15px 0; font-size: 12px; }
      .details-row { display: flex; justify-content: space-between; margin: 5px 0; }
      .items { margin: 15px 0; }
      .item { display: flex; justify-content: space-between; font-size: 12px; margin: 3px 0; }
      .total { border-top: 2px solid #333; padding-top: 10px; margin-top: 15px; font-weight: bold; font-size: 14px; }
      .footer { text-align: center; margin-top: 20px; font-size: 10px; color: #666; border-top: 1px dashed #999; padding-top: 10px; }
      .qr { text-align: center; margin: 15px 0; }
      .qr-code { width: 100px; height: 100px; border: 1px solid #ccc; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 10px; }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>SUVIDHA Kiosk</h1>
      <p>Government Services Payment</p>
    </div>
    
    <div class="details">
      <div class="details-row"><span>Receipt ID:</span><span>${data.id}</span></div>
      <div class="details-row"><span>Date:</span><span>${data.date}</span></div>
      <div class="details-row"><span>Department:</span><span>${data.department}</span></div>
      <div class="details-row"><span>Service:</span><span>${data.serviceType}</span></div>
      <div class="details-row"><span>Account:</span><span>${data.accountNumber}</span></div>
      <div class="details-row"><span>Payment:</span><span>${data.paymentMethod}</span></div>
      <div class="details-row"><span>Reference:</span><span>${data.reference}</span></div>
    </div>
    
    <div class="items">
      <strong>Payment Details:</strong>
      ${data.items.map(item => `
        <div class="item">
          <span>${item.description}</span>
          <span>₹${item.amount.toFixed(2)}</span>
        </div>
      `).join('')}
    </div>
    
    <div class="total">
      <div class="details-row">
        <span>TOTAL AMOUNT</span>
        <span>₹${data.amount.toFixed(2)}</span>
      </div>
    </div>
    
    <div class="qr">
      <div class="qr-code">QR<br>VERIFY</div>
    </div>
    
    <div class="footer">
      <p>Thank you for using SUVIDHA Kiosk</p>
      <p>Helpline: 1800-123-4567</p>
      <p>suvidhakiosk.in</p>
    </div>
  </div>
  <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 500); }</script>
</body>
</html>`

  printWindow.document.write(html)
  printWindow.document.close()
}

export function generateThermalReceipt(data: ReceiptData): string {
  // ESC/POS commands for thermal printers
  const ESC = "\x1B"
  const GS = "\x1D"
  const INIT = ESC + "@"
  const CENTER = ESC + "a\x01"
  const LEFT = ESC + "a\x00"
  const BOLD_ON = ESC + "E\x01"
  const BOLD_OFF = ESC + "E\x00"
  const DOUBLE_WIDTH = GS + "!\x11"
  const NORMAL_WIDTH = GS + "!\x00"
  const CUT = GS + "V\x00"
  const LINE_FEED = "\n"

  let receipt = INIT

  // Header
  receipt += CENTER + BOLD_ON + DOUBLE_WIDTH + "SUVIDHA KIOSK" + NORMAL_WIDTH + BOLD_OFF + LINE_FEED
  receipt += "Government Services" + LINE_FEED
  receipt += "Payment Receipt" + LINE_FEED
  receipt += "-".repeat(32) + LINE_FEED

  // Details
  receipt += LEFT
  receipt += `Receipt ID: ${data.id}${LINE_FEED}`
  receipt += `Date: ${data.date}${LINE_FEED}`
  receipt += `Department: ${data.department}${LINE_FEED}`
  receipt += `Service: ${data.serviceType}${LINE_FEED}`
  receipt += `Account: ${data.accountNumber}${LINE_FEED}`
  receipt += `Payment: ${data.paymentMethod}${LINE_FEED}`
  receipt += `Reference: ${data.reference}${LINE_FEED}`
  receipt += "-".repeat(32) + LINE_FEED

  // Items
  data.items.forEach((item) => {
    receipt += `${item.description}${LINE_FEED}`
    receipt += `         ₹${item.amount.toFixed(2)}${LINE_FEED}`
  })

  receipt += "-".repeat(32) + LINE_FEED

  // Total
  receipt += CENTER + BOLD_ON + DOUBLE_WIDTH
  receipt += `TOTAL: ₹${data.amount.toFixed(2)}${NORMAL_WIDTH}${BOLD_OFF}${LINE_FEED}`

  // Footer
  receipt += CENTER + "Thank you!" + LINE_FEED
  receipt += "Helpline: 1800-123-4567" + LINE_FEED
  receipt += CUT

  return receipt
}
