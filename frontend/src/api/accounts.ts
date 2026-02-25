import { API_BASE } from "./config"

export async function fetchAccounts() {
  const res = await fetch(`${API_BASE}/accounts/me`, {
    credentials: "include",
    cache: "no-store",
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}