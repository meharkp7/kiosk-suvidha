import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { getMe } from "../api/auth"
import { useSession } from "../context/SessionContext"

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const { timeLeft, endSession } = useSession()

  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const user = await getMe()
      setAuthenticated(!!user)
    }

    checkAuth()
  }, [location.pathname])

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-8 shadow-sm">

      {/* LEFT */}
      <div className="flex items-center gap-6">
        {authenticated && (
          <button
            onClick={() => navigate(-1)}
            className="min-w-[110px] h-14 bg-slate-100 hover:bg-slate-200 rounded-xl text-lg font-medium flex items-center justify-center"
          >
            ← Back
          </button>
        )}

        <button
          onClick={() => navigate("/")}
          className="min-w-[110px] h-14 bg-blue-800 text-white hover:bg-blue-900 rounded-xl text-lg font-medium flex items-center justify-center"
        >
          Home
        </button>
      </div>

      {/* CENTER */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-800 text-white flex items-center justify-center rounded-xl text-xl font-bold">
          S
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-blue-900 tracking-tight">
            SUVIDHA
          </h1>
          <p className="text-sm text-gray-600">
            Government Services Kiosk
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        {authenticated && timeLeft > 0 && (
          <>
            <div className="text-lg text-gray-700 font-medium">
              Session ends in: {formatTime(timeLeft)}
            </div>

            <button
              onClick={endSession}
              className="min-w-[140px] h-14 bg-red-600 text-white hover:bg-red-700 rounded-xl text-lg font-medium flex items-center justify-center"
            >
              End Session
            </button>
          </>
        )}
      </div>
    </header>
  )
}