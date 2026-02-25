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
      <div className="mb-12 border-b pb-6">
        <h1 className="text-4xl font-semibold tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="text-gray-600 mt-3 text-xl">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}