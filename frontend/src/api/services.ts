import { API_BASE } from "./config"

export async function fetchServices(department: string) {
  const token = sessionStorage.getItem("token")
  const res = await fetch(
    `${API_BASE}/services?department=${encodeURIComponent(department)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) throw new Error("Failed to fetch services")
  return res.json()
}