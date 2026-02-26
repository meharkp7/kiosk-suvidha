import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import KioskLayout from "../../components/KioskLayout"
import { useAccountNumber } from "../../hooks/useAccountNumber"

export default function RemoveMember() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const cardNumber = useAccountNumber("pds")
  const [members, setMembers] = useState([
    { id: 1, name: "John Doe", relation: "Head", age: 45, selected: false },
    { id: 2, name: "Jane Doe", relation: "Spouse", age: 42, selected: false },
    { id: 3, name: "Sam Doe", relation: "Son", age: 18, selected: false }
  ])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const toggleMember = (id: number) => {
    setMembers(members.map(m => m.id === id ? { ...m, selected: !m.selected } : m))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const selected = members.filter(m => m.selected)
    if (selected.length === 0) {
      alert(t("selectAtLeastOneMember"))
      return
    }
    setLoading(true)
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 1500)
  }

  if (submitted) {
    return (
      <KioskLayout title="✅ Submitted" showHeader={true} showNav={true}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 rounded-xl p-8">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-green-800">Request Submitted!</h2>
            <p className="text-green-600 mt-2">Members will be removed after verification</p>
            <button onClick={() => navigate("/services-dashboard")} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">Back to Services</button>
          </div>
        </div>
      </KioskLayout>
    )
  }

  return (
    <KioskLayout title="👤 Remove Member" subtitle={`Card: ${cardNumber}`} showHeader={true} showNav={true} onBack={() => navigate("/services-dashboard")}>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Select Members to Remove</h3>
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className={`flex items-center justify-between p-4 border rounded-lg ${member.selected ? "border-red-500 bg-red-50" : "border-gray-200"}`}>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.relation} • {member.age} years</p>
                  </div>
                  <button type="button" onClick={() => toggleMember(member.id)} className={`px-4 py-2 rounded-lg ${member.selected ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700"}`}>
                    {member.selected ? "Remove" : "Select"}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-xl text-lg font-medium">{loading ? "Submitting..." : "Submit Removal Request"}</button>
        </form>
      </div>
    </KioskLayout>
  )
}
