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
import ElectricityMeterReading from "../pages/electricity/MeterReading"
import ElectricityNewConnection from "../pages/electricity/NewConnection"
import ElectricityLoadChange from "../pages/electricity/LoadChange"
import ElectricityNameChange from "../pages/electricity/NameChange"
import ElectricityBillingIssues from "../pages/electricity/BillingIssues"

import WaterViewCurrentBill from "../pages/water/ViewWaterBill"
import WaterBillHistory from "../pages/water/WaterBillHistory"
import WaterRaiseComplaint from "../pages/water/WaterRaiseComplaint"
import WaterPayBill from "../pages/water/WaterPayBill"
import WaterMeterReading from "../pages/water/MeterReading"
import WaterNameChange from "../pages/water/NameChange"
import WaterNewConnection from "../pages/water/NewConnection"
import WaterSewerage from "../pages/water/Sewerage"

import GasBookingStatus from "../pages/gas/BookingStatus"
import GasBookCylinder from "../pages/gas/BookCylinder"
import GasNewConnection from "../pages/gas/NewConnection"
import GasDamagedCylinder from "../pages/gas/DamagedCylinder"
import GasDoubleBottle from "../pages/gas/DoubleBottle"
import GasRegulatorIssue from "../pages/gas/RegulatorIssue"
import GasSurrender from "../pages/gas/Surrender"

import MunicipalPayPropertyTax from "../pages/municipal/PayPropertyTax"
import MunicipalPropertyDetails from "../pages/municipal/PropertyDetails"
import MunicipalRaiseComplaint from "../pages/municipal/MunicipalRaiseComplaint"
import MunicipalBirthCertificate from "../pages/municipal/BirthCertificate"
import MunicipalDeathCertificate from "../pages/municipal/DeathCertificate"
import MunicipalMarriageCertificate from "../pages/municipal/MarriageCertificate"
import MunicipalGarbage from "../pages/municipal/Garbage"
import MunicipalDrainage from "../pages/municipal/Drainage"
import MunicipalRoads from "../pages/municipal/Roads"
import MunicipalStreetLight from "../pages/municipal/StreetLight"
import MunicipalTradeLicense from "../pages/municipal/TradeLicense"

import TransportChallanHistory from "../pages/transport/ChallanHistory"
import TransportVehicleDetails from "../pages/transport/VehicleDetails"
import TransportPayChallan from "../pages/transport/PayChallan"
import TransportVehicleRegistration from "../pages/transport/VehicleRegistration"
import TransportLearnerLicense from "../pages/transport/LearnerLicense"
import TransportDrivingLicenseRenewal from "../pages/transport/DrivingLicenseRenewal"
import TransportFitnessCertificate from "../pages/transport/FitnessCertificate"
import TransportNoc from "../pages/transport/Noc"
import TransportPermitRenewal from "../pages/transport/PermitRenewal"

import PdsViewRationCard from "../pages/pds/ViewRationCard"
import PdsViewTransactions from "../pages/pds/ViewTransactions"
import PdsViewEntitlement from "../pages/pds/ViewEntitlement"
import PdsRaiseGrievance from "../pages/pds/PdsRaiseGrievance"
import PdsAddMember from "../pages/pds/AddMember"
import PdsRemoveMember from "../pages/pds/RemoveMember"
import PdsAddressChange from "../pages/pds/AddressChange"
import PdsCardDuplicate from "../pages/pds/CardDuplicate"
import PdsFpsChange from "../pages/pds/FpsChange"
import PdsQualityComplaint from "../pages/pds/QualityComplaint"

