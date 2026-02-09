import { BrowserRouter, Routes, Route } from "react-router-dom"

import LanguageSelect from "../pages/LanguageSelect"
import Login from "../pages/Login"
import OtpVerify from "../pages/OtpVerify"
import Dashboard from "../pages/Dashboard"
import ServiceSelect from "../pages/ServiceSelect"
import PayBill from "../pages/PayBill"
import PaymentSuccess from "../pages/PaymentSuccess"
import RaiseComplaint from "../pages/RaiseComplaint"
import ServicesDashboard from "../pages/ServicesDashboard"
import ServiceDashboard from "../pages/ServiceDashboard"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LanguageSelect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OtpVerify />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services" element={<ServiceSelect />} />
        <Route path="/pay-bill" element={<PayBill />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/complaint" element={<RaiseComplaint />} />
        <Route path="/services-dashboard" element={<ServicesDashboard />} />
        <Route path="/service-dashboard" element={<ServiceDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}