
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import ScaledCanvas from './ScaledCanvas'
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
  const { data: universities = [], isLoading, isError, error } = useQuery({
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
    <ScaledCanvas>
      <div style={{ width: 390, height: 844, background: '#000', color: '#fff', position: 'relative', fontFamily: "'Roboto Serif', serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 0 0 24px', paddingTop: 35, height: 56 }}>
        <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', padding: 0, marginRight: 0 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
            <path d="M10.5 20L1 10.5M1 10.5L10.5 1M1 10.5L20 10.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Title */}
      <div style={{ padding: '0 16px 0 24px', marginBottom: 16, marginTop: 28 }}>
        <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: 32, margin: 0, textAlign: 'left', letterSpacing: '-0.5px' }}>Your university</h1>
      </div>

      {/* Search Input */}
      <div style={{ padding: '0 16px', marginBottom: 0 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: '0 0 0 0', left: 0, height: '100%', display: 'flex', alignItems: 'center', pointerEvents: 'none', paddingLeft: 16 }}>
            <Search size={20} color="#9CA3AF" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search universities"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            style={{
              width: '100%',
              background: '#232323',
              borderRadius: 12,
              border: 'none',
              padding: '14px 16px 14px 44px',
              color: '#fff',
              fontFamily: "'Roboto Serif', serif",
              fontSize: 17,
              marginBottom: 0,
              outline: 'none',
              boxSizing: 'border-box',
              fontWeight: 400,
              letterSpacing: '-0.2px',
            }}
            className="search-input"
          />
        </div>
        {/* Dropdown */}
        {showDropdown && (
          <div style={{ position: 'absolute', left: 16, right: 16, background: '#232323', borderRadius: 12, marginTop: 8, maxHeight: 320, overflowY: 'auto', zIndex: 10 }}>
            {isLoading && (
              <div style={{ color: '#888', padding: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 16, height: 16, border: '2px solid #888', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                Loading universities...
              </div>
            )}
            {isError && (
              <div style={{ color: '#ef4444', padding: 16 }}>
                Failed to load universities. Please check your connection and try again.
                {error && (
                  <div style={{ fontSize: 12, marginTop: 4, color: '#888' }}>
                    {error.toString()}
                  </div>
                )}
              </div>
            )}
            {!isLoading && !isError && universities.length === 0 && debouncedSearchTerm.length >= 2 && (
              <div style={{ color: '#888', padding: 16 }}>
                No universities found for "{debouncedSearchTerm}"
              </div>
            )}
            {!isLoading && !isError && universities.length === 0 && debouncedSearchTerm.length < 2 && debouncedSearchTerm.length > 0 && (
              <div style={{ color: '#888', padding: 16 }}>
                Type at least 2 characters to search
              </div>
            )}
            {universities.map((university: any) => (
              <button
                key={university.id}
                onClick={() => handleUniversitySelect(university)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 16px',
                  color: '#fff',
                  background: 'none',
                  border: 'none',
                  fontFamily: "'Roboto Serif', serif",
                  fontSize: 17,
                  borderBottom: '1px solid #333',
                  cursor: 'pointer',
                }}
              >
                {university.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Continue Button */}
      <div style={{ position: 'absolute', bottom: 24, left: 16, right: 16 }}>
        <button
          onClick={() => onContinue(selectedUniversity)}
          disabled={!selectedUniversity}
          style={{
            width: '100%',
            padding: '16px 0',
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 600,
            fontFamily: "'Roboto Serif', serif",
            background: selectedUniversity ? '#22C55E' : '#232323',
            color: selectedUniversity ? '#000' : '#888',
            border: 'none',
            opacity: selectedUniversity ? 1 : 0.7,
            transition: 'background 0.2s',
            cursor: selectedUniversity ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          Continue
        </button>
      </div>
      </div>
    </ScaledCanvas>
  )
}
