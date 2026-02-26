import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { API_BASE } from "../../api/config"
import { useAccountNumber } from "../../hooks/useAccountNumber"

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
  const navigate = useNavigate()
  const location = useLocation()
  const accountNumber = useAccountNumber("electricity")
  const { bill } = location.state || {}

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cash">("upi")
  const [loading, setLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

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
        title="Pay Bill"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-amber-50 rounded-2xl p-8">
            <span className="text-6xl mb-4 block">⚡</span>
            <h2 className="text-2xl font-bold text-amber-800 mb-2">No Account Selected</h2>
            <p className="text-amber-600 mb-6">Please select your Electricity account from the services dashboard</p>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-blue-800 text-white px-8 py-4 rounded-xl font-semibold"
            >
              Go to Services Dashboard →
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

      // If demo mode, simulate payment without Razorpay
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
          navigate('/electricity/bill-history', { state: { accountNumber } })
        } else {
          alert('Payment verification failed. Please contact support.')
          setLoading(false)
        }
        return
      }

      // Open Razorpay checkout for real payments
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
            navigate('/electricity/bill-history', { state: { accountNumber } })
          } else {
            alert('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: 'Rahul Sharma',
          email: 'rahul@example.com',
          contact: '9876543210'
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <button
              onClick={() => setPaymentMethod("cash")}
              className={`p-6 rounded-xl border-2 transition-all ${
                paymentMethod === "cash"
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 hover:border-blue-300"
              }`}
            >
              <span className="text-4xl mb-2 block">💵</span>
              <p className="font-semibold text-slate-800">Cash</p>
              <p className="text-sm text-slate-500">Pay at Counter</p>
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
    </KioskLayout>
  )
}
