export default function Button({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) {
    return (
      <button
        onClick={onClick}
        className="bg-blue-800 text-white px-6 py-3 rounded text-base hover:bg-blue-900"
      >
        {children}
      </button>
    )
  }  