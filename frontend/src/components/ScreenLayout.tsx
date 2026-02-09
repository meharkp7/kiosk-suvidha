export default function ScreenLayout({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="h-full flex flex-col">
      {/* Fixed header zone */}
      <div className="h-[72px] mb-4">
        <h1 className="text-xl sm:text-2xl font-semibold">
          {title}
        </h1>
        <p className="text-gray-500 mt-1 min-h-[20px] text-sm sm:text-base">
          {subtitle ?? ""}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}