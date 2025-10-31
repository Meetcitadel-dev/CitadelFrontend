"use client"

import { ArrowLeft, Search } from "lucide-react"
import { Input } from "../ui/input"
// import { SortIcon } from "./sort-icon"

interface ProfileHeaderProps {
  isSearchView: boolean
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  onSearchFocus: () => void
  onBackClick: () => void
  onFilterClick: () => void
}

// Custom SortIcon: three horizontal right-aligned lines
function SortIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="8" width="8" height="2" rx="1" fill="white" />
      <rect x="12" y="13" width="12" height="2" rx="1" fill="white" />
      <rect x="18" y="18" width="6" height="2" rx="1" fill="white" />
    </svg>
  );
}

export function ProfileHeader({
  searchQuery,
  onSearchQueryChange,
  onSearchFocus,
  onBackClick,
  onFilterClick,
}: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-3 p-4 pb-6">
      <button onClick={onBackClick} className="text-white hover:text-gray-300 transition-colors">
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search friends"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          onFocus={onSearchFocus}
          className="w-full bg-gray-800 border-0 rounded-full pl-11 pr-4 py-3 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-gray-600 focus:outline-none"
        />
      </div>

      <button onClick={onFilterClick} className="text-white hover:text-gray-300 transition-colors p-2">
        <SortIcon />
      </button>
    </div>
  )
}
