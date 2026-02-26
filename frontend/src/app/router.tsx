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
import AnalyticsDashboard from "../pages/AnalyticsDashboard"
import FeedbackSystem from "../pages/FeedbackSystem"
import TransactionExport from "../pages/TransactionExport"

// Electricity Department
import ElectricityViewCurrentBill from "../pages/electricity/ViewCurrentBill"
import ElectricityPayBill from "../pages/electricity/PayBill"
import ElectricityBillHistory from "../pages/electricity/BillHistory"
import ElectricityRaiseComplaint from "../pages/electricity/RaiseComplaint"
import ElectricityComplaintStatus from "../pages/electricity/ComplaintStatus"
import ElectricityTransferConnection from "../pages/electricity/TransferConnection"
import ElectricityReceiptDownload from "../pages/electricity/ReceiptDownload"
import ElectricityMeterReading from "../pages/electricity/MeterReading"
import ElectricityNewConnection from "../pages/electricity/NewConnection"
import ElectricityLoadChange from "../pages/electricity/LoadChange"
import ElectricityNameChange from "../pages/electricity/NameChange"
import ElectricityBillingIssues from "../pages/electricity/BillingIssues"

// Water Department
import WaterViewCurrentBill from "../pages/water/ViewWaterBill"
import WaterBillHistory from "../pages/water/WaterBillHistory"
import WaterRaiseComplaint from "../pages/water/WaterRaiseComplaint"
import WaterPayBill from "../pages/water/WaterPayBill"
import WaterMeterReading from "../pages/water/MeterReading"
import WaterNewConnection from "../pages/water/NewConnection"
import WaterStatus from "../pages/water/Status"
import WaterNameChange from "../pages/water/NameChange"
import WaterSewerage from "../pages/water/Sewerage"

// Gas Department
import GasBookingStatus from "../pages/gas/BookingStatus"
import GasBookCylinder from "../pages/gas/BookCylinder"
import GasSubsidyInfo from "../pages/gas/SubsidyInfo"
import GasNewConnection from "../pages/gas/NewConnection"
import GasSurrender from "../pages/gas/Surrender"
import GasDamagedCylinder from "../pages/gas/DamagedCylinder"
import GasRegulatorIssue from "../pages/gas/RegulatorIssue"
import GasDoubleBottle from "../pages/gas/DoubleBottle"

// Municipal Department
import MunicipalPayPropertyTax from "../pages/municipal/PayPropertyTax"
import MunicipalPropertyDetails from "../pages/municipal/PropertyDetails"
import MunicipalRaiseComplaint from "../pages/municipal/MunicipalRaiseComplaint"
import MunicipalBirthCertificate from "../pages/municipal/BirthCertificate"
import MunicipalDeathCertificate from "../pages/municipal/DeathCertificate"
import MunicipalMarriageCertificate from "../pages/municipal/MarriageCertificate"
import MunicipalTradeLicense from "../pages/municipal/TradeLicense"
import MunicipalStreetLight from "../pages/municipal/StreetLight"
import MunicipalGarbage from "../pages/municipal/Garbage"
import MunicipalDrainage from "../pages/municipal/Drainage"
import MunicipalRoads from "../pages/municipal/Roads"
import MunicipalTaxReceipt from "../pages/municipal/TaxReceipt"
import MunicipalComplaintStatus from "../pages/municipal/ComplaintStatus"

// Transport Department
import TransportChallanHistory from "../pages/transport/ChallanHistory"
import TransportVehicleDetails from "../pages/transport/VehicleDetails"
import TransportDrivingLicenseRenewal from "../pages/transport/DrivingLicenseRenewal"
import TransportDlStatus from "../pages/transport/DlStatus"
import TransportLearnerLicense from "../pages/transport/LearnerLicense"
import TransportVehicleRegistration from "../pages/transport/VehicleRegistration"
import TransportPermitRenewal from "../pages/transport/PermitRenewal"
import TransportFitnessCertificate from "../pages/transport/FitnessCertificate"
import TransportNoc from "../pages/transport/Noc"
import TransportPayChallan from "../pages/transport/PayChallan"

