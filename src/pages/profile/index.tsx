
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
  profileImage?: string;
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
            // Use slot 0 as profile image when provided; fallback to legacy images[0]
            profileImage: profileData.slots?.find((s: any) => s.slot === 0)?.image?.cloudfrontUrl
              || profileData.images?.[0]?.cloudfrontUrl,
            // Build slots array 0..4; if slots not provided by backend, fallback from images
            slots: [0,1,2,3,4].map((i) => {
              const slotUrl = profileData.slots?.find((s: any) => s.slot === i)?.image?.cloudfrontUrl
              if (slotUrl) return { slot: i, url: slotUrl }
              // Fallback: derive from legacy images array
              if (!profileData.slots || profileData.slots.length === 0) {
                const legacyUrl = profileData.images?.[i]?.cloudfrontUrl || null
                return { slot: i, url: legacyUrl }
              }
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
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Hide scrollbar globally for this page */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      {/* Scrollable Content Container */}
      <div className="h-full overflow-y-auto pb-20 hide-scrollbar">
        {/* Profile Image with Gradient Overlay and Info Block */}
        <div className="relative w-full" style={{ height: '586px' }}>
          {/* Settings Icon - overlay, does not affect layout */}
          <div className="absolute top-4 right-4 z-20">
            <button onClick={() => navigate("/settings")}> 
              <Settings className="w-6 h-6 text-white" />
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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

          {/* Profile Info Block */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <div className="w-full flex flex-col px-4" style={interFont}>
              {/* Name and Year Row */}
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <h1 className="text-white text-2xl font-bold leading-tight">{profile.name}</h1>
                  {/* Skills */}
                  <div className="flex items-center gap-2 mt-2">
                    <Briefcase className="w-4 h-4 text-white/80" />
                  <span className="text-white/90" style={{ fontSize: '12px' }}>
                    {profile.skills && profile.skills.length > 0 
                      ? profile.skills.join(', ') 
                      : 'No skills listed'
                    }
                  </span>
                  </div>
                  {/* Education */}
                  <div className="flex items-center gap-2 mt-1">
                    <GraduationCap className="w-4 h-4 text-white/80" />
                  <span className="text-white/90" style={{ fontSize: '12px' }}>
                    {profile.university || 'Unknown University'} • {profile.degree || 'Unknown Degree'}
                  </span>
                  </div>
                </div>
                {/* Year Badge */}
                <div className="flex flex-col">
                  <div className="px-4 flex items-center justify-center" style={{ width: '57px', height: '19px', backgroundColor: '#ffffff', borderRadius: '14px 14px 0 0' }}>
                    <div className="text-black text-center" style={{ fontSize: '10px', fontFamily: 'Inter', fontWeight: '700' }}>Year</div>
                  </div>
                  <div className="px-4 flex items-center justify-center" style={{ width: '57px', height: '50px', borderRadius: '0 0 14px 14px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                    <div className="text-white text-center" style={{ fontSize: '36px', fontFamily: 'Inter', fontWeight: '800' }}>{convertOrdinalToNumber(profile.year) || '--'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Bottom Content Section */}
        <div className="px-4 pt-4 space-y-4" style={interFont}>
          {/* Three Dots Menu, Edit Profile Button, and Friends Count */}
          <div className="flex items-center gap-3">
            {/* Three Dots Menu */}
            <button className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
              <MoreVertical className="w-5 h-5 text-white" />
            </button>

            {/* Edit Profile Button */}
            <button 
              className="flex-1 bg-green-500 rounded-2xl py-3 px-6"
              onClick={() => navigate("/edit-profile")}
            >
              <span className="text-black text-base font-semibold">Edit Profile</span>
            </button>

            {/* Friends Count */}
            <div className="text-right">
              <div className="text-white text-xl font-bold">{connectionsCount}</div>
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
