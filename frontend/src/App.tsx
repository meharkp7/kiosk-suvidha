import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import OtpVerify from "./pages/OtpVerify"
import Dashboard from "./pages/Dashboard"
import ServicesDashboard from "./pages/ServicesDashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/verify-otp" element={<OtpVerify />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services-dashboard" element={<ServicesDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App