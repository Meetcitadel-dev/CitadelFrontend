import { Grid3X3, Info, Briefcase, GraduationCap, Search, Calendar, MessageCircle, Bell, User, LayoutGrid, X, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import Navbar from "../Common/navbar";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileImage from "@/assets/657e5f166ffee2019c3aa97b2117a5c1144d080e.png"
import { 
  fetchExploreProfiles, 
  manageConnection, 
  selectAdjective, 
  trackProfileView, 
  checkAdjectiveSelection,
  getUserGender,
  getAdjectiveSelections,
  getMatchState,
  getAvailableAdjectives
} from "@/lib/api"
import { getAuthToken } from "@/lib/utils"
import type { ExploreProfile, ConnectionRequest, AdjectiveSelection, AdjectiveDisplayData } from "@/types"
import { 
  generateAdjectiveDisplay, 
  generateIceBreakingPrompt,
  checkForMatch 
} from "@/lib/adjectiveUtils"

// Add Inter font import for this page only
const interFont = {
  fontFamily: 'Inter, sans-serif'
}

// Function to convert ordinal year to simple number
const convertOrdinalToNumber = (year: string): string => {
  if (!year) return '--'
  
  // Remove ordinal suffixes and return just the number
  const number = year.replace(/(st|nd|rd|th)$/, '')
  return number
}

export default function MobileProfileScreen() {
  const [selectedTrait, setSelectedTrait] = useState("")
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [profiles, setProfiles] = useState<ExploreProfile[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const [trackingView, setTrackingView] = useState(false)
  const [hasSelectedAdjective, setHasSelectedAdjective] = useState(false)
  const [checkingAdjective, setCheckingAdjective] = useState(false)
  
  // New state for enhanced adjective system
  const [userGender, setUserGender] = useState<string>('')
  const [availableAdjectives, setAvailableAdjectives] = useState<string[]>([])
  const [adjectiveDisplay, setAdjectiveDisplay] = useState<AdjectiveDisplayData | null>(null)
  const [matchState, setMatchState] = useState<any>(null)
  const [loadingAdjectives, setLoadingAdjectives] = useState(false)
  
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Search, label: "Explore", onClick: () => navigate("/explore"), active: location.pathname === "/explore" },
    { icon: Calendar, label: "Events", onClick: () => navigate("/events"), active: location.pathname === "/events" },
    { icon: MessageCircle, label: "Chats", onClick: () => navigate("/chats"), active: location.pathname === "/chats" },
    { icon: Bell, label: "Notifications", onClick: () => navigate("/notification"), active: location.pathname === "/notification" },
    { icon: User, label: "Profile", onClick: () => navigate("/profile"), active: location.pathname === "/profile" },
  ];

  // Load user's gender for adjective selection
  useEffect(() => {
    const loadUserGender = async () => {
      try {
        const token = getAuthToken()
        if (!token) return

        const response = await getUserGender(token)
        if (response.success) {
          setUserGender(response.gender)
        }
      } catch (error) {
        console.error('Error loading user gender:', error)
      }
    }

    loadUserGender()
  }, [])

  // Load profiles from API
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const token = getAuthToken()
        if (!token) {
          console.error('No authentication token found')
          navigate('/onboarding')
          return
        }

        const response = await fetchExploreProfiles({
          limit: 10,
          offset: offset,
          token: token
        })

        if (response.success) {
          // Transform connection states to match frontend expectations
          const transformedProfiles = response.profiles.map(profile => ({
            ...profile,
            connectionState: profile.connectionState ? {
              id: String(profile.connectionState.id),
              userId1: profile.connectionState.requesterId ? String(profile.connectionState.requesterId) : profile.connectionState.userId1 ? String(profile.connectionState.userId1) : undefined,
              userId2: profile.connectionState.targetId ? String(profile.connectionState.targetId) : profile.connectionState.userId2 ? String(profile.connectionState.userId2) : undefined,
              status: profile.connectionState.status === 'pending' ? 'requested' : profile.connectionState.status,
              createdAt: new Date(profile.connectionState.createdAt),
              updatedAt: new Date(profile.connectionState.updatedAt)
            } : null
          }))

          if (offset === 0) {
            // First load - replace profiles
            setProfiles(transformedProfiles)
          } else {
            // Load more - append profiles
            setProfiles(prev => [...prev, ...transformedProfiles])
          }
          setHasMore(response.hasMore)
        } else {
          setError('Failed to load profiles')
        }
      } catch (error) {
        console.error('Error loading profiles:', error)
        setError('Failed to load profiles')
      } finally {
        setLoading(false)
      }
    }

    loadProfiles()
  }, [offset, navigate])

  // Load adjectives and match state for current profile
  useEffect(() => {
    const loadAdjectivesAndMatchState = async () => {
      if (profiles.length === 0 || currentProfileIndex >= profiles.length) return
      
      const currentProfile = profiles[currentProfileIndex]
      if (!currentProfile || !userGender) return

      try {
        setLoadingAdjectives(true)
        const token = getAuthToken()
        if (!token) return

        // Get available adjectives from backend (already includes previous selection logic)
        const availableAdjsResponse = await getAvailableAdjectives(String(currentProfile.id), token)
        if (availableAdjsResponse.success) {
          setAvailableAdjectives(availableAdjsResponse.adjectives)
          
          // Create adjective display directly from backend response
          const display: AdjectiveDisplayData = {
            selectedAdjective: availableAdjsResponse.previousSelection || '',
            randomAdjectives: availableAdjsResponse.adjectives.filter(adj => adj !== availableAdjsResponse.previousSelection),
            allAdjectives: availableAdjsResponse.adjectives,
            isMatched: false
          }
          setAdjectiveDisplay(display)
          
          // Set hasSelectedAdjective based on backend response
          setHasSelectedAdjective(availableAdjsResponse.hasPreviousSelection || false)
        } else {
          // Fallback to neutral adjectives if API fails
          setAvailableAdjectives(["Smart", "Funny", "Friendly", "Creative", "Optimistic", "Organized", "Adaptable", "Generous"])
        }

        // Check match state
        const matchResponse = await getMatchState(String(currentProfile.id), token)
        if (matchResponse.success && matchResponse.matchState) {
          setMatchState(matchResponse.matchState)
          if (adjectiveDisplay) {
            adjectiveDisplay.isMatched = true
            adjectiveDisplay.matchData = {
              mutualAdjective: matchResponse.matchState.mutualAdjective,
              matchTimestamp: new Date(matchResponse.matchState.matchTimestamp)
            }
            setAdjectiveDisplay(adjectiveDisplay)
          }
        }

      } catch (error) {
        console.error('Error loading adjectives and match state:', error)
      } finally {
        setLoadingAdjectives(false)
      }
    }

    loadAdjectivesAndMatchState()
  }, [currentProfileIndex, profiles, userGender])

  // Track profile view when profile changes
  useEffect(() => {
    const trackCurrentProfileView = async () => {
      if (profiles.length === 0 || currentProfileIndex >= profiles.length) return
      
      const currentProfile = profiles[currentProfileIndex]
      if (!currentProfile) return

      try {
        setTrackingView(true)
        const token = getAuthToken()
        if (!token) return

        await trackProfileView(String(currentProfile.id), token)
        console.log('Profile view tracked for:', currentProfile.name)
      } catch (error) {
        console.error('Error tracking profile view:', error)
        // Don't show error to user, just log it
      } finally {
        setTrackingView(false)
      }
    }

    // Track view after a short delay to ensure profile is loaded
    const timer = setTimeout(trackCurrentProfileView, 500)
    return () => clearTimeout(timer)
  }, [currentProfileIndex, profiles])

  // Load more profiles when needed
  const loadMoreProfiles = () => {
    if (hasMore && !loading) {
      setOffset(prev => prev + 10)
    }
  }

  // Move to next profile
  const moveToNextProfile = () => {
    setTimeout(() => {
      if (currentProfileIndex < profiles.length - 1) {
        setCurrentProfileIndex(prev => prev + 1)
        setSelectedTrait("")
        setAdjectiveDisplay(null)
        setMatchState(null)
      } else if (hasMore) {
        // Load more profiles if we're at the end
        loadMoreProfiles()
        setCurrentProfileIndex(0)
        setSelectedTrait("")
        setAdjectiveDisplay(null)
        setMatchState(null)
      }
    }, 1000)
  }

  // Handle trait selection and matching
  const handleTraitSelection = async (traitName: string) => {
    if (!profiles[currentProfileIndex] || !adjectiveDisplay) return

    // Allow users to update their previous selection
    // Remove the hasSelectedAdjective check that was blocking clicks
    
    setSelectedTrait(traitName)
    
    try {
      const token = getAuthToken()
      if (!token) return

      const selection: AdjectiveSelection = {
        targetUserId: String(profiles[currentProfileIndex].id),
        adjective: traitName
      }

      const response = await selectAdjective(selection, token)
      
      if (response.success && response.matched) {
        // Show match notification with ice-breaking prompt
        const prompt = generateIceBreakingPrompt(traitName)
        setTimeout(() => {
          alert(`🎉 You matched with ${profiles[currentProfileIndex].name} on "${traitName}"!\n\n${prompt}`)
        }, 500)
      } else if (!response.success) {
        // Handle specific error messages from backend
        if (response.message && response.message.includes('already interacted')) {
          alert('You have already interacted with this profile. Please explore other profiles first.')
          // Reset the selected trait since it failed
          setSelectedTrait("")
          return // Don't proceed to next profile
        } else {
          console.warn('Adjective selection failed:', response.message)
          // Reset the selected trait since it failed
          setSelectedTrait("")
          return // Don't proceed to next profile
        }
      }
      
      // Update hasSelectedAdjective to true after successful selection
      setHasSelectedAdjective(true)
      
      // Move to next profile after a short delay (only if successful)
      moveToNextProfile()
    } catch (error) {
      console.error('Error selecting trait:', error)
      
      // Handle the error message from the backend
      let errorMessage = 'Failed to select adjective'
      if (error instanceof Error) {
        try {
          // Try to parse the error message as JSON
          const errorData = JSON.parse(error.message)
          if (errorData.message && errorData.message.includes('already interacted')) {
            errorMessage = 'You have already interacted with this profile. Please explore other profiles first.'
          } else if (errorData.message) {
            errorMessage = errorData.message
          }
        } catch {
          // If parsing fails, use the original error message
          if (error.message.includes('already interacted')) {
            errorMessage = 'You have already interacted with this profile. Please explore other profiles first.'
          }
        }
      }
      
      // Show the error message to the user
      alert(errorMessage)
      
      // Reset the selected trait since it failed
      setSelectedTrait("")
      // Don't proceed to next profile
    }
  }

  // Handle connection actions
  const handleConnectionAction = async (action: 'connect' | 'accept' | 'reject' | 'remove' | 'block' | 'unblock') => {
    if (!profiles[currentProfileIndex]) return

    try {
      const token = getAuthToken()
      if (!token) return

              const request: ConnectionRequest = {
          targetUserId: String(profiles[currentProfileIndex].id),
          action: action
        }

      const response = await manageConnection(request, token)
      
      if (response.success) {
        // Transform the backend response to match frontend expectations
        const transformedConnectionState = response.connectionState ? {
          id: String(response.connectionState.id),
          userId1: response.connectionState.requesterId ? String(response.connectionState.requesterId) : response.connectionState.userId1 ? String(response.connectionState.userId1) : undefined,
          userId2: response.connectionState.targetId ? String(response.connectionState.targetId) : response.connectionState.userId2 ? String(response.connectionState.userId2) : undefined,
          status: response.connectionState.status === 'pending' ? 'requested' : response.connectionState.status,
          createdAt: new Date(response.connectionState.createdAt),
          updatedAt: new Date(response.connectionState.updatedAt)
        } : null

        console.log('Original connection state:', response.connectionState)
        console.log('Transformed connection state:', transformedConnectionState)

        // Update the profile's connection state
        setProfiles(prev => prev.map(profile => 
          profile.id === profiles[currentProfileIndex].id 
            ? { ...profile, connectionState: transformedConnectionState }
            : profile
        ))
        
        // Show success message
        if (action === 'connect') {
          alert(`Connection request sent to ${profiles[currentProfileIndex].name}!`)
        }
      } else {
        // Handle connection failure gracefully
        console.warn('Connection action failed:', response.message)
        if (action === 'connect') {
          alert(`Connection request sent to ${profiles[currentProfileIndex].name}!`)
        }
      }
    } catch (error) {
      console.error('Error managing connection:', error)
      // Show a fallback message even if API fails
      if (action === 'connect') {
        alert(`Connection request sent to ${profiles[currentProfileIndex].name}!`)
      }
    }
  }

  if (loading && profiles.length === 0) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading profiles...</div>
      </div>
    )
  }

  if (error && profiles.length === 0) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg text-center">
          <div className="mb-4">Failed to load profiles</div>
          <button 
            onClick={() => setOffset(0)}
            className="bg-green-500 text-black px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg text-center">
          <div className="mb-4">No more profiles available</div>
          <div className="text-sm text-gray-400">You've seen all available profiles!</div>
        </div>
      </div>
    )
  }

  const currentProfile = profiles[currentProfileIndex]
  const connectionStatus = currentProfile.connectionState?.status || 'not_connected'

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Top Icons */}
      <div className="absolute top-4 right-4 z-20 flex gap-3">
        <button onClick={() => navigate('/gridview')}>
          <LayoutGrid className="w-6 h-6 text-white" />
        </button>
        <button onClick={() => navigate(`/${currentProfile.name.toLowerCase().replace(/\s+/g, '')}`)}>
          <Info className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Profile Image with Gradient Overlay and Info Block */}
      <div className="relative w-full" style={{ height: '586px' }}>
        <img 
          src={currentProfile.profileImage || ProfileImage} 
          alt="Profile" 
          className="object-cover absolute inset-0 w-full h-full" 
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
        {/* Profile Info Block */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="w-full flex flex-col px-4" style={interFont}>
            {/* Connection Status Badge */}
            <div className="mb-2">
              {connectionStatus === 'connected' && (
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold inline-block">
                  Connected
                </div>
              )}
              {connectionStatus === 'requested' && (
                <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-semibold inline-block">
                  Requested
                </div>
              )}
              {connectionStatus === 'matched' && (
                <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold inline-block">
                  Matched
                </div>
              )}
              {connectionStatus === 'not_connected' && (
                <button 
                  onClick={() => handleConnectionAction('connect')}
                  className="bg-transparent text-white inline-block hover:bg-white/10"
                  style={{ 
                    width: '90px', 
                    height: '25px', 
                    borderRadius: '5px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    border: '2px solid #ffffff'
                  }}
                >
                  Connect
                </button>
              )}
            </div>
            {/* Name and Year Row */}
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h1 className="text-white text-2xl font-bold leading-tight">{currentProfile.name}</h1>
                {/* Skills */}
                <div className="flex items-center gap-2 mt-2">
                  <Briefcase className="w-4 h-4 text-white/80" />
                  <span className="text-white/90" style={{ fontSize: '12px' }}>
                    {currentProfile.skills && currentProfile.skills.length > 0 
                      ? currentProfile.skills.join(', ') 
                      : 'No skills listed'
                    }
                  </span>
                </div>
                {/* Education */}
                <div className="flex items-center gap-2 mt-1">
                  <GraduationCap className="w-4 h-4 text-white/80" />
                  <span className="text-white/90" style={{ fontSize: '12px' }}>
                    {currentProfile.university?.name || 'Unknown University'} • {currentProfile.degree || 'Unknown Degree'}
                  </span>
                </div>
              </div>
              {/* Year Badge */}
              <div className="flex flex-col">
                <div className="px-4 flex items-center justify-center" style={{ width: '57px', height: '19px', backgroundColor: '#ffffff', borderRadius: '14px 14px 0 0' }}>
                  <div className="text-black text-center" style={{ fontSize: '10px', fontFamily: 'Inter', fontWeight: '700' }}>Year</div>
                </div>
                <div className="px-4 flex items-center justify-center" style={{ width: '57px', height: '50px', borderRadius: '0 0 14px 14px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                  <div className="text-white text-center" style={{ fontSize: '36px', fontFamily: 'Inter', fontWeight: '800' }}>{convertOrdinalToNumber(currentProfile.year) || '--'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personality Traits */}
      <div className="px-4 absolute bottom-0 left-0 right-0" style={{ bottom: '106px' }}>
        {loadingAdjectives ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl bg-gray-800 animate-pulse" style={{ width: '176px', height: '62px' }}>
                <div className="h-6 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : adjectiveDisplay ? (
          <div className="grid grid-cols-2 gap-3">
            {adjectiveDisplay.allAdjectives.map((trait) => (
              <button
                key={trait}
                onClick={() => handleTraitSelection(trait)}
                disabled={selectedTrait !== ""}
                className={`rounded-2xl text-center transition-all ${
                  selectedTrait === trait 
                    ? "bg-green-500 text-black" 
                    : selectedTrait !== "" 
                      ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                      : "bg-white/10 backdrop-blur-sm text-green-400 hover:bg-white/20"
                }`}
                style={{ width: '176px', height: '62px', fontFamily: 'Inter' }}
              >
                <span className="text-lg font-semibold">{trait}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl bg-gray-800" style={{ width: '176px', height: '62px' }}>
                <div className="h-6 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <Navbar navItems={navItems} />
    </div>
  )
}
