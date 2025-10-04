import { Info, Briefcase, GraduationCap, Search, Calendar, MessageCircle, Bell, User, LayoutGrid } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Navbar from "../Common/navbar";
import ProfileAvatar from "../Common/ProfileAvatar";
import { useNavigate, useLocation } from "react-router-dom";
// Removed unused ProfileImage import
import { 
  fetchExploreProfiles, 
  manageConnection, 
  selectAdjective, 
  trackProfileView, 
  getUserGender,
  getMatchState,
  getAvailableAdjectives,
  getConnectionStatus
} from "@/lib/api"
import { getAuthToken, prefetchImagesWithPriority } from "@/lib/utils"
import sessionManager from "@/lib/sessionManager"
import type { ExploreProfile, ConnectionRequest, AdjectiveSelection, AdjectiveDisplayData } from "@/types"
import { 
  generateIceBreakingPrompt
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
  
  // New state for enhanced adjective system
  const [userGender, setUserGender] = useState<string>('')
  const [, setAvailableAdjectives] = useState<string[]>([])
  const [adjectiveDisplay, setAdjectiveDisplay] = useState<AdjectiveDisplayData | null>(null)
  const [, setMatchState] = useState<any>(null)
  const [loadingAdjectives, setLoadingAdjectives] = useState(false)
  const [, setTrackingView] = useState(false)
  const [, setHasSelectedAdjective] = useState(false)
  
  // Session state for adjective persistence - now using global session manager
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  // Use ref to track current profile ID to break dependency chain
  const currentProfileIdRef = useRef<string | number | null>(null)
  
  // Use ref to prevent multiple API calls
  const isLoadingRef = useRef<boolean>(false)
  
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize session data on client side only
  useEffect(() => {
    // Remove window check - sessionManager handles this internally
    setCurrentProfileIndex(sessionManager.getCurrentProfileIndex())
    setProfiles(sessionManager.getProfiles())
    setSessionId(sessionManager.getSessionId())
  }, [])

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

  // Load profiles from API - always fetch fresh data
  useEffect(() => {
    const loadProfiles = async () => {
      // Prevent multiple API calls using ref
      if (isLoadingRef.current) {
        console.log('Skipping API call - already in progress')
        return
      }
      
      // Clear any cached session data to ensure fresh profile data
      if (offset === 0) {
        sessionManager.refreshSession()
      }
      
      // Always fetch fresh data from server to ensure latest profile images and connection status
      try {
        isLoadingRef.current = true
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
          // Transform connection states and profile images to match frontend expectations
          const transformedProfiles = response.profiles.map(profile => {
            // Debug: Log the profile data to understand what's being returned
            console.log('Profile data from API:', {
              id: profile.id,
              name: profile.name,
              profileImage: profile.profileImage,
              slots: (profile as any).slots,
              images: (profile as any).images
            });
            
            // Process profile image the same way as detailed profile views
            // Use slot 0 as profile image when provided; fallback to profileImage if no slots
            const processedProfileImage = (profile as any).slots?.find((s: any) => s.slot === 0)?.image?.cloudfrontUrl
              || profile.profileImage; // Fallback to profileImage if slots not available
            
            return {
              ...profile,
              profileImage: processedProfileImage, // Override with processed image
              connectionState: profile.connectionState ? {
                id: String(profile.connectionState.id),
                userId1: profile.connectionState.requesterId ? String(profile.connectionState.requesterId) : profile.connectionState.userId1 ? String(profile.connectionState.userId1) : undefined,
                userId2: profile.connectionState.targetId ? String(profile.connectionState.targetId) : profile.connectionState.userId2 ? String(profile.connectionState.userId2) : undefined,
                status: profile.connectionState.status === 'pending' ? 'requested' : profile.connectionState.status,
                createdAt: new Date(profile.connectionState.createdAt),
                updatedAt: new Date(profile.connectionState.updatedAt)
              } : null
            }
          })

          if (offset === 0) {
            // First load - replace profiles and cache them
            setProfiles(transformedProfiles)
            sessionManager.setProfiles(transformedProfiles)
          } else {
            // Load more - append profiles
            const newProfiles = [...profiles, ...transformedProfiles]
            setProfiles(newProfiles)
            sessionManager.setProfiles(newProfiles)
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
        isLoadingRef.current = false
      }
    }

    loadProfiles()
  }, [offset])

  // Removed aggressive connection status refresh to prevent multiple API calls
  // Connection status will be updated through the normal polling mechanism

  // Load adjectives and match state for current profile
  useEffect(() => {
    const loadAdjectivesAndMatchState = async () => {
      // Always run the effect, but handle conditions inside
      if (profiles.length === 0 || currentProfileIndex >= profiles.length) return
      
      const currentProfile = profiles[currentProfileIndex]
      if (!currentProfile || !userGender) return

      // Check if this is a new profile (different ID) or if adjectives haven't been loaded yet
      const currentProfileId = String(currentProfile.id)
      if (currentProfileIdRef.current === currentProfileId && adjectiveDisplay) {
        // Same profile and adjectives already loaded, don't reload
        return
      }

      // Update ref with new profile ID
      currentProfileIdRef.current = currentProfileId

      try {
        setLoadingAdjectives(true)
        const token = getAuthToken()
        if (!token) return

        // Get available adjectives from backend with session persistence
        const availableAdjsResponse = await getAvailableAdjectives(currentProfileId, token, sessionId || undefined)
        if (availableAdjsResponse.success) {
          setAvailableAdjectives(availableAdjsResponse.adjectives)
          
          // Update session ID if provided by backend and save to global session
          if (availableAdjsResponse.sessionId) {
            setSessionId(availableAdjsResponse.sessionId)
            sessionManager.setSessionId(availableAdjsResponse.sessionId)
          }
          
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
          // Create fallback display
          const fallbackDisplay: AdjectiveDisplayData = {
            selectedAdjective: '',
            randomAdjectives: ["Smart", "Funny", "Friendly", "Creative"],
            allAdjectives: ["Smart", "Funny", "Friendly", "Creative", "Optimistic", "Organized", "Adaptable", "Generous"],
            isMatched: false
          }
          setAdjectiveDisplay(fallbackDisplay)
        }

        // Check match state
        const matchResponse = await getMatchState(currentProfileId, token)
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
  }, [currentProfileIndex, userGender, sessionId, profiles.length]) // Add profiles.length to ensure it runs after profiles are loaded

  // Track profile view when profile changes
  useEffect(() => {
    const trackCurrentProfileView = async () => {
      // Always run the effect, but handle conditions inside
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
  }, [currentProfileIndex, profiles.length]) // Use profiles.length to avoid array reference changes

  // Enhanced prefetching for next profile images to make swipes instant
  useEffect(() => {
    const preloadCount = 5 // Increased from 3 for better performance
    const highPriorityUrls: string[] = []
    const lowPriorityUrls: string[] = []
    
    for (let i = 1; i <= preloadCount; i++) {
      const next = profiles[currentProfileIndex + i]
      if (next && next.profileImage) {
        if (i <= 2) {
          // First 2 images get high priority
          highPriorityUrls.push(next.profileImage)
        } else {
          // Rest get low priority
          lowPriorityUrls.push(next.profileImage)
        }
      }
    }
    
    // Prefetch high priority images immediately
    if (highPriorityUrls.length > 0) {
      prefetchImagesWithPriority(highPriorityUrls, 'high')
    }
    
    // Prefetch low priority images with delay
    if (lowPriorityUrls.length > 0) {
      setTimeout(() => {
        prefetchImagesWithPriority(lowPriorityUrls, 'low')
      }, 100)
    }
  }, [currentProfileIndex, profiles.length]) // Use profiles.length to avoid array reference changes

  // Poll connection status when pending/requested, and on tab focus
  useEffect(() => {
    // Always run the effect, but handle conditional logic inside
    let intervalId: number | undefined
    let pollCount = 0
    const MAX_POLL_ATTEMPTS = 6 // Poll for max 1 minute (6 * 10s)

    const fetchStatus = async () => {
      const currentProfile = profiles[currentProfileIndex]
      if (!currentProfile) return
      
      try {
        const token = getAuthToken()
        if (!token) return
        const res = await getConnectionStatus(String(currentProfile.id), token)
        if (res.success && res.connectionState) {
          const transformed = {
            id: String(res.connectionState.id),
            userId1: res.connectionState.requesterId ? String(res.connectionState.requesterId) : res.connectionState.userId1 ? String(res.connectionState.userId1) : undefined,
            userId2: res.connectionState.targetId ? String(res.connectionState.targetId) : res.connectionState.userId2 ? String(res.connectionState.userId2) : undefined,
            status: res.connectionState.status === 'pending' ? 'requested' : res.connectionState.status,
            createdAt: new Date(res.connectionState.createdAt),
            updatedAt: new Date(res.connectionState.updatedAt)
          }
          
          // Only update if status actually changed to prevent unnecessary re-renders
          const currentStatus = currentProfile.connectionState?.status
          if (transformed.status !== currentStatus) {
            setProfiles(prev => {
              const updated = prev.map(p => p.id === currentProfile.id ? { ...p, connectionState: transformed } : p)
              sessionManager.setProfiles(updated)
              return updated
            })
          }
          
          // Stop polling if status is no longer 'requested'
          if (transformed.status !== 'requested') {
            if (intervalId) {
              clearInterval(intervalId)
              intervalId = undefined
            }
          }
        } else if (res.success && res.connectionState === null) {
          // If connection status API returns null, but we have connection data from profile load,
          // don't override it - this handles the backend inconsistency
          console.log('Connection status API returned null, keeping existing connection state')
          
          // If we don't have any connection state from profile load either, 
          // try to fetch it from the profile endpoint as a fallback
          if (!currentProfile.connectionState) {
            console.log('No connection state found, this might be a backend data inconsistency')
          }
        }
      } catch (error) {
        console.error('Error fetching connection status:', error)
      }
      
      pollCount++
      // Stop polling after max attempts to prevent infinite polling
      if (pollCount >= MAX_POLL_ATTEMPTS && intervalId) {
        console.log('Stopping connection status polling after max attempts')
        clearInterval(intervalId)
        intervalId = undefined
      }
    }

    // Handle window check inside the effect
    if (typeof window !== 'undefined') {
      const onFocus = () => {
        pollCount = 0 // Reset poll count on focus
        fetchStatus()
      }
      window.addEventListener('focus', onFocus)

      const currentProfile = profiles[currentProfileIndex]
      const connectionStatus = currentProfile?.connectionState?.status || 'not_connected'
      
      if (currentProfile && connectionStatus === 'requested') {
        // Only poll for 'requested' status, not 'not_connected' to reduce API calls
        intervalId = window.setInterval(fetchStatus, 10000) // Poll every 10s
        // also fetch immediately once
        fetchStatus()
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        const onFocus = () => fetchStatus()
        window.removeEventListener('focus', onFocus)
        if (intervalId) window.clearInterval(intervalId)
      }
    }
  }, [currentProfileIndex, profiles.length]) // Use profiles.length to avoid array reference changes

  const navItems = [
    { icon: Search, label: "Explore", onClick: () => navigate("/explore"), active: location.pathname === "/explore" },
    { icon: Calendar, label: "Events", onClick: () => navigate("/events"), active: location.pathname === "/events" },
    { icon: MessageCircle, label: "Chats", onClick: () => navigate("/chats"), active: location.pathname === "/chats" },
    { icon: Bell, label: "Notifications", onClick: () => navigate("/notification"), active: location.pathname === "/notification" },
    { icon: User, label: "Profile", onClick: () => navigate("/profile"), active: location.pathname === "/profile" },
  ];

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
        const newIndex = currentProfileIndex + 1
        setCurrentProfileIndex(newIndex)
        sessionManager.setCurrentProfileIndex(newIndex)
        setSelectedTrait("")
        setAdjectiveDisplay(null)
        setMatchState(null)
      } else if (hasMore) {
        // Load more profiles if we're at the end
        loadMoreProfiles()
        setCurrentProfileIndex(0)
        sessionManager.setCurrentProfileIndex(0)
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

      // Optimistic UI update for immediate feedback
      if (action === 'connect' || action === 'accept' || action === 'remove' || action === 'block' || action === 'unblock') {
        const targetId = profiles[currentProfileIndex].id
        setProfiles(prev => {
          const updated = prev.map(profile => {
            if (profile.id !== targetId) return profile
            const prevState = profile.connectionState || {
              id: String(Date.now()),
              userId1: undefined,
              userId2: undefined,
              status: 'not_connected' as const,
              createdAt: new Date(),
              updatedAt: new Date()
            }
            let nextStatus = prevState.status
            if (action === 'connect') nextStatus = 'requested'
            if (action === 'accept') nextStatus = 'connected'
            if (action === 'remove') nextStatus = 'not_connected'
            if (action === 'block') nextStatus = 'blocked'
            if (action === 'unblock') nextStatus = 'not_connected'
            const nextState = {
              ...prevState,
              status: nextStatus,
              updatedAt: new Date()
            }
            return { ...profile, connectionState: nextState }
          })
          sessionManager.setProfiles(updated)
          return updated
        })
      }

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
        setProfiles(prev => {
          const updated = prev.map(profile => 
            profile.id === profiles[currentProfileIndex].id 
              ? { ...profile, connectionState: transformedConnectionState }
              : profile
          )
          sessionManager.setProfiles(updated)
          return updated
        })
        
        // Show success message
        if (action === 'connect') {
          alert(`Connection request sent to ${profiles[currentProfileIndex].name}!`)
        }
      } else {
        // Handle connection failure gracefully
        console.warn('Connection action failed:', response.message)
        alert(response.message || 'Connection action failed. Please try again.')
      }
    } catch (error) {
      console.error('Error managing connection:', error)
      // Show a fallback message even if API fails
      alert('Something went wrong managing the connection. Please try again.')
    }
  }

  if (loading && profiles.length === 0) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading profiles...</div>
        <Navbar navItems={navItems} />
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
        <Navbar navItems={navItems} />
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
        <Navbar navItems={navItems} />
      </div>
    )
  }

  const currentProfile = profiles[currentProfileIndex]
  const connectionStatus = currentProfile.connectionState?.status || 'not_connected'
  
  // Debug logging to help identify the issue
  console.log('Current profile connection state:', currentProfile.connectionState)
  console.log('Derived connection status:', connectionStatus)

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
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
      <div className="relative w-full flex-grow min-h-0">
        <ProfileAvatar
          profileImage={currentProfile.profileImage}
          userId={currentProfile.id.toString()}
          alt="Profile"
          className="object-cover absolute inset-0 w-full h-full"
          fetchPriority="high"
          decoding="async"
          loading="eager"
          onLoad={() => console.log('Explore profile image loaded successfully')}
          onError={(e) => console.error('Explore profile image failed to load:', e)}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
        {/* Profile Info Block */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="w-full flex flex-col px-4" style={interFont}>
            {/* Connection Status - preserve same outlined pill design, only change text */}
            <div className="mb-2">
              <button 
                onClick={connectionStatus === 'not_connected' ? () => handleConnectionAction('connect') : undefined}
                className="bg-transparent text-white inline-block hover:bg-white/10 disabled:opacity-100 disabled:cursor-default"
                disabled={connectionStatus !== 'not_connected'}
                style={{ 
                  width: '90px', 
                  height: '25px', 
                  borderRadius: '5px', 
                  fontSize: '12px', 
                  fontWeight: '600',
                  border: '2px solid #ffffff'
                }}
              >
                {connectionStatus === 'requested' ? 'Requested' : connectionStatus === 'connected' ? 'Connected' : 'Connect'}
              </button>
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

      {/* Personality Traits - fixed area to avoid overlap with navbar, no page scroll */}
      <div className="px-4 py-3 mb-[88px]">
        {loadingAdjectives ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl bg-gray-800 animate-pulse w-full h-[56px]">
                <div className="h-6 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : adjectiveDisplay ? (
          <div className="grid grid-cols-2 gap-3">
            {adjectiveDisplay.allAdjectives.slice(0, 4).map((trait) => (
              <button
                key={trait}
                onClick={() => handleTraitSelection(trait)}
                disabled={selectedTrait !== ""}
                style={{ height: '56px', fontFamily: 'Inter' }}
                className={`rounded-2xl text-center transition-all w-full text-base ${
                  selectedTrait === trait 
                    ? "bg-green-500 text-black" 
                    : selectedTrait !== "" 
                      ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                      : "bg-white/10 backdrop-blur-sm text-green-400 hover:bg-white/20"
                }`}
              >
                <span className="font-semibold">{trait}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl bg-gray-800 w-full h-[56px]">
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
