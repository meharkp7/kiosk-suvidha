import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { API_BASE } from "../../api/config"
import { useAccountNumber } from "../../hooks/useAccountNumber"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface TaxBill {
  id: string
  propertyId: string
  financialYear: string
  taxAmount: number
  rebateAmount: number
  penaltyAmount: number
  totalAmount: number
  dueDate: string
  status: string
}

export default function PayPropertyTax() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const accountNumber = useAccountNumber("municipal")

  const [bills, setBills] = useState<TaxBill[]>([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    if (!accountNumber) {
      setLoading(false)
      return
    }
    
    async function loadBills() {
      try {
        const res = await fetch(`${API_BASE}/municipal/tax-bill/${accountNumber}`, {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          // Ensure data is an array
          if (Array.isArray(data)) {
            setBills(data)
          } else {
            console.error("Invalid bills data format:", data)
            setBills([])
          }
        }
      } catch (err) {
        console.error("Failed to load tax bills")
        setBills([])
      } finally {
        setLoading(false)
      }
    }

    loadBills()
  }, [accountNumber])

  // Show error when no account
  if (!accountNumber) {
    return (
      <KioskLayout
        title="🏛️ Property Tax"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-emerald-50 rounded-2xl p-8">
            <span className="text-6xl mb-4 block">🏛️</span>
            <h2 className="text-2xl font-bold text-emerald-800 mb-2">No Property Selected</h2>
            <p className="text-emerald-600 mb-6">Please select your Municipal account from the services dashboard</p>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold"
            >
              Go to Services Dashboard →
            </button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  const handlePayment = async (bill: TaxBill) => {
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
          department: 'municipal',
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
          navigate('/receipt', { 
            state: { 
              amount: bill.totalAmount,
              reference: demoPaymentId,
              department: 'municipal',
              accountNumber,
              consumerName: '',
              billMonth: bill.financialYear,
              paymentDate: new Date().toLocaleString('en-IN'),
              paymentMethod: 'Demo/UPI',
              transactionId: demoPaymentId
            } 
          })
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
        description: `Property Tax Payment - ${bill.financialYear}`,
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
            navigate('/receipt', { 
              state: { 
                amount: bill.totalAmount,
                reference: response.razorpay_payment_id,
                department: 'municipal',
                accountNumber,
                consumerName: '',
                billMonth: bill.financialYear,
                paymentDate: new Date().toLocaleString('en-IN'),
                paymentMethod: 'UPI/Card/NetBanking',
                transactionId: response.razorpay_payment_id
              } 
            })
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
          color: '#10B981'
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
      title="🏛️ Property Tax"
      subtitle={`Property: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
    >
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600"></div>
          </div>
        ) : bills.length === 0 ? (
          <div className="bg-emerald-50 rounded-2xl p-8 text-center">
            <span className="text-6xl mb-4 block">🏠</span>
            <h2 className="text-2xl font-bold text-emerald-800">No Tax Bills</h2>
            <p className="text-emerald-600">You have no pending property tax bills</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bills.map((bill) => (
              <div key={bill.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-500">Financial Year</p>
                    <p className="text-xl font-bold text-slate-800">{bill.financialYear}</p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full font-semibold ${
                      bill.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {bill.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-500">Tax Amount</p>
                    <p className="font-semibold">₹{bill.taxAmount}</p>
                  </div>
                  {bill.rebateAmount > 0 && (
                    <div>
                      <p className="text-sm text-slate-500">Rebate</p>
                      <p className="font-semibold text-green-600">-₹{bill.rebateAmount}</p>
                    </div>
                  )}
                  {bill.penaltyAmount > 0 && (
                    <div>
                      <p className="text-sm text-slate-500">Penalty</p>
                      <p className="font-semibold text-red-600">+₹{bill.penaltyAmount}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                  <span className="font-bold text-emerald-800">Total</span>
                  <span className="text-2xl font-bold text-emerald-800">
                    ₹{bill.totalAmount}
                  </span>
                </div>

                {bill.status === "UNPAID" && (
                  <button
                    onClick={() => handlePayment(bill)}
                    disabled={loading || !razorpayLoaded}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Processing...
                      </span>
                    ) : !razorpayLoaded ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Loading...
                      </span>
                    ) : (
                      '💳 Pay Now'
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </KioskLayout>
  )
}
