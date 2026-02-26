import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

type SessionContextType = {
  timeLeft: number
  resetSession: () => void
  endSession: () => void
}

const SessionContext = createContext<SessionContextType | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState(0)
  const [sessionStarted, setSessionStarted] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0 || !sessionStarted) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          console.log("SessionContext: Session expired, redirecting to login")
          navigate("/login", { replace: true })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, sessionStarted, navigate])

  const resetSession = () => {
    console.log("SessionContext: Resetting session timer to 300 seconds")
    setTimeLeft(300) // 5 minutes
    setSessionStarted(true)
  }

  const endSession = () => {
    setTimeLeft(0)
    navigate("/login", { replace: true })
  }

  return (
    <SessionContext.Provider
      value={{ timeLeft, resetSession, endSession }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) throw new Error("useSession must be used within SessionProvider")
  return context
}