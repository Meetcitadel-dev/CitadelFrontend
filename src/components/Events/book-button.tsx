"use client"

interface BookButtonProps {
  isEnabled: boolean
  onClick: () => void
}

export function BookButton({ isEnabled, onClick }: BookButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={!isEnabled}
      className={`w-full py-4 rounded-2xl text-xl font-semibold transition-all duration-200 ${
        isEnabled ? "bg-green-400 text-black hover:bg-green-300" : "bg-gray-600 text-gray-400 cursor-not-allowed"
      }`}
    >
      Book my seat
    </button>
  )
}
