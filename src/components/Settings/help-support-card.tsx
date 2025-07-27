
import type { LucideIcon } from "lucide-react"

interface HelpSupportCardProps {
  icon: LucideIcon
  title: string
  onClick?: () => void
}

export default function HelpSupportCard({ icon: Icon, title, onClick }: HelpSupportCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-3 p-4 bg-gray-800 rounded-2xl text-white hover:bg-gray-700 transition-colors w-full"
    >
      <Icon className="w-6 h-6 text-green-400" />
      <span className="text-base font-medium text-left">{title}</span>
    </button>
  )
}
