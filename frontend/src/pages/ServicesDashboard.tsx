import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"

const ICONS: Record<string, string> = {
  "Electricity Department": "⚡",
  "Water Supply Board": "💧",
  "Municipal Corporation": "🏛",
  "Transport Department": "🚗",
  "Gas Authority": "🔥",
  "Telecom Services": "📡",
  "Housing Board": "🏠",
}

const SERVICES: Record<string, string[]> = {
  "Electricity Department": [
    "Pay Electricity Bill",
    "Download Bill Receipt",
    "Consumption History",
    "Report Power Outage",
    "Apply for New Meter",
    "Change Load Request",
    "Meter Reading",
    "Name Correction",
  ],
  "Water Supply Board": [
    "Pay Water Bill",
    "Download Water Bill",
    "Usage History",
    "Apply New Connection",
    "Report Leakage",
    "Change Connection Type",
    "Meter Status",
    "Consumer Update",
  ],
  "Municipal Corporation": [
    "Property Tax Payment",
    "Property Tax Receipt",
    "Birth Certificate",
    "Death Certificate",
    "Trade License",
    "Garbage Request",
    "Building Approval",
    "Grievance",
  ],
  "Transport Department": [
    "Driving License",
    "Vehicle Registration",
    "Challan Payment",
    "RC Download",
    "Address Change",
    "Slot Booking",
    "Permit Services",
    "Ownership Transfer",
  ],
  "Gas Authority": [
    "Pay Gas Bill",
    "New Gas Connection",
    "Cylinder Booking",
    "Subsidy Status",
    "Connection Transfer",
    "Complaint",
    "Usage History",
    "KYC Update",
  ],
  "Telecom Services": [
    "Pay Mobile Bill",
    "Recharge",
    "SIM Replacement",
    "Address Update",
    "Usage Statement",
    "Network Complaint",
    "Plan Change",
    "Number Porting",
  ],
  "Housing Board": [
    "Rent Payment",
    "Allotment Status",
    "Maintenance Charges",
    "Ownership Details",
    "NOC Services",
    "Transfer Request",
    "Grievance",
    "Document Download",
  ],
}

export default function ServicesDashboard() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const departments: string[] = state?.departments || []

  const [activeDept, setActiveDept] = useState(departments[0])

  return (
    <PageWrapper>
      <ScreenLayout
        title="Available Services"
        subtitle="Choose a department and service"
      >
        <div className="flex h-full">
          {/* LEFT ICON PANEL */}
          <div className="w-20 bg-slate-50 border-r flex flex-col items-center py-6 gap-4">
            {departments.map((dept) => (
              <button
                key={dept}
                title={dept}
                onClick={() => setActiveDept(dept)}
                className={`w-12 h-12 rounded-full text-xl flex items-center justify-center
                  ${
                    activeDept === dept
                      ? "bg-blue-800 text-white"
                      : "bg-white border"
                  }`}
              >
                {ICONS[dept]}
              </button>
            ))}
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 p-8 overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">
              {activeDept}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {SERVICES[activeDept].map((service) => (
                <button
                  key={service}
                  onClick={() =>
                    navigate("/service-dashboard", {
                      state: { department: activeDept, service },
                    })
                  }
                  className="border rounded-lg p-4 text-left hover:bg-slate-50"
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScreenLayout>
    </PageWrapper>
  )
}