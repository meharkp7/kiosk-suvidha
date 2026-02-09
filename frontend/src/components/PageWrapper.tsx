import Header from "./Header"

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col">
      <Header />

      {/* FIXED KIOSK VIEWPORT */}
      <main className="flex-1 flex justify-center items-start pt-10">
        <div
          className="
            w-[500px]
            h-[700px]
            bg-white
            border
            rounded-lg
            px-10
            py-8
            overflow-hidden
          "
        >
          {children}
        </div>
      </main>
    </div>
  )
}