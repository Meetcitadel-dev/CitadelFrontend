import profileImage from "@/assets/a college boy.png"

import { Calendar, Bell, Ban, Headphones, FileText, LogOut } from "lucide-react"
import SettingsHeader from "./settings-header"
import ProfileSection from "./profile-section"
import SettingsMenuItem from "./settings-menu-item"

interface SettingsScreenProps {
  onNavigateToEventBookings?: () => void
  onNavigateToNotifications?: () => void
  onNavigateToBlockedUsers?: () => void
  onNavigateToHelpSupport?: () => void
  onNavigateToPrivacyPolicy?: () => void
  onBack?: () => void
}

export default function SettingsScreen({
  onNavigateToEventBookings,
  onNavigateToNotifications,
  onNavigateToBlockedUsers,
  onNavigateToHelpSupport,
  onNavigateToPrivacyPolicy,
  onBack,
}: SettingsScreenProps) {
  const menuItems = [
    { icon: Calendar, title: "Event Bookings", onClick: onNavigateToEventBookings },
    { icon: Bell, title: "Notifications", onClick: onNavigateToNotifications },
    { icon: Ban, title: "Blocked users", onClick: onNavigateToBlockedUsers },
    { icon: Headphones, title: "Help & Support", onClick: onNavigateToHelpSupport },
    { icon: FileText, title: "Privacy policy and T&C", onClick: onNavigateToPrivacyPolicy },
    { icon: LogOut, title: "Log Out" },
  ]

  return (
    <div className="w-full min-h-screen bg-black">
      <SettingsHeader title="Settings" onBack={onBack} />
      <ProfileSection name="Nisarg Patel" subtitle="Masters' Union" profileImage={profileImage} />
      <div className="w-full">
        {menuItems.map((item, index) => (
          <SettingsMenuItem key={index} icon={item.icon} title={item.title} onClick={item.onClick} />
        ))}
      </div>
    </div>
  )
}
