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
      <div className="w-full max-w-md mx-auto h-screen flex flex-col relative" style={{ fontFamily: "'Roboto Serif', serif" }}>
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
      <div className="px-2 mt-8 mb-6">
        <h1 className="text-4xl font-bold m-0 text-left bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent" style={{ fontFamily: "'Roboto Serif', serif", letterSpacing: '-1px' }}>
          Your university
        </h1>
        <p className="text-gray-400 text-sm mt-2 mb-0">Search and select your institution</p>
      </div>

      {/* Search Input */}
      <div className="px-2 mb-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search size={22} color="#22C55E" strokeWidth={2.5} />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="w-full bg-[#1a1a1a] rounded-2xl border-2 border-gray-800 py-4 px-5 pl-14 text-white text-base outline-none transition-all duration-200 focus:border-green-500 focus:bg-[#232323] placeholder:text-gray-500"
            style={{
              fontFamily: "'Roboto Serif', serif",
              fontSize: 16,
              fontWeight: 400,
              letterSpacing: '-0.3px',
            }}
          />
        </div>
        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute left-2 right-2 bg-[#1a1a1a] border-2 border-gray-800 rounded-2xl mt-2 max-h-96 overflow-y-auto z-20 shadow-2xl backdrop-blur-sm">
            {isLoading && (
              <div className="flex items-center gap-3 p-5 text-gray-400">
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
            <div className="divide-y divide-gray-800">
              {universities.map((university: any) => (
                <button
                  key={university.id}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleUniversitySelect(university)
                  }}
                  className="w-full text-left py-4 px-5 text-white bg-transparent border-none cursor-pointer hover:bg-green-500/10 transition-all duration-200 group"
                  style={{
                    fontFamily: "'Roboto Serif', serif",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                        {university.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-base font-semibold m-0 group-hover:text-green-400 transition-colors">{university.name}</p>
                        {university.location && (
                          <p className="text-xs text-gray-500 m-0 mt-1">{university.location}</p>
                        )}
                      </div>
                    </div>
                    <svg className="opacity-0 group-hover:opacity-100 transition-opacity" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7 10L9 12L13 8" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected University Display */}
      {selectedUniversity && (
        <div className="px-2 mt-6">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {selectedUniversity.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-xs text-green-400 font-semibold mb-1">SELECTED</p>
                <p className="text-white font-bold text-base m-0">{selectedUniversity.name}</p>
                {selectedUniversity.location && (
                  <p className="text-gray-400 text-xs m-0 mt-1">{selectedUniversity.location}</p>
                )}
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#22C55E"/>
                <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="absolute bottom-6 left-2 right-2">
        <button
          onClick={() => onContinue(selectedUniversity)}
          disabled={!selectedUniversity}
          className="w-full py-5 rounded-2xl text-lg font-bold border-none transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          style={{
            fontFamily: "'Roboto Serif', serif",
            background: selectedUniversity
              ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
              : '#1a1a1a',
            color: selectedUniversity ? '#000' : '#555',
            cursor: selectedUniversity ? 'pointer' : 'not-allowed',
            boxShadow: selectedUniversity
              ? '0 8px 24px rgba(34, 197, 94, 0.4)'
              : '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          {selectedUniversity ? '✓ Continue' : 'Select a university'}
        </button>
      </div>
      </div>
    </div>
  )
}
