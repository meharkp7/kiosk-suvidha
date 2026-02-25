import Header from "./Header"

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col">
      <Header />

      <main className="flex-1 overflow-hidden px-16 py-10">
        <div className="h-full w-full">
          {children}
        </div>
      </main>
    </div>
  )
}