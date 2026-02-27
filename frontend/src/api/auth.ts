import { API_BASE } from "./config"

export async function sendOtp(phone: string) {
  try {
    console.log("Sending OTP to:", phone, "API Base:", API_BASE)
    
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
      credentials: "include",
      cache: "no-store",
    })

    console.log("OTP send response status:", res.status)
    
    if (!res.ok) {
      const errorText = await res.text()
      console.error("OTP send failed:", res.statusText, errorText)
      throw new Error(`Failed to send OTP: ${res.statusText} - ${errorText}`)
    }

    const data = await res.json()
    console.log("OTP send response:", data)
    return data
  } catch (error) {
    console.error("OTP send error:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(errorMessage)
  }
}

export async function verifyOtp(phone: string, otp: string) {
  try {
    console.log('Attempting OTP verification:', { phone, otp, apiBase: API_BASE })
    
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
      credentials: "include",
      cache: "no-store",
    })

    console.log('OTP verification response status:', res.status)
    console.log('OTP verification response headers:', res.headers)

    if (!res.ok) {
      const errorText = await res.text()
      console.error('OTP verification failed:', res.status, errorText)
      throw new Error(`HTTP ${res.status}: ${errorText}`)
    }

    const data = await res.json()
    console.log('OTP verification response data:', data)
    return data
  } catch (error) {
    console.error('OTP verification error:', error)
    throw error
  }
}

export async function getMe() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    credentials: "include",
    cache: "no-store",
  })

  if (!res.ok) return null
  return res.json()
}