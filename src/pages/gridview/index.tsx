
import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { ProfileHeader } from "@/components/Gridview/profile-header"
import { ProfileCardView } from "@/components/Gridview/profile-card-view"
import { ProfileListView } from "@/components/Gridview/profile-list-view"
import { FilterModal } from "@/components/Gridview/filter-modal"
import { FilterTags } from "@/components/Gridview/filter-tags"
import { fetchExploreProfiles, manageConnection } from "@/lib/api"
import { getAuthToken, ensureValidToken } from "@/lib/utils"
import type { ExploreProfile } from "@/types"
import type { Profile } from "@/components/Gridview/profile-card-view"

export default function ProfilesPage() {
  const navigate = useNavigate()
  const [isSearchView, setIsSearchView] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("")
  const [selectedGender, setSelectedGender] = useState("")
  const [selectedYears, setSelectedYears] = useState<string[]>([])
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [profiles, setProfiles] = useState<ExploreProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)

  // Load profiles from API with infinite scrolling
  const loadProfiles = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }
      setError(null)

      // Try to ensure we have a valid token (will refresh if expired)
      const token = await ensureValidToken()
      if (!token) {
        console.error('No valid token available, redirecting to onboarding')
        navigate('/onboarding')
        return
      }

      const currentOffset = isLoadMore ? offset : 0
      
      // Build query parameters for filtering
      const queryParams = new URLSearchParams()
      queryParams.append('limit', '20')
      queryParams.append('offset', currentOffset.toString())
      
      if (sortBy) {
        queryParams.append('sortBy', sortBy)
      }
      
      if (selectedGender) {
        queryParams.append('gender', selectedGender.toLowerCase())
      }
      
      if (selectedYears.length > 0) {
        queryParams.append('years', selectedYears.join(','))
      }
      
      if (selectedUniversities.length > 0) {
        queryParams.append('universities', selectedUniversities.join(','))
      }
      
      if (selectedSkills.length > 0) {
        queryParams.append('skills', selectedSkills.join(','))
      }

      const response = await fetchExploreProfiles({
        limit: 20, // Load fewer profiles per request for better performance
        offset: currentOffset,
        token: token,
        sortBy: sortBy,
        gender: selectedGender ? selectedGender.toLowerCase() : undefined,
        years: selectedYears,
        universities: selectedUniversities,
        skills: selectedSkills
      })

      if (response.success) {
        // Process profile images the same way as detailed profile views
        const processedProfiles = response.profiles.map(profile => {
          // Debug: Log the profile data to understand what's being returned
          console.log('Gridview profile data from API:', {
            id: profile.id,
            name: profile.name,
            profileImage: profile.profileImage,
            slots: (profile as any).slots,
            images: (profile as any).images
          });
          
          // Use slot 0 as profile image when provided; fallback to profileImage if no slots
          const processedProfileImage = (profile as any).slots?.find((s: any) => s.slot === 0)?.image?.cloudfrontUrl
            || profile.profileImage; // Fallback to profileImage if slots not available
          
          return {
            ...profile,
            profileImage: processedProfileImage // Override with processed image
          }
        })

        if (isLoadMore) {
          setProfiles(prev => [...prev, ...processedProfiles])
          setOffset(prev => prev + processedProfiles.length)
        } else {
          setProfiles(processedProfiles)
          setOffset(processedProfiles.length)
        }
        setHasMore(response.hasMore)
      } else {
        console.error('API returned success: false')
        setError('Failed to load profiles')
      }
    } catch (error) {
      console.error('Error loading profiles:', error)
      setError('Failed to load profiles')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [offset, sortBy, selectedGender, selectedYears, selectedUniversities, selectedSkills])

  // Initial load
  useEffect(() => {
    loadProfiles()
  }, [loadProfiles])

  // Reload when filters change
  useEffect(() => {
    if (!loading) {
      setOffset(0)
      loadProfiles()
    }
  }, [sortBy, selectedGender, selectedYears, selectedUniversities, selectedSkills])

  // Handle connection actions
  const handleConnectionAction = async (profileId: string, action: 'connect' | 'remove' | 'accept' | 'reject') => {
    try {
      const token = getAuthToken()
      if (!token) {
        console.error('No authentication token found')
        return
      }

      const response = await manageConnection({
        targetUserId: profileId,
        action: action
      }, token)

      if (response.success) {
        // Update the profile's connection state
        setProfiles(prev => prev.map(profile => {
          if (profile.id === profileId) {
            return {
              ...profile,
              connectionState: response.connectionState ? {
                id: String(response.connectionState.id),
                userId1: response.connectionState.userId1 ? String(response.connectionState.userId1) : undefined,
                userId2: response.connectionState.userId2 ? String(response.connectionState.userId2) : undefined,
                requesterId: response.connectionState.requesterId ? String(response.connectionState.requesterId) : undefined,
                targetId: response.connectionState.targetId ? String(response.connectionState.targetId) : undefined,
                status: response.connectionState.status,
                createdAt: new Date(response.connectionState.createdAt),
                updatedAt: new Date(response.connectionState.updatedAt)
              } : profile.connectionState
            }
          }
          return profile
        }))
      } else {
        console.error('Failed to manage connection:', response.message)
      }
    } catch (error) {
      console.error('Error managing connection:', error)
    }
  }

  // Convert ExploreProfile to Profile format for components
  const convertToProfileFormat = (exploreProfile: ExploreProfile): Profile => {
    const connectionStatus = exploreProfile.connectionState?.status || 'not_connected'
    
    let status: "connect" | "remove" | "request" | "requested" | "connected"
    switch (connectionStatus) {
      case 'connected':
        status = 'connected'
        break
      case 'requested':
        status = 'requested'
        break
      case 'not_connected':
        status = 'connect'
        break
      default:
        status = 'connect'
    }

    return {
      id: typeof exploreProfile.id === 'string' ? parseInt(exploreProfile.id) : exploreProfile.id,
      name: exploreProfile.name,
      university: exploreProfile.university?.name || 'Unknown University',
      year: exploreProfile.year || 'Unknown Year',
      image: exploreProfile.profileImage || "/placeholder.svg", // Ensure string type for image
      status: status,
    }
  }

  const handleSearchFocus = () => {
    setIsSearchView(true)
  }

  const handleBackClick = () => {
    navigate('/explore')
    setIsSearchView(false)
    setSearchQuery("")
  }

  const handleFilterOpen = () => {
    setIsFilterOpen(true)
  }

  const handleFilterClose = () => {
    setIsFilterOpen(false)
  }

  const handleApplyFilters = (filters: {
    selectedFilters: string[]
    sortBy: string
    gender: string
    years: string[]
    universities: string[]
    skills: string[]
  }) => {
    setSelectedFilters(filters.selectedFilters)
    setSortBy(filters.sortBy)
    setSelectedGender(filters.gender)
    setSelectedYears(filters.years)
    setSelectedUniversities(filters.universities)
    setSelectedSkills(filters.skills)
    setIsFilterOpen(false)
    
    // Reload profiles with new filters
    setOffset(0)
    loadProfiles()
  }

  const handleRemoveFilter = (filterToRemove: string) => {
    setSelectedFilters((prev) => prev.filter((filter) => filter !== filterToRemove))
  }

  // Handle infinite scroll
  const handleScroll = useCallback(() => {
    if (loadingMore || !hasMore || typeof window === 'undefined') return

    const scrollTop = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    if (scrollTop + windowHeight >= documentHeight - 100) {
      loadProfiles(true)
    }
  }, [loadingMore, hasMore, loadProfiles])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Convert profiles to the format expected by components
  const profilesData: Profile[] = profiles.map(convertToProfileFormat)
  
  // Apply search filter (client-side for immediate feedback)
  const filteredProfiles = profilesData.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.university.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Apply sorting (client-side for immediate feedback)
  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    if (sortBy === "year_asc") {
      return parseInt(a.year) - parseInt(b.year)
    } else if (sortBy === "year_desc") {
      return parseInt(b.year) - parseInt(a.year)
    } else if (sortBy === "name_asc") {
      return a.name.localeCompare(b.name)
    } else if (sortBy === "name_desc") {
      return b.name.localeCompare(a.name)
    }
    return 0
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <div className="text-lg font-medium">Loading profiles...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-xl font-semibold mb-2">Failed to load profiles</div>
          <div className="text-gray-400 mb-6">Please check your connection and try again</div>
          <button
            onClick={() => loadProfiles()}
            className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="text-xl font-semibold mb-2">No profiles available</div>
          <div className="text-gray-400">You've seen all available profiles!</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 lg:pb-8">
      <ProfileHeader
        isSearchView={isSearchView}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearchFocus={handleSearchFocus}
        onBackClick={handleBackClick}
        onFilterClick={handleFilterOpen}
      />

      {selectedFilters.length > 0 && <FilterTags filters={selectedFilters} onRemoveFilter={handleRemoveFilter} />}

      <div className="container-responsive px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6">
        {isSearchView ? (
          <ProfileListView profiles={sortedProfiles} />
        ) : (
          <ProfileCardView
            profiles={sortedProfiles}
            onConnectionAction={handleConnectionAction}
          />
        )}
      </div>

      {loadingMore && (
        <div className="flex justify-center py-6">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
            <span className="text-gray-400">Loading more profiles...</span>
          </div>
        </div>
      )}

      <FilterModal
        isOpen={isFilterOpen}
        onClose={handleFilterClose}
        onApply={handleApplyFilters}
        initialFilters={selectedFilters}
        initialSortBy={sortBy}
        initialGender={selectedGender}
        initialYears={selectedYears}
      />
    </div>
  )
}
