import { API_BASE } from "./config"

export async function sendOtp(phone: string) {
  try {
    console.log("Sending OTP to:", phone)
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
      credentials: "include",
      cache: "no-store",
    })

    console.log("OTP send response status:", res.status)
    
    if (!res.ok) {
      console.error("OTP send failed:", res.statusText)
      throw new Error(`Failed to send OTP: ${res.statusText}`)
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
  const res = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp }),
    credentials: "include",
    cache: "no-store",
  })

  return res.json()
}

export async function getMe() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    credentials: "include",
    cache: "no-store",
  })

  if (!res.ok) return null
  return res.json()
}