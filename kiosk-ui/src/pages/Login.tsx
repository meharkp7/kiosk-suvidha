import { useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-6 border rounded w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <input className="w-full border p-3 rounded mb-4" placeholder="Mobile Number" />
        <button
          onClick={() => navigate("/otp")}
          className="w-full bg-blue-800 text-white py-3 rounded"
        >
          Send OTP
        </button>
      </div>
    </div>
  )
}