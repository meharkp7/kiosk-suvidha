import PageWrapper from "../components/PageWrapper"

export default function RaiseComplaint() {
  return (
    <PageWrapper>
      <h2 className="text-2xl font-semibold mb-6">
        Raise a Complaint
      </h2>

      <textarea
        placeholder="Describe your issue"
        className="w-full border rounded-lg p-4 text-lg mb-8 h-32"
      />

      <button className="w-full bg-blue-800 text-white py-4 rounded-lg text-lg">
        Submit Complaint
      </button>
    </PageWrapper>
  )
}