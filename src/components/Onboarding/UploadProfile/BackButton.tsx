
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  onClick?: () => void
}

export default function BackButton({ onClick }: BackButtonProps) {
  return (
    <button onClick={onClick} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
      <ArrowLeft className="w-6 h-6 text-white" />
    </button>
  )
}
