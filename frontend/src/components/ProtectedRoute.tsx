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
      const user = await getMe()
      setAuthorized(!!user)
    }

    checkAuth()
  }, [])

  if (authorized === null) {
    return null // or loading spinner
  }

  if (!authorized) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}