import { useNavigate } from "react-router-dom"
import KioskLayout from "../components/KioskLayout"

export default function TestPage() {
  const navigate = useNavigate()
  return (
    <KioskLayout title="Test" showHeader={true} showNav={true}>
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold">Book Cylinder Page Works!</h1>
        <button 
          onClick={() => navigate("/services-dashboard")}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    </KioskLayout>
  )
}
