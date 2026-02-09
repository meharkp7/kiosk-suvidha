import Header from "./Header"

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 flex justify-center items-start pt-12 px-8">
        <div className="w-full max-w-[1080px] bg-white border rounded-lg p-10 min-h-[600px]">
          {children}
        </div>
      </main>
    </div>
  )
}