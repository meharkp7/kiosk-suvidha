import { createBrowserRouter } from "react-router-dom"
import LanguageSelect from "../pages/LanguageSelect"
import Login from "../pages/Login"
import OtpVerify from "../pages/OtpVerify"
import Dashboard from "../pages/Dashboard"
import ServiceSelect from "../pages/ServiceSelect"
import ServicesDashboard from "../pages/ServicesDashboard"
import PayBill from "../pages/PayBill"
import PaymentSuccess from "../pages/PaymentSuccess"
import RaiseComplaint from "../pages/RaiseComplaint"
import ServicePage from "../pages/ServicePage"

// Electricity Department
import ElectricityViewCurrentBill from "../pages/electricity/ViewCurrentBill"
import ElectricityPayBill from "../pages/electricity/PayBill"
import ElectricityBillHistory from "../pages/electricity/BillHistory"
import ElectricityRaiseComplaint from "../pages/electricity/RaiseComplaint"
import ElectricityComplaintStatus from "../pages/electricity/ComplaintStatus"
import ElectricityTransferConnection from "../pages/electricity/TransferConnection"

// Water Department
import WaterViewCurrentBill from "../pages/water/ViewWaterBill"
import WaterBillHistory from "../pages/water/WaterBillHistory"
import WaterRaiseComplaint from "../pages/water/WaterRaiseComplaint"
import WaterPayBill from "../pages/water/WaterPayBill"

// Gas Department
import GasBookingStatus from "../pages/gas/BookingStatus"
import GasBookCylinder from "../pages/gas/BookCylinder"

// Municipal Department
import MunicipalPayPropertyTax from "../pages/municipal/PayPropertyTax"
import MunicipalPropertyDetails from "../pages/municipal/PropertyDetails"
import MunicipalRaiseComplaint from "../pages/municipal/MunicipalRaiseComplaint"

// Transport Department
import TransportChallanHistory from "../pages/transport/ChallanHistory"
import TransportVehicleDetails from "../pages/transport/VehicleDetails"

// PDS Department
import PdsViewRationCard from "../pages/pds/ViewRationCard"
import PdsViewTransactions from "../pages/pds/ViewTransactions"
import PdsViewEntitlement from "../pages/pds/ViewEntitlement"
import PdsRaiseGrievance from "../pages/pds/PdsRaiseGrievance"

export const router = createBrowserRouter([
  { path: "/", element: <LanguageSelect /> },
  { path: "/login", element: <Login /> },
  { path: "/otp", element: <OtpVerify /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/services", element: <ServiceSelect /> },
  { path: "/services-dashboard", element: <ServicesDashboard /> },
  { path: "/pay-bill", element: <PayBill /> },
  { path: "/success", element: <PaymentSuccess /> },
  { path: "/complaint", element: <RaiseComplaint /> },

  // Electricity Routes
  { path: "/electricity/current-bill", element: <ElectricityViewCurrentBill /> },
  { path: "/electricity/pay-bill", element: <ElectricityPayBill /> },
  { path: "/electricity/bill-history", element: <ElectricityBillHistory /> },
  { path: "/electricity/raise-complaint", element: <ElectricityRaiseComplaint /> },
  { path: "/electricity/complaint-status", element: <ElectricityComplaintStatus /> },
  { path: "/electricity/transfer", element: <ElectricityTransferConnection /> },

  // Water Routes
  { path: "/water/current-bill", element: <WaterViewCurrentBill /> },
  { path: "/water/history", element: <WaterBillHistory /> },
  { path: "/water/raise-complaint", element: <WaterRaiseComplaint /> },
  { path: "/water/pay-bill", element: <WaterPayBill /> },

  // Gas Routes
  { path: "/gas/booking-status", element: <GasBookingStatus /> },
  { path: "/gas/book-cylinder", element: <GasBookCylinder /> },

  // Municipal Routes
  { path: "/municipal/pay-tax", element: <MunicipalPayPropertyTax /> },
  { path: "/municipal/property-details", element: <MunicipalPropertyDetails /> },
  { path: "/municipal/raise-complaint", element: <MunicipalRaiseComplaint /> },

  // Transport Routes
  { path: "/transport/challan-history", element: <TransportChallanHistory /> },
  { path: "/transport/vehicle-details", element: <TransportVehicleDetails /> },

  // PDS Routes
  { path: "/pds/card-details", element: <PdsViewRationCard /> },
  { path: "/pds/transactions", element: <PdsViewTransactions /> },
  { path: "/pds/entitlement", element: <PdsViewEntitlement /> },
  { path: "/pds/raise-grievance", element: <PdsRaiseGrievance /> },

  // Fallback generic route
  { path: "/:department/:service", element: <ServicePage /> },
])