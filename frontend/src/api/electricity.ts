import { API_BASE } from "./config"

export async function fetchCurrentBill(accountNumber: string) {
  const res = await fetch(
    `${API_BASE}/electricity/bill/${accountNumber}`,
    {
      credentials: "include",
    }
  )

  if (!res.ok) {
    throw new Error("No unpaid bill")
  }

  return res.json()
}

export async function payElectricityBill(accountNumber: string) {
  const res = await fetch(
    `${API_BASE}/electricity/pay/${accountNumber}`,
    {
      method: "POST",
      credentials: "include",
    }
  )

  if (!res.ok) {
    throw new Error("Payment failed")
  }

  return res.json()
}

export async function fetchBillHistory(accountNumber: string) {
  const res = await fetch(
    `${API_BASE}/electricity/history/${accountNumber}`,
    {
      credentials: "include",
    }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch history")
  }

  return res.json()
}

export async function raiseElectricityComplaint(
  accountNumber: string,
  category: string
) {
  const res = await fetch(
    `${API_BASE}/electricity/complaint`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ accountNumber, category }),
    }
  )

  if (!res.ok) {
    throw new Error("Complaint failed")
  }

  return res.json()
}

export async function fetchLatestComplaint(accountNumber: string) {
  const res = await fetch(
    `${API_BASE}/electricity/complaint/latest/${accountNumber}`,
    {
      credentials: "include",
    }
  )

  if (!res.ok) {
    throw new Error("No complaint found")
  }

  return res.json()
}

export async function createTransferRequest(accountNumber: string) {
  const res = await fetch(
    `${API_BASE}/electricity/transfer`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ accountNumber }),
    }
  )

  if (!res.ok) {
    throw new Error("Transfer failed")
  }

  return res.json()
}