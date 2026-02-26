// API base URL - uses env variable in production, localhost in development
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"

// Debug: Log the API base URL
console.log('API_BASE:', API_BASE)
console.log('VITE_API_BASE_URL env var:', import.meta.env.VITE_API_BASE_URL)