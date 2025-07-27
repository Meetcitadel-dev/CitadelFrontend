

import type { LucideIcon } from "lucide-react"

interface SettingsMenuItemProps {
  icon: LucideIcon
  title: string
  onClick?: () => void
}

export default function SettingsMenuItem({ icon: Icon, title, onClick }: SettingsMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 w-full p-4 bg-gray-800 text-white hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
    >
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-base font-medium text-left">{title}</span>
    </button>
  )
}
