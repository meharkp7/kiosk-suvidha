import { API_BASE } from "./config"

export async function fetchAccounts() {
  const token = sessionStorage.getItem("token")

  const res = await fetch(`${API_BASE}/accounts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("Failed to fetch accounts")
  return res.json()
}