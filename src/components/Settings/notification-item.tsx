// import ToggleSwitch from "./toggle-switch"

import ToggleSwitch from "./toggle-switch"

interface NotificationItemProps {
  title: string
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export default function NotificationItem({ title, enabled, onChange }: NotificationItemProps) {
  return (
    <div className="flex items-center justify-between py-4 px-4 border-b border-gray-700 last:border-b-0">
      <span className="text-white text-base font-medium">{title}</span>
      <ToggleSwitch enabled={enabled} onChange={onChange} />
    </div>
  )
}
