

import type { LucideIcon } from "lucide-react"

interface SettingsMenuItemProps {
  icon: LucideIcon
  title: string
  onClick?: () => void
  isDestructive?: boolean
}

export default function SettingsMenuItem({ icon: Icon, title, onClick, isDestructive = false }: SettingsMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 w-full p-4 bg-gray-800 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0 ${
        isDestructive ? 'text-red-500 hover:text-red-400' : 'text-white'
      }`}
    >
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
        <Icon className={`w-5 h-5 ${isDestructive ? 'text-red-500' : ''}`} />
      </div>
      <span className="text-base font-medium text-left">{title}</span>
    </button>
  )
}
