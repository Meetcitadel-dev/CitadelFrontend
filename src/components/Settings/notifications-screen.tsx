import { useState } from "react"
// import SettingsHeader from "./settings-header"
import NotificationItem from "./notification-item"
import SettingsHeader from "./settings-header"

interface NotificationsScreenProps {
  onBack?: () => void
}

export default function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const [notifications, setNotifications] = useState({
    messages: true,
    events: true,
    likes: false,
    connectedRequests: true,
  })

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="w-full min-h-screen bg-black">
      <SettingsHeader title="Notifications" onBack={onBack} />
      <div className="pt-4">
        <NotificationItem title="Messages" enabled={notifications.messages} onChange={() => handleToggle("messages")} />
        <NotificationItem title="Events" enabled={notifications.events} onChange={() => handleToggle("events")} />
        <NotificationItem title="Likes" enabled={notifications.likes} onChange={() => handleToggle("likes")} />
        <NotificationItem
          title="Connected requests/ acceptance"
          enabled={notifications.connectedRequests}
          onChange={() => handleToggle("connectedRequests")}
        />
      </div>
    </div>
  )
}
