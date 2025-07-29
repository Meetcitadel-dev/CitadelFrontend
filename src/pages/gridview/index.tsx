
import { useState, useEffect } from "react"
import { ProfileHeader } from "@/components/Gridview/profile-header"
import { ProfileCardView } from "@/components/Gridview/profile-card-view"
import { ProfileListView } from "@/components/Gridview/profile-list-view"
import { FilterModal } from "@/components/Gridview/filter-modal"
import { FilterTags } from "@/components/Gridview/filter-tags"
import { fetchExploreProfiles } from "@/lib/api"
import { getAuthToken } from "@/lib/utils"
import type { ExploreProfile } from "@/types"
import type { Profile } from "@/components/Gridview/profile-card-view"

export default function ProfilesPage() {
  const [isSearchView, setIsSearchView] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("")
  const [selectedGender, setSelectedGender] = useState("")
  const [selectedYears, setSelectedYears] = useState<string[]>([])
  const [profiles, setProfiles] = useState<ExploreProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load profiles from API
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const token = getAuthToken()
        if (!token) {
          console.error('No authentication token found')
          return
        }

        const response = await fetchExploreProfiles({
          limit: 50, // Load more profiles for grid view
          offset: 0,
          token: token
        })

        if (response.success) {
          setProfiles(response.profiles)
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
  }, [])

  // Convert ExploreProfile to Profile format for components
  const convertToProfileFormat = (exploreProfile: ExploreProfile): Profile => {
    const connectionStatus = exploreProfile.connectionState?.status || 'not_connected'
    
    let status: "connect" | "remove" | "request" | "connected"
    switch (connectionStatus) {
      case 'connected':
        status = 'connected'
        break
      case 'requested':
        status = 'request'
        break
      case 'not_connected':
        status = 'connect'
        break
      default:
        status = 'connect'
    }

    return {
      id: parseInt(exploreProfile.id),
      name: exploreProfile.name,
      university: exploreProfile.university?.name || 'Unknown University',
      year: exploreProfile.year || 'Unknown Year',
      image: exploreProfile.profileImage || "/placeholder.svg?height=120&width=120",
      status: status,
    }
  }

  const handleSearchFocus = () => {
    setIsSearchView(true)
  }

  const handleBackClick = () => {
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
  }) => {
    setSelectedFilters(filters.selectedFilters)
    setSortBy(filters.sortBy)
    setSelectedGender(filters.gender)
    setSelectedYears(filters.years)
    setIsFilterOpen(false)
  }

  const handleRemoveFilter = (filterToRemove: string) => {
    setSelectedFilters((prev) => prev.filter((filter) => filter !== filterToRemove))
  }

  // Convert profiles to the format expected by components
  const profilesData: Profile[] = profiles.map(convertToProfileFormat)

  const filteredProfiles = profilesData.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.university.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-lg">Loading profiles...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Failed to load profiles</div>
          <button 
            onClick={() => window.location.reload()}
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">No profiles available</div>
          <div className="text-sm text-gray-400">You've seen all available profiles!</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <ProfileHeader
        isSearchView={isSearchView}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearchFocus={handleSearchFocus}
        onBackClick={handleBackClick}
        onFilterClick={handleFilterOpen}
      />

      {selectedFilters.length > 0 && <FilterTags filters={selectedFilters} onRemoveFilter={handleRemoveFilter} />}

      <div className="px-4 pb-4">
        {isSearchView ? <ProfileListView profiles={filteredProfiles} /> : <ProfileCardView profiles={profilesData} />}
      </div>

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