// PDS Department
import PdsViewRationCard from "../pages/pds/ViewRationCard"
import PdsViewTransactions from "../pages/pds/ViewTransactions"
import PdsViewEntitlement from "../pages/pds/ViewEntitlement"
import PdsRaiseGrievance from "../pages/pds/PdsRaiseGrievance"
import PdsAddMember from "../pages/pds/AddMember"
import PdsGrievanceStatus from "../pages/pds/GrievanceStatus"
import PdsRemoveMember from "../pages/pds/RemoveMember"
import PdsAddressChange from "../pages/pds/AddressChange"
import PdsCardDuplicate from "../pages/pds/CardDuplicate"
import PdsFpsChange from "../pages/pds/FpsChange"
import PdsQualityComplaint from "../pages/pds/QualityComplaint"

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
  { path: "/analytics", element: <AnalyticsDashboard /> },
  { path: "/feedback", element: <FeedbackSystem /> },
  { path: "/export", element: <TransactionExport /> },

  // Electricity Routes
  { path: "/electricity/current-bill", element: <ElectricityViewCurrentBill /> },
  { path: "/electricity/pay-bill", element: <ElectricityPayBill /> },
  { path: "/electricity/bill-history", element: <ElectricityBillHistory /> },
  { path: "/electricity/raise-complaint", element: <ElectricityRaiseComplaint /> },
  { path: "/electricity/complaint-status", element: <ElectricityComplaintStatus /> },
  { path: "/electricity/transfer", element: <ElectricityTransferConnection /> },
  { path: "/electricity/receipt", element: <ElectricityReceiptDownload /> },
  { path: "/electricity/meter-reading", element: <ElectricityMeterReading /> },
  { path: "/electricity/new-connection", element: <ElectricityNewConnection /> },
  { path: "/electricity/load-change", element: <ElectricityLoadChange /> },
  { path: "/electricity/name-change", element: <ElectricityNameChange /> },
  { path: "/electricity/billing-issues", element: <ElectricityBillingIssues /> },

  // Water Routes
  { path: "/water/current-bill", element: <WaterViewCurrentBill /> },
  { path: "/water/history", element: <WaterBillHistory /> },
  { path: "/water/raise-complaint", element: <WaterRaiseComplaint /> },
  { path: "/water/pay-bill", element: <WaterPayBill /> },
  { path: "/water/meter-reading", element: <WaterMeterReading /> },
  { path: "/water/new-connection", element: <WaterNewConnection /> },
  { path: "/water/status", element: <WaterStatus /> },
  { path: "/water/name-change", element: <WaterNameChange /> },
  { path: "/water/sewerage", element: <WaterSewerage /> },

  // Gas Routes
  { path: "/gas/booking-status", element: <GasBookingStatus /> },
  { path: "/gas/book-cylinder", element: <GasBookCylinder /> },
  { path: "/gas/subsidy-info", element: <GasSubsidyInfo /> },
  { path: "/gas/new-connection", element: <GasNewConnection /> },
  { path: "/gas/surrender", element: <GasSurrender /> },
  { path: "/gas/damaged-cylinder", element: <GasDamagedCylinder /> },
  { path: "/gas/regulator-issue", element: <GasRegulatorIssue /> },
  { path: "/gas/double-bottle", element: <GasDoubleBottle /> },

  // Municipal Routes
  { path: "/municipal/pay-tax", element: <MunicipalPayPropertyTax /> },
  { path: "/municipal/tax-receipt", element: <MunicipalTaxReceipt /> },
  { path: "/municipal/complaint-status", element: <MunicipalComplaintStatus /> },
  { path: "/municipal/raise-complaint", element: <MunicipalRaiseComplaint /> },
  { path: "/municipal/birth-certificate", element: <MunicipalBirthCertificate /> },
  { path: "/municipal/death-certificate", element: <MunicipalDeathCertificate /> },
  { path: "/municipal/marriage-certificate", element: <MunicipalMarriageCertificate /> },
  { path: "/municipal/trade-license", element: <MunicipalTradeLicense /> },
  { path: "/municipal/street-light", element: <MunicipalStreetLight /> },
  { path: "/municipal/garbage", element: <MunicipalGarbage /> },
  { path: "/municipal/drainage", element: <MunicipalDrainage /> },
  { path: "/municipal/roads", element: <MunicipalRoads /> },

  // Transport Routes
  { path: "/transport/challan-history", element: <TransportChallanHistory /> },
  { path: "/transport/vehicle-details", element: <TransportVehicleDetails /> },
  { path: "/transport/pay-challan", element: <TransportPayChallan /> },
  { path: "/transport/renew-license", element: <TransportDrivingLicenseRenewal /> },
  { path: "/transport/dl-status", element: <TransportDlStatus /> },
  { path: "/transport/learner-license", element: <TransportLearnerLicense /> },
  { path: "/transport/vehicle-registration", element: <TransportVehicleRegistration /> },
  { path: "/transport/permit-renewal", element: <TransportPermitRenewal /> },
  { path: "/transport/fitness-certificate", element: <TransportFitnessCertificate /> },
  { path: "/transport/noc", element: <TransportNoc /> },

  // PDS Routes
  { path: "/pds/card-details", element: <PdsViewRationCard /> },
  { path: "/pds/transactions", element: <PdsViewTransactions /> },
  { path: "/pds/entitlement", element: <PdsViewEntitlement /> },
  { path: "/pds/raise-grievance", element: <PdsRaiseGrievance /> },
  { path: "/pds/add-member", element: <PdsAddMember /> },
  { path: "/pds/grievance-status", element: <PdsGrievanceStatus /> },
  { path: "/pds/remove-member", element: <PdsRemoveMember /> },
  { path: "/pds/address-change", element: <PdsAddressChange /> },
  { path: "/pds/card-duplicate", element: <PdsCardDuplicate /> },
  { path: "/pds/fps-change", element: <PdsFpsChange /> },
  { path: "/pds/quality-complaint", element: <PdsQualityComplaint /> },

  // Fallback generic route
  { path: "/:department/:service", element: <ServicePage /> },
])