import { API_BASE } from "./config"

export async function sendOtp(phone: string) {
  const res = await fetch(`${API_BASE}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
    credentials: "include",
    cache: "no-store",
  })

  return res.json()
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