import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"
import { API_BASE } from "../../api/config"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface ChallanData {
  id: string
  challanNumber: string
  violationType: string
  fineAmount: number
}

export default function PayChallan() {
  const navigate = useNavigate()
  const location = useLocation()
  const accountNumber = useAccountNumber("transport")
  const { challan } = location.state || {}

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
        title="Pay Traffic Challan"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 rounded-2xl p-8">
            <span className="text-6xl mb-4 block">🚗</span>
            <h2 className="text-2xl font-bold text-red-800 mb-2">No Vehicle Selected</h2>
            <p className="text-red-600 mb-6">Please select your Transport account from the services dashboard</p>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-red-600 text-white px-8 py-4 rounded-xl font-semibold"
            >
              Go to Services Dashboard →
            </button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  if (!challan) {
    return (
      <KioskLayout
        title="Pay Traffic Challan"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/transport/challan-history", { state: { accountNumber } })}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-red-800 mb-2">No Challan Selected</h2>
            <button
              onClick={() => navigate("/transport/challan-history", { state: { accountNumber } })}
              className="bg-red-600 text-white px-8 py-4 rounded-xl font-semibold"
            >
              View Challan History
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
          amount: challan.fineAmount,
          accountNumber,
          department: 'transport',
          challanId: challan.id
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
          navigate('/transport/challan-history', { state: { accountNumber } })
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
        description: `Traffic Challan Payment - ${challan.challanNumber}`,
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
            navigate('/transport/challan-history', { state: { accountNumber } })
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
          color: '#EF4444'
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
      title="🚗 Pay Traffic Challan"
      subtitle={`Vehicle: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/transport/challan-history", { state: { accountNumber } })}
    >
      <div className="max-w-4xl mx-auto">
        {/* Challan Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Challan Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-slate-500">Challan Number</span>
              <p className="font-semibold">{challan.challanNumber}</p>
            </div>
            <div>
              <span className="text-slate-500">Violation Type</span>
              <p className="font-semibold">{challan.violationType}</p>
            </div>
            <div>
              <span className="text-slate-500">Vehicle Number</span>
              <p className="font-semibold">{accountNumber}</p>
            </div>
            <div>
              <span className="text-slate-500">Status</span>
              <p className="font-semibold text-red-600">PENDING</p>
            </div>
          </div>
        </div>

        {/* Fine Amount */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 mb-6 text-white text-center">
          <p className="text-red-100">Fine Amount</p>
          <h2 className="text-4xl font-bold">₹{challan.fineAmount}</h2>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Select Payment Method</h3>
          <div className="grid grid-cols-3 gap-4">
            <button className="p-4 rounded-xl border-2 border-red-500 bg-red-50 text-center">
              <span className="text-2xl mb-2 block">📱</span>
              <p className="font-semibold">UPI</p>
            </button>
            <button className="p-4 rounded-xl border-2 border-slate-200 hover:border-red-300 text-center">
              <span className="text-2xl mb-2 block">💳</span>
              <p className="font-semibold">Card</p>
            </button>
            <button className="p-4 rounded-xl border-2 border-slate-200 hover:border-red-300 text-center">
              <span className="text-2xl mb-2 block">💵</span>
              <p className="font-semibold">Cash</p>
            </button>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading || !razorpayLoaded}
          className="w-full bg-red-600 text-white py-5 rounded-xl text-xl font-bold hover:bg-red-700 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
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
            `💳 Pay ₹${challan.fineAmount}`
          )}
        </button>

        {/* Security Note */}
        <div className="bg-green-50 rounded-xl p-4 mt-6">
          <p className="text-green-700 text-sm">
            🔒 Secure payment powered by Razorpay. Your payment information is encrypted and secure.
          </p>
        </div>
      </div>
    </KioskLayout>
  )
}
