import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SessionProvider } from "../context/SessionContext"
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
import ProtectedRoute from "../components/ProtectedRoute";
import ElectricityDashboard from "../pages/ElectricityDashboard"
import ElectricityPay from "../pages/ElectricityPay"
import ElectricityHistory from "../pages/ElectricityHistory"
import ElectricityComplaint from "../pages/ElectricityComplaint"
import ElectricityTransfer from "../pages/ElectricityTransfer"
import ElectricityReceipt from "../pages/ElectricityReceipt"
import ElectricityComplaintStatus from "../pages/ElectricityComplaintStatus"

// Department Pages
import ElectricityViewCurrentBill from "../pages/electricity/ViewCurrentBill"
import ElectricityPayBill from "../pages/electricity/PayBill"
import ElectricityBillHistory from "../pages/electricity/BillHistory"
import ElectricityRaiseComplaint from "../pages/electricity/RaiseComplaint"
import ElectricityComplaintStatusNew from "../pages/electricity/ComplaintStatus"
import ElectricityTransferConnection from "../pages/electricity/TransferConnection"

import WaterViewCurrentBill from "../pages/water/ViewWaterBill"
import WaterBillHistory from "../pages/water/WaterBillHistory"
import WaterRaiseComplaint from "../pages/water/WaterRaiseComplaint"
import WaterPayBill from "../pages/water/WaterPayBill"

import GasBookingStatus from "../pages/gas/BookingStatus"
import GasBookCylinder from "../pages/gas/BookCylinder"

import MunicipalPayPropertyTax from "../pages/municipal/PayPropertyTax"
import MunicipalPropertyDetails from "../pages/municipal/PropertyDetails"
import MunicipalRaiseComplaint from "../pages/municipal/MunicipalRaiseComplaint"

import TransportChallanHistory from "../pages/transport/ChallanHistory"
import TransportVehicleDetails from "../pages/transport/VehicleDetails"

import PdsViewRationCard from "../pages/pds/ViewRationCard"
import PdsViewTransactions from "../pages/pds/ViewTransactions"
import PdsViewEntitlement from "../pages/pds/ViewEntitlement"
import PdsRaiseGrievance from "../pages/pds/PdsRaiseGrievance"

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path="/" element={<LanguageSelect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<OtpVerify />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/services" element={<ServiceSelect />} />
          <Route path="/pay-bill" element={<PayBill />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/complaint" element={<RaiseComplaint />} />
          <Route 
            path="/services-dashboard" 
            element={
              <ProtectedRoute>
                <ServicesDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/service-dashboard" element={<ServiceDashboard />} />
          <Route
            path="/electricity"
            element={
              <ProtectedRoute>
                <ElectricityDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/electricity/pay" element={<ProtectedRoute><ElectricityPay /></ProtectedRoute>} />
          <Route path="/electricity/history" element={<ProtectedRoute><ElectricityHistory /></ProtectedRoute>} />
          <Route path="/electricity/complaint" element={<ProtectedRoute><ElectricityComplaint /></ProtectedRoute>} />
          <Route path="/electricity/transfer" element={<ProtectedRoute><ElectricityTransfer /></ProtectedRoute>} />
          <Route path="/electricity/receipt" element={<ProtectedRoute><ElectricityReceipt /></ProtectedRoute>} />
          <Route path="/electricity/complaint-status" element={<ProtectedRoute><ElectricityComplaintStatus /></ProtectedRoute>} />

          {/* Department Feature Pages */}
          <Route path="/electricity/current-bill" element={<ProtectedRoute><ElectricityViewCurrentBill /></ProtectedRoute>} />
          <Route path="/electricity/pay-bill" element={<ProtectedRoute><ElectricityPayBill /></ProtectedRoute>} />
          <Route path="/electricity/bill-history" element={<ProtectedRoute><ElectricityBillHistory /></ProtectedRoute>} />
          <Route path="/electricity/raise-complaint" element={<ProtectedRoute><ElectricityRaiseComplaint /></ProtectedRoute>} />
          <Route path="/electricity/complaint-status" element={<ProtectedRoute><ElectricityComplaintStatusNew /></ProtectedRoute>} />
          <Route path="/electricity/transfer" element={<ProtectedRoute><ElectricityTransferConnection /></ProtectedRoute>} />

          <Route path="/water/current-bill" element={<ProtectedRoute><WaterViewCurrentBill /></ProtectedRoute>} />
          <Route path="/water/history" element={<ProtectedRoute><WaterBillHistory /></ProtectedRoute>} />
          <Route path="/water/raise-complaint" element={<ProtectedRoute><WaterRaiseComplaint /></ProtectedRoute>} />
          <Route path="/water/pay-bill" element={<ProtectedRoute><WaterPayBill /></ProtectedRoute>} />

          <Route path="/gas/booking-status" element={<ProtectedRoute><GasBookingStatus /></ProtectedRoute>} />
          <Route path="/gas/book-cylinder" element={<ProtectedRoute><GasBookCylinder /></ProtectedRoute>} />

          <Route path="/municipal/pay-tax" element={<ProtectedRoute><MunicipalPayPropertyTax /></ProtectedRoute>} />
          <Route path="/municipal/property-details" element={<ProtectedRoute><MunicipalPropertyDetails /></ProtectedRoute>} />
          <Route path="/municipal/raise-complaint" element={<ProtectedRoute><MunicipalRaiseComplaint /></ProtectedRoute>} />

          <Route path="/transport/challan-history" element={<ProtectedRoute><TransportChallanHistory /></ProtectedRoute>} />
          <Route path="/transport/vehicle-details" element={<ProtectedRoute><TransportVehicleDetails /></ProtectedRoute>} />

          <Route path="/pds/view-ration-card" element={<ProtectedRoute><PdsViewRationCard /></ProtectedRoute>} />
          <Route path="/pds/view-transactions" element={<ProtectedRoute><PdsViewTransactions /></ProtectedRoute>} />
          <Route path="/pds/view-entitlement" element={<ProtectedRoute><PdsViewEntitlement /></ProtectedRoute>} />
          <Route path="/pds/raise-grievance" element={<ProtectedRoute><PdsRaiseGrievance /></ProtectedRoute>} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  )
}