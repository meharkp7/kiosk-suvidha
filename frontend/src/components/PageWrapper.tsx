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
      <main className="flex-1 flex justify-center items-start pt-6 px-3 sm:px-6">
        <div
          className="
            w-full
            max-w-[500px]
            h-auto
            sm:h-[750px]
            bg-white
            border
            rounded-lg
            px-4 sm:px-8
            py-6
            overflow-hidden
          "
        >
          {children}
        </div>
      </main>
    </div>
  )
}