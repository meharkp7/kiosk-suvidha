import PageWrapper from "../components/PageWrapper"
import ScreenLayout from "../components/ScreenLayout"

export default function PaymentSuccess() {
  return (
    <PageWrapper>
      <ScreenLayout
        title="Payment Successful"
        subtitle="Your transaction has been completed"
      >
        <h2 className="text-2xl font-semibold text-green-700 mb-4">
          Payment Successful
        </h2>

        <p className="text-gray-600 mb-8">
          Your receipt has been generated successfully.
        </p>

        <div className="border rounded-lg p-6">
          <p className="mb-1">Transaction ID</p>
          <p className="font-mono">TXN-982374982</p>
        </div>
      </ScreenLayout>
    </PageWrapper>
  )
}