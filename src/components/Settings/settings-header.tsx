

import { ChevronLeft } from "lucide-react"

interface SettingsHeaderProps {
  title: string
  onBack?: () => void
}

export default function SettingsHeader({ title, onBack }: SettingsHeaderProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-black text-white">
      <button onClick={onBack} className="p-1">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h1 className="text-xl font-medium">{title}</h1>
    </div>
  )
}
