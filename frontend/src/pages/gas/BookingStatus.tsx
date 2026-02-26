import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"

interface BookingData {
  id: string
  bookingId: string
  bookingDate: string
  deliveryDate?: string
  cylinderType: string
  quantity: number
  amount: number
  subsidyAmount?: number
  netAmount: number
  status: string
}

export default function GasBookingStatus() {
  const location = useLocation()
  const navigate = useNavigate()
  const { accountNumber: stateAccountNumber } = location.state || {}
  
  // All hooks must be declared before any early return
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [loading, setLoading] = useState(true)
  
  const accountNumber = stateAccountNumber || sessionStorage.getItem("gasAccountNumber")
  
  useEffect(() => {
    if (stateAccountNumber) {
      sessionStorage.setItem("gasAccountNumber", stateAccountNumber)
    }
  }, [stateAccountNumber])

  useEffect(() => {
    if (!accountNumber) {
      setLoading(false)
      return
    }

    // Mock data for demonstration
    const mockBookings: BookingData[] = [
      {
        id: "1",
        bookingId: "BK1709123456789",
        bookingDate: "2024-01-15",
        deliveryDate: "2024-01-18",
        cylinderType: "14.2KG",
        quantity: 1,
        amount: 1100,
        subsidyAmount: 200,
        netAmount: 900,
        status: "DELIVERED"
      },
      {
        id: "2",
        bookingId: "BK1709123456790",
        bookingDate: "2024-02-10",
        deliveryDate: "2024-02-13",
        cylinderType: "5KG",
        quantity: 2,
        amount: 800,
        subsidyAmount: 100,
        netAmount: 700,
        status: "DELIVERED"
      },
      {
        id: "3",
        bookingId: "BK1709123456791",
        bookingDate: "2024-03-05",
        cylinderType: "14.2KG",
        quantity: 1,
        amount: 1100,
        subsidyAmount: 200,
        netAmount: 900,
        status: "PENDING"
      },
      {
        id: "4",
        bookingId: "BK1709123456792",
        bookingDate: "2024-04-12",
        cylinderType: "19KG",
        quantity: 1,
        amount: 1500,
        subsidyAmount: 300,
        netAmount: 1200,
        status: "PROCESSING"
      }
    ]

    setTimeout(() => {
      setBookings(mockBookings)
      setLoading(false)
    }, 1000)
  }, [accountNumber])

  if (!accountNumber) {
    return (
      <KioskLayout
        title="🔥 Gas Bookings"
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-orange-50 rounded-2xl p-8">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h2 className="text-2xl font-bold text-orange-800 mb-2">No Account Selected</h2>
            <p className="text-orange-600 mb-6">Please select your Gas account from the services dashboard</p>
            <button
              onClick={() => navigate("/services-dashboard")}
              className="bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold"
            >
              Go to Services Dashboard →
            </button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  if (loading) {
    return (
      <KioskLayout
        title="🔥 Gas Bookings"
        subtitle={`Account: ${accountNumber}`}
        showHeader={true}
        showNav={true}
        onBack={() => navigate("/services-dashboard")}
      >
        <div className="max-w-4xl mx-auto p-8">
          <div className="text-center">
            <span className="text-6xl animate-spin">⏳</span>
            <p className="mt-4 text-xl text-slate-600">Loading booking history...</p>
          </div>
        </div>
      </KioskLayout>
    )
  }

  const deliveredBookings = bookings.filter(b => b.status === "DELIVERED")
  const pendingBookings = bookings.filter(b => b.status === "PENDING")
  const processingBookings = bookings.filter(b => b.status === "PROCESSING")
  const totalSpent = bookings.reduce((sum, b) => sum + b.netAmount, 0)
  const totalSubsidy = bookings.reduce((sum, b) => sum + (b.subsidyAmount || 0), 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-green-600 text-white"
      case "PROCESSING": return "bg-blue-600 text-white"
      case "PENDING": return "bg-amber-600 text-white"
      default: return "bg-slate-600 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED": return "✅"
      case "PROCESSING": return "⏳"
      case "PENDING": return "⏰"
      default: return "📋"
    }
  }

  return (
    <KioskLayout
      title="🔥 Gas Bookings"
      subtitle={`Account: ${accountNumber}`}
      showHeader={true}
      showNav={true}
      onBack={() => navigate("/services-dashboard")}
    >
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/gas/book-cylinder", { state: { accountNumber } })}
          className="w-full bg-orange-600 text-white py-4 rounded-xl text-lg font-bold mb-6 hover:bg-orange-700"
        >
          ⛽ Book New Cylinder
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-orange-50 rounded-2xl p-8 text-center">
            <span className="text-6xl mb-4 block">🫙</span>
            <h2 className="text-2xl font-bold text-orange-800">No Bookings</h2>
            <p className="text-orange-600">Book your first cylinder now</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-500">Booking ID</p>
                    <p className="text-xl font-bold text-slate-800">{b.bookingId}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(b.status)}`}>
                    {b.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Cylinder</p>
                    <p className="font-semibold">{b.cylinderType} x {b.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Amount</p>
                    <p className="font-semibold">₹{b.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Booked On</p>
                    <p className="font-semibold">{new Date(b.bookingDate).toLocaleDateString()}</p>
                  </div>
                  {b.deliveryDate && (
                    <div>
                      <p className="text-sm text-slate-500">Delivered</p>
                      <p className="font-semibold">{new Date(b.deliveryDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {b.subsidyAmount && b.subsidyAmount > 0 && (
                  <div className="mt-4 bg-green-50 rounded-lg p-3">
                    <p className="text-green-700">
                      <span className="font-semibold">Subsidy:</span> ₹{b.subsidyAmount} | Net: ₹{b.netAmount}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </KioskLayout>
  )
}
