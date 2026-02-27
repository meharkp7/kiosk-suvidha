import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"

const SESSION_DURATION = 300 // 5 minutes in seconds
const SESSION_END_KEY = "session_end_time"

type SessionContextType = {
  timeLeft: number
  resetSession: () => void
  endSession: () => void
}

const SessionContext = createContext<SessionContextType | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState(0)

  // Calculate remaining time based on stored end time
  const calculateTimeLeft = useCallback(() => {
    const endTime = localStorage.getItem(SESSION_END_KEY)
    if (!endTime) return 0
    
    const remaining = Math.floor((parseInt(endTime) - Date.now()) / 1000)
    return Math.max(0, remaining)
  }, [])

  // Initialize timer from localStorage on mount
  useEffect(() => {
    const remaining = calculateTimeLeft()
    setTimeLeft(remaining)
    
    if (remaining === 0) {
      localStorage.removeItem(SESSION_END_KEY)
    }
  }, [calculateTimeLeft])

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) {
      // Check if we should redirect (session expired)
      const endTime = localStorage.getItem(SESSION_END_KEY)
      if (endTime && Date.now() > parseInt(endTime)) {
        localStorage.removeItem(SESSION_END_KEY)
        navigate("/login", { replace: true })
      }
      return
    }

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft()
      setTimeLeft(remaining)
      
      if (remaining <= 0) {
        clearInterval(interval)
        localStorage.removeItem(SESSION_END_KEY)
        console.log("SessionContext: Session expired, redirecting to login")
        navigate("/login", { replace: true })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, calculateTimeLeft, navigate])

  const resetSession = () => {
    console.log("SessionContext: Resetting session timer to 300 seconds")
    const endTime = Date.now() + SESSION_DURATION * 1000
    localStorage.setItem(SESSION_END_KEY, endTime.toString())
    setTimeLeft(SESSION_DURATION)
  }

  const endSession = () => {
    localStorage.removeItem(SESSION_END_KEY)
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