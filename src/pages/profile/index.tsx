
import {
  Briefcase,
  GraduationCap,
  Search,
  Calendar,
  MessageCircle,
  Bell,
  User,
  Settings,
  MoreVertical,
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
// Removed unused ProfileImage import
import Navbar from "@/components/Common/navbar"
import ProfileAvatar from "@/components/Common/ProfileAvatar"
import { getCurrentUserProfile, getUserConnectionsCount } from "@/lib/api"
import { getAuthToken } from "@/lib/utils"

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
  profileImage?: string | null;
  uploadedImages?: string[];
  // Slot-based display (0 profile, 1-4 gallery)
  slots?: Array<{ slot: number; url: string | null }>;
  connectionsCount?: number; // Updated to reflect actual connections
}

export default function MobileProfileScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [connectionsCount, setConnectionsCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

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
        const token = getAuthToken()
        if (!token) {
          console.error('No authentication token found')
          return
        }

        // Fetch user profile data
        const profileResponse = await getCurrentUserProfile(token)
        if (profileResponse.success) {
          // Map the API response to our expected format
          const profileData = profileResponse.data
          console.log('Profile data received:', profileData)
          console.log('Images from API:', profileData.images)
          
          const mappedProfile = {
            id: profileData.id.toString(),
            name: profileData.name,
            email: profileData.email,
            university: profileData.university?.name || '',
            degree: profileData.degree || '',
            year: profileData.year || '',
            skills: profileData.skills || [],
            aboutMe: profileData.aboutMe || undefined,
            sports: profileData.sports || undefined,
            movies: profileData.movies || undefined,
            tvShows: profileData.tvShows || undefined,
            teams: profileData.teams || undefined,
            portfolioLink: profileData.portfolioLink || undefined,
            phoneNumber: profileData.phoneNumber || undefined,
            // Use slot 0 as profile image when provided; no fallback to legacy images
            profileImage: profileData.slots?.find((s: any) => s.slot === 0)?.image?.cloudfrontUrl || null,
            // Build slots array 0..4; use only slots data, no fallback to legacy images
            slots: [0,1,2,3,4].map((i) => {
              const slotUrl = profileData.slots?.find((s: any) => s.slot === i)?.image?.cloudfrontUrl
              if (slotUrl) return { slot: i, url: slotUrl }
              return { slot: i, url: null }
            }),
            // Legacy gallery (not used for primary render anymore)
            uploadedImages: (profileData.images?.slice(1) || []).map((img: any) => img.cloudfrontUrl),
            connectionsCount: 0 // We'll update this with actual connections count
          }
          
          console.log('Mapped profile:', mappedProfile)
          console.log('Profile image URL:', mappedProfile.profileImage)
          console.log('Gallery images:', mappedProfile.uploadedImages)
          
          setUserProfile(mappedProfile)
        }

        // Fetch actual connections count
        const connectionsResponse = await getUserConnectionsCount(token)
        if (connectionsResponse.success) {
          setConnectionsCount(connectionsResponse.connectionsCount)
          console.log('Connections count:', connectionsResponse.connectionsCount)
        } else {
          console.error('Failed to fetch connections count:', connectionsResponse.message)
          setConnectionsCount(0)
        }

        // No need to fetch images separately since they're included in profile response
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  // Use user data or fallback to defaults
  const profile: UserProfile = userProfile || {
    id: "0",
    email: "",
    name: "Your Name",
    university: "Your University",
    degree: "Your Degree",
    year: "1",
    skills: [],
    aboutMe: undefined,
    sports: undefined,
    movies: undefined,
    tvShows: undefined,
    teams: undefined,
    portfolioLink: undefined,
    profileImage: undefined,
    uploadedImages: [],
    connectionsCount: 0,
    slots: [
      { slot: 0, url: null },
      { slot: 1, url: null },
      { slot: 2, url: null },
      { slot: 3, url: null },
      { slot: 4, url: null },
    ],
  }

  // Profile image is now handled by ProfileAvatar component


  // Removed CORS proxy indirection; images load directly from CDN

  console.log('Render - Profile data:', profile)
  console.log('Render - Profile slots:', profile.slots)
  console.log('Render - Slot 1 URL:', profile.slots?.[1]?.url)
  console.log('Render - Slot 2 URL:', profile.slots?.[2]?.url)
  console.log('Render - Slot 3 URL:', profile.slots?.[3]?.url)
  console.log('Render - Slot 4 URL:', profile.slots?.[4]?.url)

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Hide scrollbar globally for this page */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      {/* Scrollable Content Container */}
      <div className="h-full overflow-y-auto pb-20 lg:pb-8 hide-scrollbar">
        {/* Profile Image with Gradient Overlay and Info Block */}
        <div className="relative w-full h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px]">
          {/* Settings Icon - overlay, does not affect layout */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={() => navigate("/settings")}
              className="bg-black/50 backdrop-blur-md p-2.5 rounded-full hover:bg-black/70 transition-all"
            >
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
          <ProfileAvatar
            profileImage={profile.profileImage}
            userId={profile.id}
            alt="Profile"
            className="object-cover absolute inset-0 w-full h-full"
            fetchPriority="high"
            decoding="async"
            onLoad={() => console.log('Profile image loaded successfully')}
            onError={(e) => console.error('Profile image failed to load:', e)}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />

          {/* Profile Info Block */}
          <div className="absolute bottom-0 left-0 right-0 z-10 pb-4 sm:pb-6">
            <div className="w-full flex flex-col px-4 sm:px-6 md:px-8" style={interFont}>
              {/* Name and Year Row */}
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3">{profile.name}</h1>
                  {/* Skills */}
                  <div className="flex items-center gap-2 mt-2">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                    <span className="text-white/90 text-xs sm:text-sm truncate">
                      {profile.skills && profile.skills.length > 0
                        ? profile.skills.slice(0, 3).join(', ') + (profile.skills.length > 3 ? '...' : '')
                        : 'No skills listed'
                      }
                    </span>
                  </div>
                  {/* Education */}
                  <div className="flex items-center gap-2 mt-2">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                    <span className="text-white/90 text-xs sm:text-sm truncate">
                      {profile.university || 'Unknown University'} • {profile.degree || 'Unknown Degree'}
                    </span>
                  </div>
                </div>
                {/* Year Badge */}
                <div className="flex flex-col flex-shrink-0">
                  <div className="px-3 sm:px-4 flex items-center justify-center bg-white rounded-t-2xl" style={{ minWidth: '50px', height: '18px' }}>
                    <div className="text-black text-center text-[9px] sm:text-[10px] font-bold">Year</div>
                  </div>
                  <div className="px-3 sm:px-4 flex items-center justify-center rounded-b-2xl bg-white/20 backdrop-blur-sm" style={{ minWidth: '50px', height: '48px' }}>
                    <div className="text-white text-center text-3xl sm:text-4xl font-extrabold">{convertOrdinalToNumber(profile.year) || '--'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Bottom Content Section */}
        <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 space-y-4 sm:space-y-6" style={interFont}>
          {/* Three Dots Menu, Edit Profile Button, and Friends Count */}
          <div className="flex items-center gap-3">
            {/* Three Dots Menu */}
            <button className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-white/20 hover:bg-white/20 transition-all">
              <MoreVertical className="w-5 h-5 text-white" />
            </button>

            {/* Edit Profile Button */}
            <button
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl py-3 px-6 transition-all shadow-lg shadow-green-500/20"
              onClick={() => navigate("/edit-profile")}
            >
              <span className="text-black text-sm sm:text-base font-semibold">Edit Profile</span>
            </button>

            {/* Friends Count */}
            <div className="text-right">
              <div className="text-white text-lg sm:text-xl font-bold">{connectionsCount}</div>
              <div className="text-white/60 text-sm">Friends</div>
            </div>
          </div>

          {/* User Link Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <span className="text-green-400 text-base">
              {profile.portfolioLink || '--'}
            </span>
          </div>

          {/* About Me Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <h3 className="text-white text-xl font-bold mb-3">About me</h3>
            <div className="space-y-3">
              <p className="text-white/80 text-sm leading-relaxed">
                {profile.aboutMe || '--'}
              </p>
            </div>
          </div>

          {/* Sports I Play Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <h3 className="text-white text-xl font-bold mb-3">Sports I play</h3>
            <p className="text-green-400 text-lg font-medium">{profile.sports || '--'}</p>
          </div>

          {/* Photo Gallery Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            {profile.slots?.[1]?.url ? (
              <img
                src={profile.slots[1].url}
                alt="Profile Gallery"
                className="w-full h-auto object-contain rounded-xl"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                onLoad={() => console.log('Gallery image 1 loaded:', profile.slots?.[1]?.url)}
                onError={(e) => console.error('Gallery image 1 failed to load:', profile.slots?.[1]?.url, e)}
              />
            ) : (
              <div className="flex items-center justify-center h-32 rounded-xl bg-gray-800/50 border border-gray-600/30">
                <span className="text-gray-400 text-sm font-medium">No image uploaded</span>
              </div>
            )}
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <h3 className="text-white text-xl font-bold mb-3">Movies I like</h3>
            <p className="text-green-400 text-lg font-medium">{profile.movies || '--'}</p>
          </div>

          {/* Photo Gallery Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            {profile.slots?.[2]?.url ? (
              <img
                src={profile.slots[2].url}
                alt="Profile Gallery"
                className="w-full h-auto object-contain rounded-xl"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                onLoad={() => console.log('Gallery image 2 loaded:', profile.slots?.[2]?.url)}
                onError={(e) => console.error('Gallery image 2 failed to load:', profile.slots?.[2]?.url, e)}
              />
            ) : (
              <div className="flex items-center justify-center h-32 rounded-xl bg-gray-800/50 border border-gray-600/30">
                <span className="text-gray-400 text-sm font-medium">No image uploaded</span>
              </div>
            )}
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <h3 className="text-white text-xl font-bold mb-3">TV Shows I watch</h3>
            <p className="text-green-400 text-lg font-medium">{profile.tvShows || '--'}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            {profile.slots?.[3]?.url ? (
              <img
                src={profile.slots[3].url}
                alt="Profile Gallery"
                className="w-full h-auto object-contain rounded-xl"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                onLoad={() => console.log('Gallery image 3 loaded:', profile.slots?.[3]?.url)}
                onError={(e) => console.error('Gallery image 3 failed to load:', profile.slots?.[3]?.url, e)}
              />
            ) : (
              <div className="flex items-center justify-center h-32 rounded-xl bg-gray-800/50 border border-gray-600/30">
                <span className="text-gray-400 text-sm font-medium">No image uploaded</span>
              </div>
            )}
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <h3 className="text-white text-xl font-bold mb-3">Teams I support</h3>
            <p className="text-green-400 text-lg font-medium">{profile.teams || '--'}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            {profile.slots?.[4]?.url ? (
              <img
                src={profile.slots[4].url}
                alt="Profile Gallery"
                className="w-full h-auto object-contain rounded-xl"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                onLoad={() => console.log('Gallery image 4 loaded:', profile.slots?.[4]?.url)}
                onError={(e) => console.error('Gallery image 4 failed to load:', profile.slots?.[4]?.url, e)}
              />
            ) : (
              <div className="flex items-center justify-center h-32 rounded-xl bg-gray-800/50 border border-gray-600/30">
                <span className="text-gray-400 text-sm font-medium">No image uploaded</span>
              </div>
            )}
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