import PaymentReceipt from "../pages/PaymentReceipt"

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
          <Route path="/electricity/meter-reading" element={<ProtectedRoute><ElectricityMeterReading /></ProtectedRoute>} />
          <Route path="/electricity/new-connection" element={<ProtectedRoute><ElectricityNewConnection /></ProtectedRoute>} />
          <Route path="/electricity/load-change" element={<ProtectedRoute><ElectricityLoadChange /></ProtectedRoute>} />
          <Route path="/electricity/name-change" element={<ProtectedRoute><ElectricityNameChange /></ProtectedRoute>} />
          <Route path="/electricity/billing-issues" element={<ProtectedRoute><ElectricityBillingIssues /></ProtectedRoute>} />

          <Route path="/water/current-bill" element={<ProtectedRoute><WaterViewCurrentBill /></ProtectedRoute>} />
          <Route path="/water/history" element={<ProtectedRoute><WaterBillHistory /></ProtectedRoute>} />
          <Route path="/water/raise-complaint" element={<ProtectedRoute><WaterRaiseComplaint /></ProtectedRoute>} />
          <Route path="/water/pay-bill" element={<ProtectedRoute><WaterPayBill /></ProtectedRoute>} />
          <Route path="/water/meter-reading" element={<ProtectedRoute><WaterMeterReading /></ProtectedRoute>} />
          <Route path="/water/name-change" element={<ProtectedRoute><WaterNameChange /></ProtectedRoute>} />
          <Route path="/water/new-connection" element={<ProtectedRoute><WaterNewConnection /></ProtectedRoute>} />
          <Route path="/water/sewerage" element={<ProtectedRoute><WaterSewerage /></ProtectedRoute>} />

          <Route path="/gas/booking-status" element={<ProtectedRoute><GasBookingStatus /></ProtectedRoute>} />
          <Route path="/gas/book-cylinder" element={<ProtectedRoute><GasBookCylinder /></ProtectedRoute>} />
          <Route path="/gas/new-connection" element={<ProtectedRoute><GasNewConnection /></ProtectedRoute>} />
          <Route path="/gas/damaged-cylinder" element={<ProtectedRoute><GasDamagedCylinder /></ProtectedRoute>} />
          <Route path="/gas/double-bottle" element={<ProtectedRoute><GasDoubleBottle /></ProtectedRoute>} />
          <Route path="/gas/regulator-issue" element={<ProtectedRoute><GasRegulatorIssue /></ProtectedRoute>} />
          <Route path="/gas/surrender" element={<ProtectedRoute><GasSurrender /></ProtectedRoute>} />

          <Route path="/municipal/pay-tax" element={<ProtectedRoute><MunicipalPayPropertyTax /></ProtectedRoute>} />
          <Route path="/municipal/property-details" element={<ProtectedRoute><MunicipalPropertyDetails /></ProtectedRoute>} />
          <Route path="/municipal/raise-complaint" element={<ProtectedRoute><MunicipalRaiseComplaint /></ProtectedRoute>} />
          <Route path="/municipal/birth-certificate" element={<ProtectedRoute><MunicipalBirthCertificate /></ProtectedRoute>} />
          <Route path="/municipal/death-certificate" element={<ProtectedRoute><MunicipalDeathCertificate /></ProtectedRoute>} />
          <Route path="/municipal/marriage-certificate" element={<ProtectedRoute><MunicipalMarriageCertificate /></ProtectedRoute>} />
          <Route path="/municipal/garbage" element={<ProtectedRoute><MunicipalGarbage /></ProtectedRoute>} />
          <Route path="/municipal/drainage" element={<ProtectedRoute><MunicipalDrainage /></ProtectedRoute>} />
          <Route path="/municipal/roads" element={<ProtectedRoute><MunicipalRoads /></ProtectedRoute>} />
          <Route path="/municipal/street-light" element={<ProtectedRoute><MunicipalStreetLight /></ProtectedRoute>} />
          <Route path="/municipal/trade-license" element={<ProtectedRoute><MunicipalTradeLicense /></ProtectedRoute>} />

          <Route path="/transport/challan-history" element={<ProtectedRoute><TransportChallanHistory /></ProtectedRoute>} />
          <Route path="/transport/vehicle-details" element={<ProtectedRoute><TransportVehicleDetails /></ProtectedRoute>} />
          <Route path="/transport/pay-challan" element={<ProtectedRoute><TransportPayChallan /></ProtectedRoute>} />
          <Route path="/transport/vehicle-registration" element={<ProtectedRoute><TransportVehicleRegistration /></ProtectedRoute>} />
          <Route path="/transport/learner-license" element={<ProtectedRoute><TransportLearnerLicense /></ProtectedRoute>} />
          <Route path="/transport/license-renewal" element={<ProtectedRoute><TransportDrivingLicenseRenewal /></ProtectedRoute>} />
          <Route path="/transport/fitness-certificate" element={<ProtectedRoute><TransportFitnessCertificate /></ProtectedRoute>} />
          <Route path="/transport/noc" element={<ProtectedRoute><TransportNoc /></ProtectedRoute>} />
          <Route path="/transport/permit-renewal" element={<ProtectedRoute><TransportPermitRenewal /></ProtectedRoute>} />

          <Route path="/pds/view-ration-card" element={<ProtectedRoute><PdsViewRationCard /></ProtectedRoute>} />
          <Route path="/pds/view-transactions" element={<ProtectedRoute><PdsViewTransactions /></ProtectedRoute>} />
          <Route path="/pds/view-entitlement" element={<ProtectedRoute><PdsViewEntitlement /></ProtectedRoute>} />
          <Route path="/pds/raise-grievance" element={<ProtectedRoute><PdsRaiseGrievance /></ProtectedRoute>} />
          <Route path="/pds/add-member" element={<ProtectedRoute><PdsAddMember /></ProtectedRoute>} />
          <Route path="/pds/remove-member" element={<ProtectedRoute><PdsRemoveMember /></ProtectedRoute>} />
          <Route path="/pds/address-change" element={<ProtectedRoute><PdsAddressChange /></ProtectedRoute>} />
          <Route path="/pds/card-duplicate" element={<ProtectedRoute><PdsCardDuplicate /></ProtectedRoute>} />
          <Route path="/pds/fps-change" element={<ProtectedRoute><PdsFpsChange /></ProtectedRoute>} />
          <Route path="/pds/quality-complaint" element={<ProtectedRoute><PdsQualityComplaint /></ProtectedRoute>} />
          <Route path="/receipt" element={<ProtectedRoute><PaymentReceipt /></ProtectedRoute>} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  )
}