import { API_BASE } from "./config"

export async function sendOtp(phone: string) {
  const res = await fetch(`${API_BASE}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  })

  if (!res.ok) throw new Error("Failed to send OTP")
  return res.json()
}

export async function verifyOtp(phone: string, otp: string) {
  const res = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp }),
  })

  if (!res.ok) throw new Error("Invalid OTP")
  return res.json()
}