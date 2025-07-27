import { useState } from "react"
import SettingsScreen from "@/components/Settings/settings-screen"
import EventBookingsScreen from "@/components/Settings/event-bookings-screen"
import NotificationsScreen from "@/components/Settings/notifications-screen"
import BlockedUsersScreen from "@/components/Settings/blocked-users-screen"
import HelpSupportScreen from "@/components/Settings/help-support-screen"
import PrivacyPolicyScreen from "@/components/Settings/privacy-policy-screen"
import QueryModal from "@/components/Settings/query-modal"

export default function SettingsPage() {
  const [currentScreen, setCurrentScreen] = useState<
    "settings" | "eventBookings" | "notifications" | "blockedUsers" | "helpSupport" | "privacyPolicy"
  >("settings")
  const [showQueryModal, setShowQueryModal] = useState(false)

  const handleNavigateToEventBookings = () => setCurrentScreen("eventBookings")
  const handleNavigateToNotifications = () => setCurrentScreen("notifications")
  const handleNavigateToBlockedUsers = () => setCurrentScreen("blockedUsers")
  const handleNavigateToHelpSupport = () => setCurrentScreen("helpSupport")
  const handleNavigateToPrivacyPolicy = () => setCurrentScreen("privacyPolicy")
  const handleBackToSettings = () => setCurrentScreen("settings")
  const handleOpenQueryModal = () => setShowQueryModal(true)
  const handleCloseQueryModal = () => setShowQueryModal(false)

  return (
    <div className="w-full bg-black min-h-screen">
      {currentScreen === "settings" && (
        <SettingsScreen
          onNavigateToEventBookings={handleNavigateToEventBookings}
          onNavigateToNotifications={handleNavigateToNotifications}
          onNavigateToBlockedUsers={handleNavigateToBlockedUsers}
          onNavigateToHelpSupport={handleNavigateToHelpSupport}
          onNavigateToPrivacyPolicy={handleNavigateToPrivacyPolicy}
        />
      )}
      {currentScreen === "eventBookings" && <EventBookingsScreen onBack={handleBackToSettings} />}
      {currentScreen === "notifications" && <NotificationsScreen onBack={handleBackToSettings} />}
      {currentScreen === "blockedUsers" && <BlockedUsersScreen onBack={handleBackToSettings} />}
      {currentScreen === "helpSupport" && (
        <HelpSupportScreen onBack={handleBackToSettings} onWriteQuery={handleOpenQueryModal} />
      )}
      {currentScreen === "privacyPolicy" && <PrivacyPolicyScreen onBack={handleBackToSettings} />}

      <QueryModal isOpen={showQueryModal} onClose={handleCloseQueryModal} />
    </div>
  )
}
