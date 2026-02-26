import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import ReceiptModal from "../../components/ReceiptModal"
import { API_BASE } from "../../api/config"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import type { ReceiptData } from "../../utils/receipt"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface BillData {
  id: string
  billingMonth: string
  totalAmount: number
  status: string
}

export default function ElectricityPayBill() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const accountNumber = useAccountNumber("electricity")
  const { bill } = location.state || {}

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cash">("upi")
  const [loading, setLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setRazorpayLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  if (!accountNumber) {
    return (
      <KioskLayout
        title={t("payBill")}
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

  if (!bill) {
    return (
      <KioskLayout
        title="Pay Bill"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/electricity/current-bill", { state: { accountNumber } })}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-amber-50 rounded-2xl p-8">
            <span className="text-6xl mb-4 block">💡</span>
            <h2 className="text-2xl font-bold text-amber-800 mb-2">No Bill Selected</h2>
            <p className="text-amber-600 mb-4">Please view your current bill first</p>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold"
            >
              Go to Services
            </button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert('Payment gateway is loading. Please wait...')
      return
    }

    setLoading(true)

    try {
      // Create payment order
      const response = await fetch(`${API_BASE}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount: bill.totalAmount,
          accountNumber,
          department: 'electricity',
          billId: bill.id
        })
      })

      const orderData = await response.json()

      if (!orderData.success) {
        throw new Error('Failed to create payment order')
      }

      // Handle different payment methods
      if (paymentMethod === "upi") {
        // Generate UPI QR code
        const upiId = "suvidha@ybl" // Your UPI ID
        const upiUrl = `upi://pay?pa=${upiId}&pn=SUVIDHA%20Kiosk&am=${bill.totalAmount}&cu=INR&tn=Electricity%20Bill%20${bill.billingMonth}`
        
        // Show UPI QR modal
        alert(`UPI Payment: ${upiUrl}\n\nScan with any UPI app to pay ₹${bill.totalAmount}`)
        
        // For demo, simulate successful UPI payment
        setTimeout(async () => {
          const demoPaymentId = `upi_payment_${Date.now()}`
          const verifyResponse = await fetch(`${API_BASE}/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              razorpayOrderId: orderData.order.id,
              razorpayPaymentId: demoPaymentId,
              razorpaySignature: `upi_sig_${Math.random().toString(36).substr(2, 9)}`
            })
          })
          
          const verifyData = await verifyResponse.json()
          
          if (verifyData.success) {
            const receipt: ReceiptData = {
              id: orderData.order.id,
              department: 'Electricity',
              serviceType: 'Bill Payment',
              accountNumber: accountNumber,
              amount: bill.totalAmount,
              date: new Date().toLocaleString('en-IN'),
              paymentMethod: 'UPI',
              reference: demoPaymentId,
              items: [
                { description: `Bill for ${bill.billingMonth}`, amount: bill.totalAmount },
                { description: 'Convenience Fee', amount: 0 }
              ]
            }
            setReceiptData(receipt)
            setShowReceipt(true)
          }
          setLoading(false)
        }, 3000)
        return
      }
      
      // Card payment - use Razorpay
      if (paymentMethod === "card") {
        // Open Razorpay checkout for card payments
        const options = {
          key: orderData.key,
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: 'SUVIDHA Kiosk',
          description: `Electricity Bill Payment - ${bill.billingMonth}`,
          order_id: orderData.order.id,
          handler: async function (response: any) {
            // Verify payment
            const verifyResponse = await fetch(`${API_BASE}/payments/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              // Generate receipt data
              const receipt: ReceiptData = {
                id: response.razorpay_order_id,
                department: 'Electricity',
                serviceType: 'Bill Payment',
                accountNumber: accountNumber,
                amount: bill.totalAmount,
                date: new Date().toLocaleString('en-IN'),
                paymentMethod: 'CARD',
                reference: response.razorpay_payment_id,
                items: [
                  { description: `Bill for ${bill.billingMonth}`, amount: bill.totalAmount },
                  { description: 'Convenience Fee', amount: 0 }
                ]
              }
              setReceiptData(receipt)
              setShowReceipt(true)
            } else {
              alert('Payment verification failed. Please contact support.')
            }
            setLoading(false)
          },
          modal: {
            ondismiss: function () {
              setLoading(false)
            }
          }
        }

        const razorpay = new (window as any).Razorpay(options)
        razorpay.open()
        return
      }
      
      // If demo mode, simulate payment
      if (orderData.demo) {
        console.log('🎮 DEMO MODE: Simulating payment')
        
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Simulate successful payment
        const demoPaymentId = `demo_payment_${Date.now()}`
        const demoSignature = `demo_sig_${Math.random().toString(36).substr(2, 9)}`
        
        // Verify the demo payment
        const verifyResponse = await fetch(`${API_BASE}/payments/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            razorpayOrderId: orderData.order.id,
            razorpayPaymentId: demoPaymentId,
            razorpaySignature: demoSignature
          })
        })

        const verifyData = await verifyResponse.json()

        if (verifyData.success) {
          // Generate receipt data
          const receipt: ReceiptData = {
            id: orderData.order.id,
            department: 'Electricity',
            serviceType: 'Bill Payment',
            accountNumber: accountNumber,
            amount: bill.totalAmount,
            date: new Date().toLocaleString('en-IN'),
            paymentMethod: paymentMethod.toUpperCase(),
            reference: demoPaymentId,
            items: [
              { description: `Bill for ${bill.billingMonth}`, amount: bill.totalAmount },
              { description: 'Convenience Fee', amount: 0 }
            ]
          }
          setReceiptData(receipt)
          setShowReceipt(true)
        } else {
          alert('Payment verification failed. Please contact support.')
          setLoading(false)
        }
        return
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <KioskLayout
      title="⚡ Pay Electricity Bill"
      subtitle={`Account: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/electricity/current-bill", { state: { accountNumber } })}
      onHome={() => navigate("/")}
    >
      <div className="max-w-4xl mx-auto">
        {/* Amount Card */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 mb-6 text-white text-center">
          <p className="text-amber-100 mb-2">Total Amount to Pay</p>
          <h2 className="text-5xl font-bold">₹{bill.totalAmount.toFixed(2)}</h2>
          <p className="text-amber-100 mt-2">{bill.billingMonth}</p>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Select Payment Method</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setPaymentMethod("upi")}
              className={`p-6 rounded-xl border-2 transition-all ${
                paymentMethod === "upi"
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 hover:border-blue-300"
              }`}
            >
              <span className="text-4xl mb-2 block">📱</span>
              <p className="font-semibold text-slate-800">UPI</p>
              <p className="text-sm text-slate-500">Google Pay, PhonePe</p>
            </button>

            <button
              onClick={() => setPaymentMethod("card")}
              className={`p-6 rounded-xl border-2 transition-all ${
                paymentMethod === "card"
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 hover:border-blue-300"
              }`}
            >
              <span className="text-4xl mb-2 block">💳</span>
              <p className="font-semibold text-slate-800">Card</p>
              <p className="text-sm text-slate-500">Credit/Debit Card</p>
            </button>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={loading || !razorpayLoaded}
          className="w-full bg-blue-600 text-white py-5 rounded-xl text-xl font-bold hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="animate-spin">⏳</span>
              Processing...
            </span>
          ) : !razorpayLoaded ? (
            <span className="flex items-center justify-center gap-3">
              <span className="animate-spin">⏳</span>
              Loading Payment Gateway...
            </span>
          ) : (
            `💳 Pay ₹${bill.totalAmount}`
          )}
        </button>

        {/* Security Note */}
        <div className="mt-6 bg-green-50 rounded-xl p-4 text-center">
          <p className="text-green-700">
            <span className="font-semibold">🔒 Secure Payment:</span> Your transaction is encrypted and secure
          </p>
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => {
          setShowReceipt(false)
          navigate('/electricity/bill-history', { state: { accountNumber } })
        }}
        receiptData={receiptData}
      />
    </KioskLayout>
  )
}
