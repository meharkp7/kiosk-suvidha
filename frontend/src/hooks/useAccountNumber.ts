import { useLocation } from "react-router-dom"

export function useAccountNumber(department: string): string | null {
  const location = useLocation()
  const { accountNumber: stateAccountNumber } = (location.state as { accountNumber?: string }) || {}
  
  // Try to get from state first, then sessionStorage
  const storageKey = `${department}AccountNumber`
  const accountNumber = stateAccountNumber || sessionStorage.getItem(storageKey)
  
  // Store in sessionStorage if coming from state
  if (stateAccountNumber && typeof window !== "undefined") {
    sessionStorage.setItem(storageKey, stateAccountNumber)
  }
  
  return accountNumber
}

export function clearAccountNumber(department: string) {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(`${department}AccountNumber`)
  }
}
