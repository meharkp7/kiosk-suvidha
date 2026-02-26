// API base URL - uses env variable in production, localhost in development
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"