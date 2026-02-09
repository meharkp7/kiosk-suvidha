export default function Header() {
    return (
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-800 text-white flex items-center justify-center rounded font-semibold">
            S
          </div>
          <h1 className="text-lg font-semibold text-blue-900">
            SUVIDHA Kiosk
          </h1>
        </div>
  
        <span className="text-sm text-gray-600">
          Government Services Portal
        </span>
      </header>
    )
  }  