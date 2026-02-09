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
        {/* FIXED HEADER BLOCK */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {subtitle && (
            <p className="text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
  
        {/* CONTENT AREA ALWAYS STARTS SAME PLACE */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    )
  }  