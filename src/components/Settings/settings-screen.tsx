import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, HelpCircle, Shield, FileText, LogOut, Trash2 } from "lucide-react"
// Remove the hardcoded profile image import
import SettingsHeader from "./settings-header"
import ProfileSection from "./profile-section"
import SettingsMenuItem from "./settings-menu-item"
import ConfirmationModal from "./confirmation-modal"
import LogoutModal from "./logout-modal"
import { getCurrentUserProfile, deleteUserAccount, logoutSession } from "@/lib/api"
import { getAuthToken, removeAuthToken } from "@/lib/utils"

// Use Lucide icons for all menu items
const EventBookingsIcon = Calendar
const HelpSupportIcon = HelpCircle
const PrivacyPolicyIcon = Shield
const TermsConditionsIcon = FileText
const LogOutIcon = LogOut
const DeleteAccountIcon = Trash2

interface SettingsScreenProps {
  onNavigateToEventBookings?: () => void
  onNavigateToHelpSupport?: () => void
  onNavigateToPrivacyPolicy?: () => void
  onNavigateToTermsConditions?: () => void
  onBack?: () => void
}

interface UserProfile {
  id: string
  name: string
  university: string
  profileImage: string
}

export default function SettingsScreen({
  onNavigateToEventBookings,
  onNavigateToHelpSupport,
  onNavigateToPrivacyPolicy,
  onNavigateToTermsConditions,
  onBack,
}: SettingsScreenProps) {
  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "",
    name: "Loading...",
    university: "Loading...",
    profileImage: "/placeholder.svg" // Use a generic placeholder instead of someone else's photo
  })
  const [, setLoading] = useState(true)
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
            id: String(profileData.id),
            name: profileData.name,
            university: profileData.university?.name || "University not set",
            profileImage: profileData.images?.[0]?.cloudfrontUrl || "/placeholder.svg"
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
      // Tell backend to revoke refresh token and clear cookies
      try { await logoutSession() } catch {}
      // Clear auth token locally
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
    { icon: EventBookingsIcon, title: "Event Bookings", onClick: onNavigateToEventBookings },
    { icon: HelpSupportIcon, title: "Help & Support", onClick: onNavigateToHelpSupport },
    { icon: PrivacyPolicyIcon, title: "Privacy policy", onClick: onNavigateToPrivacyPolicy },
    { icon: TermsConditionsIcon, title: "Terms & Conditions", onClick: onNavigateToTermsConditions },
    { icon: LogOutIcon, title: "Log Out", onClick: handleLogout },
    { icon: DeleteAccountIcon, title: "Delete account", onClick: handleDeleteAccount, isDestructive: true },
  ]

  return (
    <div className="w-full min-h-screen bg-black flex flex-col">
      <div className="flex-1">
        <SettingsHeader title="settings" onBack={onBack} showBackButton={false} />
        <ProfileSection
          name={userProfile.name}
          profileImage={userProfile.profileImage}
          userId={userProfile.id}
        />
      </div>
      <div className="w-full" style={{ marginTop: '30px' }}>
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
