type Props = {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "danger"
  className?: string
}

export default function KioskButton({
  children,
  onClick,
  variant = "primary",
  className = "",
}: Props) {
  const base =
    "min-h-[72px] px-8 rounded-2xl text-xl font-medium flex items-center justify-center transition shadow-sm"

  const styles = {
    primary: "bg-blue-800 text-white hover:bg-blue-900",
    secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  }

  return (
    <button
      onClick={onClick}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}