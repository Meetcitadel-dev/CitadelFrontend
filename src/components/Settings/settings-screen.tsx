import { useState, useEffect } from "react"
import profileImage from "@/assets/a college boy.png"

import { Calendar, Bell, Ban, Headphones, FileText, LogOut, Trash2 } from "lucide-react"
import SettingsHeader from "./settings-header"
import ProfileSection from "./profile-section"
import SettingsMenuItem from "./settings-menu-item"
import { getCurrentUserProfile } from "@/lib/api"
import { getAuthToken } from "@/lib/utils"

interface SettingsScreenProps {
  onNavigateToEventBookings?: () => void
  onNavigateToNotifications?: () => void
  onNavigateToBlockedUsers?: () => void
  onNavigateToHelpSupport?: () => void
  onNavigateToPrivacyPolicy?: () => void
  onBack?: () => void
}

interface UserProfile {
  name: string
  university: string
  profileImage: string
}

export default function SettingsScreen({
  onNavigateToEventBookings,
  onNavigateToNotifications,
  onNavigateToBlockedUsers,
  onNavigateToHelpSupport,
  onNavigateToPrivacyPolicy,
  onBack,
}: SettingsScreenProps) {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Loading...",
    university: "Loading...",
    profileImage: profileImage
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          console.error('No authentication token found')
          return
        }

        const response = await getCurrentUserProfile(token)
        if (response.success) {
          const profileData = response.data
          setUserProfile({
            name: profileData.name,
            university: profileData.university?.name || "University not set",
            profileImage: profileData.images?.[0]?.cloudfrontUrl || profileImage
          })
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleDeleteAccount = () => {
    // TODO: Implement delete account functionality
    console.log('Delete account clicked')
    // This would typically open a confirmation modal
  }

  const menuItems = [
    { icon: Calendar, title: "Event Bookings", onClick: onNavigateToEventBookings },
    { icon: Bell, title: "Notifications", onClick: onNavigateToNotifications },
    { icon: Ban, title: "Blocked users", onClick: onNavigateToBlockedUsers },
    { icon: Headphones, title: "Help & Support", onClick: onNavigateToHelpSupport },
    { icon: FileText, title: "Privacy policy and T&C", onClick: onNavigateToPrivacyPolicy },
    { icon: LogOut, title: "Log Out" },
    { icon: Trash2, title: "Delete account", onClick: handleDeleteAccount, isDestructive: true },
  ]

  return (
    <div className="w-full min-h-screen bg-black">
      <SettingsHeader title="Settings" onBack={onBack} />
      <ProfileSection 
        name={userProfile.name} 
        subtitle={userProfile.university} 
        profileImage={userProfile.profileImage} 
      />
      <div className="w-full">
        {menuItems.map((item, index) => (
          <SettingsMenuItem 
            key={index} 
            icon={item.icon} 
            title={item.title} 
            onClick={item.onClick}
            isDestructive={item.isDestructive}
          />
        ))}
      </div>
    </div>
  )
}
