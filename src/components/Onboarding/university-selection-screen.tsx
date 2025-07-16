
import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, Search } from "lucide-react"

interface UniversitySelectionScreenProps {
  onContinue: () => void
}

const universities = [
  "Masters' Union",
  "IIT Delhi",
  "IIT Bombay",
  "IIT Madras",
  "IIT Kanpur",
  "IIT Kharagpur",
  "IIT Roorkee",
  "IIT Guwahati",
  "Plaksha University",
  "IIM Indore",
  "IIM Ahmedabad",
  "IIM Bangalore",
  "IIM Calcutta",
  "IIM Lucknow",
  "MUJ",
  "Delhi University",
  "Jawaharlal Nehru University",
  "Banaras Hindu University",
  "University of Mumbai",
  "University of Pune",
  "Jadavpur University",
  "Anna University",
  "VIT University",
  "SRM University",
  "Amity University",
  "Lovely Professional University",
  "Chandigarh University",
  "Thapar University",
  "PEC University of Technology",
  "NIT Trichy",
  "NIT Warangal",
  "NIT Surathkal",
  "BITS Pilani",
  "IIIT Hyderabad",
  "ISI Kolkata",
]

export default function UniversitySelectionScreen({ onContinue }: UniversitySelectionScreenProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUniversity, setSelectedUniversity] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [filteredUniversities, setFilteredUniversities] = useState(universities)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchTerm) {
      const filtered = universities
        .filter((uni) => uni.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
          // Prioritize exact matches and matches at the beginning
          const aIndex = a.toLowerCase().indexOf(searchTerm.toLowerCase())
          const bIndex = b.toLowerCase().indexOf(searchTerm.toLowerCase())
          if (aIndex !== bIndex) return aIndex - bIndex
          return a.localeCompare(b)
        })
      setFilteredUniversities(filtered)
    } else {
      setFilteredUniversities(universities)
    }
  }, [searchTerm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setSelectedUniversity("")
    setShowDropdown(true)
  }

  const handleUniversitySelect = (university: string) => {
    setSelectedUniversity(university)
    setSearchTerm(university)
    setShowDropdown(false)
  }

  const handleInputFocus = () => {
    setShowDropdown(true)
  }

  const handleInputBlur = () => {
    // Delay hiding dropdown to allow for selection
    setTimeout(() => setShowDropdown(false), 150)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', position: 'relative', fontFamily: "'Roboto Serif', serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 0 0 8px', paddingTop: 32, height: 56 }}>
        <button style={{ background: 'none', border: 'none', padding: 0, marginRight: 0 }}>
          <ChevronLeft size={24} color="white" />
        </button>
      </div>

      {/* Title */}
      <div style={{ padding: '0 16px', marginBottom: 24 }}>
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
            placeholder="Search colleges"
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
            {filteredUniversities.map((university, index) => (
              <button
                key={index}
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
                  borderBottom: index !== filteredUniversities.length - 1 ? '1px solid #333' : 'none',
                  cursor: 'pointer',
                }}
              >
                {university}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Continue Button */}
      <div style={{ position: 'absolute', bottom: 24, left: 16, right: 16 }}>
        <button
          onClick={onContinue}
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
  )
}
