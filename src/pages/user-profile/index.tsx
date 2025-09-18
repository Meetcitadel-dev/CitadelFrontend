import {
  Briefcase,
  GraduationCap,
  Search,
  Calendar,
  MessageCircle,
  Bell,
  User,
  MoreVertical,
  ArrowLeft,
} from "lucide-react"
import { useNavigate, useLocation, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import ProfileImage from "@/assets/657e5f166ffee2019c3aa97b2117a5c1144d080e.png"
import Navbar from "@/components/Common/navbar"
import ForestProfile from "@/assets/man, forest background behind.png"
import Realisticprofile from "@/assets/man, realsitic background behind.png"
import Oceanprofile from "@/assets/man, ocean background behind.png"
import Buildingprofile from "@/assets/man, building background behind.png"
import { getAuthToken } from "@/lib/utils"
import { fetchUserProfileByName, manageConnection } from "@/lib/api"

// Add Inter font import for this page only
const interFont = {
  fontFamily: "Inter, sans-serif",
}

// Function to convert ordinal year to simple number
const convertOrdinalToNumber = (year: string): string => {
  if (!year) return '--'
  
  // Remove ordinal suffixes and return just the number
  const number = year.replace(/(st|nd|rd|th)$/, '')
  return number
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  university: string;
  degree: string;
  year: string;
  skills: string[];
  aboutMe?: string;
  sports?: string;
  movies?: string;
  tvShows?: string;
  teams?: string;
  portfolioLink?: string;
  phoneNumber?: string;
  profileImage?: string;
  uploadedImages?: string[];
  // Updated to reflect actual connection counts
  connectionsCount?: number; // Total connections the profile has
  mutualConnectionsCount?: number; // Common connections between current user and profile
  connectionStatus?: 'connected' | 'requested' | 'not_connected' | 'blocked';
}

export default function UserProfileScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { name } = useParams<{ name: string }>()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navItems = [
    { icon: Search, label: "Explore", onClick: () => navigate("/explore"), active: location.pathname === "/explore" },
    { icon: Calendar, label: "Events", onClick: () => navigate("/events"), active: location.pathname === "/events" },
    { icon: MessageCircle, label: "Chats", onClick: () => navigate("/chats"), active: location.pathname === "/chats" },
    { icon: Bell, label: "Notifications", onClick: () => navigate("/notification"), active: location.pathname === "/notification" },
    { icon: User, label: "Profile", onClick: () => navigate("/profile"), active: location.pathname === "/profile" },
  ]

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const token = getAuthToken()
        if (!token) {
          console.error('No authentication token found')
          navigate('/onboarding')
          return
        }

        if (!name) {
          setError('Username is required')
          return
        }

        // Fetch user profile by name
        const response = await fetchUserProfileByName(name, token)
        
        if (response.success && response.data) {
          const profileData = response.data
          console.log('User profile data received:', profileData)
          
          const mappedProfile: UserProfile = {
            id: profileData.id,
            name: profileData.name,
            email: profileData.email,
            university: profileData.university?.name || '',
            degree: profileData.degree || '',
            year: profileData.year || '',
            skills: profileData.skills || [],
            aboutMe: profileData.aboutMe,
            sports: profileData.sports,
            movies: profileData.movies,
            tvShows: profileData.tvShows,
            teams: profileData.teams,
            portfolioLink: profileData.portfolioLink,
            phoneNumber: profileData.phoneNumber,
            profileImage: profileData.images?.[0]?.cloudfrontUrl,
            uploadedImages: profileData.images?.map(img => img.cloudfrontUrl) || [],
            // Updated to reflect actual connection counts
            connectionsCount: profileData.connections?.length || 0,
            mutualConnectionsCount: profileData.mutualConnections?.length || 0,
            connectionStatus: profileData.connectionState?.status || 'not_connected'
          }
          
          console.log('Mapped user profile:', mappedProfile)
          setUserProfile(mappedProfile)
        } else {
          setError(response.message || 'Failed to load user profile')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError('Failed to load user profile')
      } finally {
        setLoading(false)
      }
    }

    if (name) {
      fetchUserData()
    }
  }, [name, navigate])

  const handleMessageClick = () => {
    // Only allow messaging if connected
    if (userProfile?.connectionStatus !== 'connected') {
      alert('You need to be connected with this user to send messages.')
      return
    }
    // TODO: Implement message functionality
    // This could navigate to chat or open a message modal
    navigate(`/chats?user=${userProfile?.id}`)
  }

  const handleConnectionAction = async (action: 'connect' | 'accept' | 'reject' | 'remove' | 'block' | 'unblock') => {
    if (!userProfile) return

    try {
      const token = getAuthToken()
      if (!token) return

      const request = {
        targetUserId: userProfile.id,
        action: action
      }

      const response = await manageConnection(request, token)
      
      if (response.success) {
        // Update the connection status
        setUserProfile(prev => prev ? {
          ...prev,
          connectionStatus: response.connectionState?.status || 'not_connected'
        } : null)
        
        // Show success message
        if (action === 'connect') {
          alert(`Connection request sent to ${userProfile.name}!`)
        }
      } else {
        console.warn('Connection action failed:', response.message)
        if (action === 'connect') {
          alert(`Connection request sent to ${userProfile.name}!`)
        }
      }
    } catch (error) {
      console.error('Error managing connection:', error)
      // Show a fallback message even if API fails
      if (action === 'connect') {
        alert(`Connection request sent to ${userProfile.name}!`)
      }
    }
  }

  if (loading) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  if (error || !userProfile) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg text-center">
          <div className="mb-4">Failed to load profile</div>
          <button 
            onClick={() => navigate(-1)}
            className="bg-green-500 text-black px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Get profile image (user's uploaded image or default)
  const profileImageUrl = userProfile.profileImage || ProfileImage

  // Get gallery images (user's uploaded images or defaults)
  const galleryImages = userProfile.uploadedImages || [ForestProfile, Realisticprofile, Oceanprofile, Buildingprofile]

  // Removed CORS proxy indirection; images load directly from CDN

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Hide scrollbar globally for this page */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      {/* Scrollable Content Container */}
      <div className="h-full overflow-y-auto pb-20 hide-scrollbar">
        {/* Top Icons */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Profile Image with Gradient Overlay and Info Block */}
        <div className="relative h-[65vh] w-full">
          <img
            src={profileImageUrl || "/placeholder.svg"}
            alt="Profile"
            className="object-cover absolute inset-0 w-full h-full"
            fetchPriority="high"
            decoding="async"
            onLoad={() => console.log('Profile image loaded successfully:', profileImageUrl)}
            onError={(e) => console.error('Profile image failed to load:', profileImageUrl, e)}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

          {/* Profile Info Block */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <div className="w-full flex flex-col px-4" style={interFont}>
              {/* Connection Status Badge */}
              <div className="mb-2">
                {userProfile.connectionStatus === 'connected' && (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold inline-block">
                    Connected
                  </div>
                )}
                {userProfile.connectionStatus === 'requested' && (
                  <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-semibold inline-block">
                    Requested
                  </div>
                )}
                {userProfile.connectionStatus === 'not_connected' && (
                  <button 
                    onClick={() => handleConnectionAction('connect')}
                    className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold inline-block hover:bg-blue-600"
                  >
                    Connect
                  </button>
                )}
              </div>
              {/* Name and Year Row */}
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <h1 className="text-white text-2xl font-bold leading-tight">{userProfile.name}</h1>
                  {/* Skills */}
                  <div className="flex items-center gap-2 mt-2">
                    <Briefcase className="w-4 h-4 text-white/80" />
                    <span className="text-white/90 text-sm">
                      {userProfile.skills && userProfile.skills.length > 0 ? userProfile.skills.join(', ') : '--'}
                    </span>
                  </div>
                  {/* Education */}
                  <div className="flex items-center gap-2 mt-1">
                    <GraduationCap className="w-4 h-4 text-white/80" />
                    <span className="text-white/90 text-sm">
                      {userProfile.university && userProfile.degree ? `${userProfile.university} • ${userProfile.degree}` : '--'}
                    </span>
                  </div>
                </div>
                {/* Year Badge */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                  <div className="text-white/60 text-xs font-medium text-center">Year</div>
                  <div className="text-white text-2xl font-bold text-center">{convertOrdinalToNumber(userProfile.year) || '--'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Bottom Content Section */}
        <div className="px-4 pt-4 space-y-4" style={interFont}>
          {/* Action Buttons and Counts Row */}
          <div className="flex items-center gap-3">
            {/* More Options Button (Dark Green) */}
            <button className="bg-green-800 rounded-2xl p-3 border border-green-700">
              <MoreVertical className="w-5 h-5 text-green-300" />
            </button>

            {/* Message Button (Bright Green) */}
            <button 
              className={`flex-1 rounded-2xl py-3 px-6 transition-colors ${
                userProfile.connectionStatus === 'connected' 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              onClick={handleMessageClick}
              disabled={userProfile.connectionStatus !== 'connected'}
            >
              <span className="text-base font-semibold">
                {userProfile.connectionStatus === 'connected' ? 'Message' : 'Connect to Message'}
              </span>
            </button>

            {/* Friends and Mutuals Counts */}
            <div className="flex gap-4">
              {/* Friends Count */}
              <div className="text-center">
                <div className="text-white text-xl font-bold">{userProfile.connectionsCount || 0}</div>
                <div className="text-white/60 text-sm">Friends</div>
              </div>
              
              {/* Mutuals Count */}
              <div className="text-center">
                <div className="text-white text-xl font-bold">{userProfile.mutualConnectionsCount || 0}</div>
                <div className="text-white/60 text-sm">Mutuals</div>
              </div>
            </div>
          </div>

          {/* User Link Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <span className="text-green-400 text-base">
              {userProfile.portfolioLink || '--'}
            </span>
          </div>

          {/* About Me Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <h3 className="text-white text-xl font-bold mb-3">About me</h3>
            <div className="space-y-3">
              <p className="text-white/80 text-sm leading-relaxed">
                {userProfile.aboutMe || '--'}
              </p>
            </div>
          </div>

          {/* Sports I Play Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <h3 className="text-white text-xl font-bold mb-3">Sports I play</h3>
            <p className="text-green-400 text-lg font-medium">{userProfile.sports || '--'}</p>
          </div>

          {/* Photo Gallery Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <img
              src={galleryImages[0] || ForestProfile}
              alt="Profile Gallery"
              className="w-full h-auto object-contain rounded-xl"
              loading="lazy"
              onLoad={() => console.log('Gallery image 1 loaded:', galleryImages[0])}
              onError={(e) => console.error('Gallery image 1 failed to load:', galleryImages[0], e)}
            />
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <h3 className="text-white text-xl font-bold mb-3">Movies I like</h3>
            <p className="text-green-400 text-lg font-medium">{userProfile.movies || '--'}</p>
          </div>

          {/* Photo Gallery Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <img
              src={galleryImages[1] || Realisticprofile}
              alt="Profile Gallery"
              className="w-full h-auto object-contain rounded-xl"
              loading="lazy"
              onLoad={() => console.log('Gallery image 2 loaded:', galleryImages[1])}
              onError={(e) => console.error('Gallery image 2 failed to load:', galleryImages[1], e)}
            />
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <h3 className="text-white text-xl font-bold mb-3">TV Shows I watch</h3>
            <p className="text-green-400 text-lg font-medium">{userProfile.tvShows || '--'}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <img
              src={galleryImages[2] || Oceanprofile}
              alt="Profile Gallery"
              className="w-full h-auto object-contain rounded-xl"
              loading="lazy"
              onLoad={() => console.log('Gallery image 3 loaded:', galleryImages[2])}
              onError={(e) => console.error('Gallery image 3 failed to load:', galleryImages[2], e)}
            />
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <h3 className="text-white text-xl font-bold mb-3">Teams I support</h3>
            <p className="text-green-400 text-lg font-medium">{userProfile.teams || '--'}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <img
              src={galleryImages[3] || Buildingprofile}
              alt="Profile Gallery"
              className="w-full h-auto object-contain rounded-xl"
              loading="lazy"
              onLoad={() => console.log('Gallery image 4 loaded:', galleryImages[3])}
              onError={(e) => console.error('Gallery image 4 failed to load:', galleryImages[3], e)}
            />
          </div>
          

          {/* Extra spacing for scroll */}
          <div className="h-4"></div>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <Navbar navItems={navItems} />
      </div>
    </div>
  )
}