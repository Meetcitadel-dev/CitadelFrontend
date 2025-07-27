
import { useState } from "react"
import { ProfileHeader } from "@/components/Gridview/profile-header"
import { ProfileCardView } from "@/components/Gridview/profile-card-view"
import { ProfileListView } from "@/components/Gridview/profile-list-view"
import { FilterModal } from "@/components/Gridview/filter-modal"
import { FilterTags } from "@/components/Gridview/filter-tags"
import type { Profile } from "@/components/Gridview/profile-card-view"

// Mock data for profiles
const profilesData: Profile[] = [
  {
    id: 1,
    name: "Deniyal Shifer",
    university: "IIT Delhi",
    year: "Year 2",
    image: "/placeholder.svg?height=120&width=120",
    status: "connect",
  },
  {
    id: 2,
    name: "Omar Jamil",
    university: "University of Toronto",
    year: "Year 2",
    image: "/placeholder.svg?height=120&width=120",
    status: "remove",
  },
  {
    id: 3,
    name: "Zara Chen",
    university: "University of California, Berkeley",
    year: "Year 2",
    image: "/placeholder.svg?height=120&width=120",
    status: "request",
  },
  {
    id: 4,
    name: "Fatima El-Sayed",
    university: "Harvard University",
    year: "Year 2",
    image: "/placeholder.svg?height=120&width=120",
    status: "connected",
  },
  {
    id: 5,
    name: "Carlos Mendoza",
    university: "MIT",
    year: "Year 2",
    image: "/placeholder.svg?height=120&width=120",
    status: "connect",
  },
  {
    id: 6,
    name: "Ravi Kumar",
    university: "Caltech",
    year: "Year 2",
    image: "/placeholder.svg?height=120&width=120",
    status: "remove",
  },
  {
    id: 7,
    name: "Nina Patel",
    university: "University of Cambridge",
    year: "Year 2",
    image: "/placeholder.svg?height=120&width=120",
    status: "request",
  },
  {
    id: 8,
    name: "Aisha Nadir",
    university: "Stanford University",
    year: "Year 2",
    image: "/placeholder.svg?height=120&width=120",
    status: "connected",
  },
]

export default function ProfilesPage() {
  const [isSearchView, setIsSearchView] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("")
  const [selectedGender, setSelectedGender] = useState("")
  const [selectedYears, setSelectedYears] = useState<string[]>([])

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

  const filteredProfiles = profilesData.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.university.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
