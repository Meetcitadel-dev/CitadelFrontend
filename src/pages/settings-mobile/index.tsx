import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Search, Calendar, User } from "lucide-react"
import SettingsScreen from "@/components/Settings/settings-screen"
import EventBookingsScreen from "@/components/Settings/event-bookings-screen"
import HelpSupportScreen from "@/components/Settings/help-support-screen"
import Navbar from "@/components/Common/navbar"

type ScreenType = "settings" | "eventBookings" | "helpSupport" | "privacyPolicy" | "termsConditions"

export default function SettingsMobilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("settings")

  const navItems = [
    { icon: Calendar, label: "Events", onClick: () => navigate("/events"), active: location.pathname === "/events" },
    { icon: Search, label: "Explore", onClick: () => navigate("/explore"), active: location.pathname === "/explore" },
    { icon: User, label: "Profile", onClick: () => navigate("/profile"), active: location.pathname === "/profile" || location.pathname === "/settings" },
  ]

  const handleBack = () => {
    if (currentScreen === "settings") {
      navigate("/explore")
    } else {
      setCurrentScreen("settings")
    }
  }

  const handleNavigateToEventBookings = () => {
    // Navigate to existing event-history page
    navigate("/event-history")
  }

  const handleNavigateToHelpSupport = () => {
    setCurrentScreen("helpSupport")
  }

  const handleNavigateToPrivacyPolicy = () => {
    setCurrentScreen("privacyPolicy")
  }

  const handleNavigateToTermsConditions = () => {
    setCurrentScreen("termsConditions")
  }

  return (
    <div className="w-full min-h-screen bg-black relative pb-20">
      {currentScreen === "settings" && (
        <SettingsScreen
          onBack={handleBack}
          onNavigateToEventBookings={handleNavigateToEventBookings}
          onNavigateToHelpSupport={handleNavigateToHelpSupport}
          onNavigateToPrivacyPolicy={handleNavigateToPrivacyPolicy}
          onNavigateToTermsConditions={handleNavigateToTermsConditions}
        />
      )}
      {currentScreen === "eventBookings" && (
        <EventBookingsScreen onBack={handleBack} />
      )}
      {currentScreen === "helpSupport" && (
        <HelpSupportScreen onBack={handleBack} />
      )}
      {currentScreen === "privacyPolicy" && (
        <div className="w-full min-h-screen bg-black text-white p-6">
          <button onClick={handleBack} className="mb-4 text-green-400">← Back</button>
          <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-white/70">Privacy policy content goes here...</p>
        </div>
      )}
      {currentScreen === "termsConditions" && (
        <div className="w-full min-h-screen bg-black text-white p-6">
          <button onClick={handleBack} className="mb-4 text-green-400">← Back</button>
          <h1 className="text-2xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-white/70">Terms and conditions content goes here...</p>
        </div>
      )}

      {/* Bottom Navigation */}
      <Navbar navItems={navItems} />
    </div>
  )
}

