import { useNavigate } from "react-router-dom"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"

export default function PayBill() {
  const navigate = useNavigate()

  return (
    <PageWrapper>
      <ScreenLayout
        title="Bill Payment"
        subtitle="Review details before proceeding"
      >
        <h2 className="text-2xl font-semibold mb-6">
          Bill Details
        </h2>

        <div className="border rounded-lg p-6 mb-8">
          <p className="mb-2">Service: Electricity</p>
          <p className="mb-2">Bill Month: January</p>
          <p className="text-lg font-semibold">
            Amount: ₹1,240
          </p>
        </div>

        <button
          onClick={() => navigate("/success")}
          className="w-full bg-blue-800 text-white py-4 rounded-lg text-lg"
        >
          Proceed to Payment
        </button>
      </ScreenLayout>
    </PageWrapper>
  )
}