import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

interface KioskLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  showHeader?: boolean
  showNav?: boolean
  onBack?: () => void
  onHome?: () => void
}

export default function KioskLayout({
  children,
  title,
  subtitle,
  showHeader = true,
  showNav = true,
  onBack,
  onHome,
}: KioskLayoutProps) {
  const navigate = useNavigate()
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal")
  const [sessionTime, setSessionTime] = useState(300)

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime((prev) => {
        if (prev <= 1) {
          navigate("/login")
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const fontSizeClasses = {
    normal: "text-base",
    large: "text-lg",
    xlarge: "text-xl",
  }

  return (
    <div
      className={`min-h-screen flex flex-col ${
        highContrast ? "bg-black text-white" : "bg-gradient-to-br from-slate-50 to-blue-50"
      } ${fontSizeClasses[fontSize]}`}
    >
      {/* Top Bar */}
      {showHeader && (
        <header
          className={`${
            highContrast ? "bg-black border-white" : "bg-white border-slate-200"
          } border-b shadow-sm px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4`}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-3 items-center gap-2">
            {/* Left: Back & Home */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 justify-start">
              {onBack && (
                <button
                  onClick={onBack}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-5 py-2 sm:py-3 rounded-xl font-medium transition-all active:scale-95 ${
                    highContrast
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-lg sm:text-xl">←</span>
                  <span className="hidden xs:inline sm:text-base lg:text-base">Back</span>
                </button>
              )}
              {onHome && (
                <button
                  onClick={onHome}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-5 py-2 sm:py-3 rounded-xl font-medium transition-all active:scale-95 ${
                    highContrast
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "bg-blue-800 text-white hover:bg-blue-700"
                  }`}
                >
                  <span className="text-lg sm:text-xl">🏠</span>
                  <span className="hidden xs:inline sm:text-base lg:text-base">Home</span>
                </button>
              )}
            </div>

            {/* Center: Title */}
            <div className="text-center flex-1 px-2">
              <h1
                className={`text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold truncate ${
                  highContrast ? "text-white" : "text-slate-900"
                }`}
              >
                {title}
              </h1>
              {subtitle && (
                <p className={`text-xs sm:text-sm mt-1 truncate ${highContrast ? "text-gray-300" : "text-slate-500"}`}>
                  {subtitle}
                </p>
              )}
            </div>

            {/* Right: Accessibility & Session */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 justify-end">
              {/* Font Size Toggle */}
              <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setFontSize("normal")}
                  className={`px-2 py-1 rounded text-sm ${fontSize === "normal" ? "bg-white shadow" : ""}`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize("large")}
                  className={`px-2 py-1 rounded text-sm ${fontSize === "large" ? "bg-white shadow" : ""}`}
                >
                  A+
                </button>
                <button
                  onClick={() => setFontSize("xlarge")}
                  className={`px-2 py-1 rounded text-sm ${fontSize === "xlarge" ? "bg-white shadow" : ""}`}
                >
                  A++
                </button>
              </div>

              {/* High Contrast Toggle */}
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`p-2 sm:p-3 rounded-xl transition-all ${
                  highContrast
                    ? "bg-yellow-400 text-black"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                title="Toggle High Contrast"
              >
                <span className="text-lg sm:text-xl">👁️</span>
              </button>

              {/* Session Timer */}
              <div
                className={`px-2 sm:px-3 lg:px-4 py-2 sm:py-3 rounded-xl font-mono font-medium text-xs sm:text-sm ${
                  sessionTime < 60
                    ? "bg-red-100 text-red-700"
                    : highContrast
                    ? "bg-gray-800 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                <span className="hidden sm:inline">⏱️</span>
                <span className="sm:hidden">⏰</span>
                {formatTime(sessionTime)}
              </div>

              {/* End Session */}
              <button
                onClick={() => navigate("/login")}
                className="bg-red-600 text-white px-2 sm:px-3 lg:px-5 py-2 sm:py-3 rounded-xl font-medium hover:bg-red-700 transition-all active:scale-95 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">End Session</span>
                <span className="sm:hidden">End</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 xl:p-8">{children}</div>
      </main>

      {/* Footer Help Bar */}
      <footer
        className={`${
          highContrast ? "bg-black border-white" : "bg-white border-slate-200"
        } border-t px-3 sm:px-4 lg:px-6 py-2 sm:py-3`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            <span className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <span className="text-base sm:text-xl">📞</span>
              <span className={highContrast ? "text-gray-300" : "text-slate-600"}>
                <span className="hidden sm:inline">Helpline: </span>1800-XXX-XXXX
              </span>
            </span>
            <span className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <span className="text-base sm:text-xl">♿</span>
              <span className={highContrast ? "text-gray-300" : "text-slate-600"}>
                <span className="hidden sm:inline">Accessible </span>Kiosk
              </span>
            </span>
          </div>
          <div className="text-xs sm:text-sm">
            <span className={highContrast ? "text-gray-400" : "text-slate-400"}>
              <span className="hidden sm:inline">Government of India | </span>
              <span className="sm:hidden">GoI | </span>
              Secure & Verified
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
