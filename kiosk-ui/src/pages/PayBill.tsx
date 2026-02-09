import { useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"

export default function PayBill() {
  const navigate = useNavigate()

  return (
    <PageWrapper>
      <h2 className="text-2xl font-semibold mb-6">
        Bill Details
      </h2>

      <div className="border rounded-lg p-5 mb-8">
        <p className="mb-2">Service: Electricity</p>
        <p className="mb-2">Bill Month: January 2026</p>
        <p className="font-semibold text-lg">
          Amount: ₹1,240
        </p>
      </div>

      <button
        onClick={() => navigate("/success")}
        className="w-full bg-blue-800 text-white py-4 rounded-lg text-lg"
      >
        Proceed to Payment
      </button>
    </PageWrapper>
  )
}