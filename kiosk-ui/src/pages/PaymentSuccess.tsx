import PageWrapper from "../components/PageWrapper"

export default function PaymentSuccess() {
  return (
    <PageWrapper>
      <h2 className="text-2xl font-semibold text-center text-green-700 mb-4">
        Payment Successful
      </h2>

      <p className="text-center text-gray-600 mb-8">
        Your receipt has been generated
      </p>

      <div className="border rounded-lg p-5 text-center">
        <p className="mb-2">Transaction ID</p>
        <p className="font-mono text-sm">
          TXN982374982
        </p>
      </div>
    </PageWrapper>
  )
}