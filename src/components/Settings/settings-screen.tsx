import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import profileImage from "@/assets/a college boy.png"

import { Calendar, Bell, Ban, Headphones, FileText, LogOut, Trash2 } from "lucide-react"
import SettingsHeader from "./settings-header"
import ProfileSection from "./profile-section"
import SettingsMenuItem from "./settings-menu-item"
import ConfirmationModal from "./confirmation-modal"
import LogoutModal from "./logout-modal"
import { getCurrentUserProfile, deleteUserAccount } from "@/lib/api"
import { getAuthToken, removeAuthToken } from "@/lib/utils"

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
  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Loading...",
    university: "Loading...",
    profileImage: profileImage
  })
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

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
    setShowDeleteModal(true)
  }

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const handleConfirmDelete = async () => {
    try {
      setIsProcessing(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No authentication token found')
        return
      }

      // Call delete account API
      const response = await deleteUserAccount(token)
      if (response.success) {
        console.log('Account deleted successfully')
        // Clear auth token
        removeAuthToken()
        // Redirect to onboarding/login
        navigate('/onboarding')
      } else {
        console.error('Failed to delete account:', response.message)
        alert('Failed to delete account. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('An error occurred while deleting your account. Please try again.')
    } finally {
      setIsProcessing(false)
      setShowDeleteModal(false)
    }
  }

  const handleConfirmLogout = async () => {
    try {
      setIsProcessing(true)
      // Clear auth token
      removeAuthToken()
      console.log('User logged out successfully')
      // Redirect to onboarding/login
      navigate('/onboarding')
    } catch (error) {
      console.error('Error during logout:', error)
      alert('An error occurred during logout. Please try again.')
    } finally {
      setIsProcessing(false)
      setShowLogoutModal(false)
    }
  }

  const handleCancelLogout = () => {
    setShowLogoutModal(false)
  }

  const menuItems = [
    { icon: Calendar, title: "Event Bookings", onClick: onNavigateToEventBookings },
    { icon: Bell, title: "Notifications", onClick: onNavigateToNotifications },
    { icon: Ban, title: "Blocked users", onClick: onNavigateToBlockedUsers },
    { icon: Headphones, title: "Help & Support", onClick: onNavigateToHelpSupport },
    { icon: FileText, title: "Privacy policy and T&C", onClick: onNavigateToPrivacyPolicy },
    { icon: LogOut, title: "Log Out", onClick: handleLogout },
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

      {/* Delete Account Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmText={isProcessing ? "Deleting..." : "Yes"}
        cancelText="No"
        icon="delete"
        isDestructive={true}
      />

      {/* Log Out Modal - Using dedicated component like working example */}
      <LogoutModal 
        isOpen={showLogoutModal} 
        onConfirm={handleConfirmLogout} 
        onCancel={handleCancelLogout}
        isProcessing={isProcessing}
      />
    </div>
  )
}
