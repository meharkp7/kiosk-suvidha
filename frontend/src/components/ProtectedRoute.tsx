import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getMe } from "../api/auth"

type Props = {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkAuth() {
      console.log("ProtectedRoute: Checking authentication...")
      try {
        // Add a small delay to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 100))
        const user = await getMe()
        console.log("ProtectedRoute: User data:", user)
        setAuthorized(!!user)
      } catch (error) {
        console.error("ProtectedRoute: Auth check error:", error)
        setAuthorized(false)
      }
    }

    checkAuth()
  }, [])

  if (authorized === null) {
    return null // or loading spinner
  }

  if (!authorized) {
    console.log("ProtectedRoute: Not authorized, redirecting to /login")
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}