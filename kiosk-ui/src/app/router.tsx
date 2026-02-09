import { createBrowserRouter } from "react-router-dom"
import LanguageSelect from "../pages/LanguageSelect"
import Login from "../pages/Login"
import OtpVerify from "../pages/OtpVerify"
import Dashboard from "../pages/Dashboard"
import ServiceSelect from "../pages/ServiceSelect"
import PayBill from "../pages/PayBill"
import PaymentSuccess from "../pages/PaymentSuccess"
import RaiseComplaint from "../pages/RaiseComplaint"

export const router = createBrowserRouter([
  { path: "/", element: <LanguageSelect /> },
  { path: "/login", element: <Login /> },
  { path: "/otp", element: <OtpVerify /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/services", element: <ServiceSelect /> },
  { path: "/pay-bill", element: <PayBill /> },
  { path: "/success", element: <PaymentSuccess /> },
  { path: "/complaint", element: <RaiseComplaint /> },
])