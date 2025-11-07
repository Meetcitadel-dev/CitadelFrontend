import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { useQuery } from '@tanstack/react-query'
import { fetchUniversities } from '@/lib/api'

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

interface UniversitySelectionScreenProps {
  value?: any
  onContinue: (university: any) => void
  onBack?: () => void
}

export default function UniversitySelectionScreen({ value, onContinue, onBack }: UniversitySelectionScreenProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUniversity, setSelectedUniversity] = useState<any | null>(value || null)
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce search term to reduce API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Fetch universities from backend with optimized caching and debouncing
  const { data: universities = [], isLoading, isError } = useQuery({
    queryKey: ['universities', debouncedSearchTerm],
    queryFn: () => fetchUniversities({ search: debouncedSearchTerm, limit: 20 }),
    staleTime: 10 * 60 * 1000, // 10 minutes cache
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
    enabled: debouncedSearchTerm.length >= 2 || debouncedSearchTerm === '', // Only search if 2+ chars or empty
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setSelectedUniversity(null)
    setShowDropdown(true)
  }

  const handleUniversitySelect = (university: any) => {
    setSelectedUniversity(university)
    setSearchTerm(university.name)
    setShowDropdown(false)
  }

  const handleInputFocus = () => {
    setShowDropdown(true)
  }

  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 150)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-[393px] mx-auto h-screen flex flex-col relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center px-2 pt-8 h-14">
        <button
          onClick={onBack}
          className="bg-transparent border-none p-0 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 21 21" fill="none">
            <path d="M10.5 20L1 10.5M1 10.5L10.5 1M1 10.5L20 10.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Title */}
      <div className="px-2 mt-6 mb-5">
        <h1 className="m-0 text-left" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 36, lineHeight: '44px', color: '#FFFFFF' }}>
          Your university
        </h1>
        {/* <p className="text-gray-400 text-sm mt-2 mb-0">Search and select your institution</p> */}
      </div>

      {/* Search Input */}
      <div className="px-2 mb-4">
        <div className="relative w-full h-[76px] bg-[#000000] rounded-[0px] flex items-center">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search size={22} color="rgba(255,255,255,0.7)" strokeWidth={2.2} />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search colleges"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="w-full h-[56px] rounded-[24px] bg-[#2B2B2B] outline-none border-0 text-white placeholder-white/70 pl-14 pr-4 mx-2"
            style={{
              border: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: "'Inter', sans-serif",
              fontSize: 20,
              fontWeight: 400,
              letterSpacing: '0px',
              borderRadius: 10,
            }}
          />
        </div>
        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute left-2 right-2 bg-[#101010] border border-[#1F1F1F] rounded-2xl mt-2 max-h-96 overflow-y-auto z-20 shadow-lg">
            {isLoading && (
              <div className="flex items-center gap-3 p-5 text-gray-400" style={{ fontFamily: "'Inter', sans-serif", borderBottom: '1px solid #2F2F2F' }}>
                <div className="w-5 h-5 border-2 border-gray-600 border-t-green-500 rounded-full animate-spin"></div>
                <span className="text-sm">Searching universities...</span>
              </div>
            )}
            {isError && (
              <div className="p-5">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-semibold">Connection Error</span>
                </div>
                <p className="text-sm text-gray-500">Please check your internet and try again</p>
              </div>
            )}
            {!isLoading && !isError && universities.length === 0 && debouncedSearchTerm.length >= 2 && (
              <div className="p-5 text-center">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-400 text-sm">No universities found for</p>
                <p className="text-white font-semibold mt-1">"{debouncedSearchTerm}"</p>
              </div>
            )}
            {!isLoading && !isError && universities.length === 0 && debouncedSearchTerm.length < 2 && debouncedSearchTerm.length > 0 && (
              <div className="p-5 text-center">
                <div className="text-4xl mb-2">⌨️</div>
                <p className="text-gray-400 text-sm">Type at least 2 characters to search</p>
              </div>
            )}
            <div>
              {universities.map((university: any) => (
                <button
                  key={university.id}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleUniversitySelect(university)
                  }}
                  className="w-full text-left py-3 px-4 text-white bg-transparent border-none cursor-pointer hover:bg-white/10 transition-all duration-150"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    borderBottom: '1px solid #2F2F2F'
                  }}
                >
                  <p className="text-base font-semibold m-0">{university.name}</p>
                </button>
              ))}
              <div style={{ height: 1, backgroundColor: '#2F2F2F' }} />
            </div>
          </div>
        )}
      </div>

      {/* Selected University Display */}
      {/* {selectedUniversity && (
        <div className="px-2 mt-6">
          <div className="border border-[#1F1F1F] rounded-2xl p-4 bg-[#101010]">
            <p className="text-white font-semibold text-base m-0" style={{ fontFamily: "'Inter', sans-serif" }}>
              {selectedUniversity.name}
            </p>
            {selectedUniversity.location && (
              <p className="text-gray-500 text-sm m-0 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                {selectedUniversity.location}
              </p>
            )}
          </div>
        </div>
      )} */}

      {/* Continue Button */}
      <div className="absolute bottom-6 left-2 right-2">
        <button
          onClick={() => onContinue(selectedUniversity)}
          disabled={!selectedUniversity}
          className="w-full py-5 rounded-2xl text-lg font-bold border-none transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          style={{
            fontFamily: "'Inter', sans-serif",
            background: selectedUniversity
              ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
              : '#1a1a1a',
            color: selectedUniversity ? '#000' : 'black',
            cursor: selectedUniversity ? 'pointer' : 'not-allowed',
            boxShadow: selectedUniversity
              ? '0 8px 24px rgba(34, 197, 94, 0.4)'
              : '0 4px 12px rgba(0,0,0,0.2)',
            borderRadius: 50,
          }}
        >
          Continue
        </button>
      </div>
      </div>
    </div>
  )
}
