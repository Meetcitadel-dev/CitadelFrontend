"use client"

import { useState } from "react"
import { ChevronLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

const degrees = ["B.Tech", "B.Des", "B.A.", "B.Sc", "BBA", "M.Tech", "M.A.", "PhD", "B.Pharm", "MCA", "LLB"]

const years = ["1st", "2nd", "3rd", "4th", "5th"]

export default function DegreeSelection({ value, onContinue }: { value?: { degree: string; year: string }, onContinue: (degree: string, year: string) => void }) {
  const [selectedDegree, setSelectedDegree] = useState(value?.degree || "")
  const [selectedYear, setSelectedYear] = useState(value?.year || "")
  const [showDropdown, setShowDropdown] = useState(false)
  const [currentStep, setCurrentStep] = useState(selectedDegree ? (selectedYear ? "done" : "year") : "degree") // "degree" or "year" or "done"

  const handleDegreeSelect = (degree: string) => {
    setSelectedDegree(degree)
    setShowDropdown(false)
    setCurrentStep("year")
  }

  const handleYearSelect = (year: string) => {
    setSelectedYear(year)
  }

  const handleContinue = () => {
    if (currentStep === "degree" && selectedDegree) {
      setCurrentStep("year")
    } else if (currentStep === "year" && selectedYear) {
      if (onContinue) onContinue(selectedDegree, selectedYear)
    }
  }

  const canContinue = currentStep === "degree" ? selectedDegree : selectedYear

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
        <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: 32, margin: 0, textAlign: 'left', letterSpacing: '-0.5px' }}>Your degree?</h1>
      </div>

      {/* Degree Selection */}
      {currentStep === "degree" && (
        <div style={{ padding: '0 16px', marginBottom: 0 }}>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#232323',
                borderRadius: 12,
                padding: '14px 16px',
                color: selectedDegree ? '#fff' : '#9CA3AF',
                cursor: 'pointer',
                fontSize: 17,
                fontWeight: 400,
                fontFamily: "'Roboto Serif', serif",
                marginBottom: 0,
                border: 'none',
                outline: 'none',
                boxSizing: 'border-box',
                letterSpacing: '-0.2px',
              }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <Search size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
              <span>{selectedDegree || "Select your degree"}</span>
            </div>
            {/* Dropdown */}
            {showDropdown && (
              <div style={{ position: 'absolute', left: 0, right: 0, background: '#232323', borderRadius: 12, marginTop: 8, maxHeight: 320, overflowY: 'auto', zIndex: 10 }}>
                {degrees.map((degree) => (
                  <button
                    key={degree}
                    onClick={() => handleDegreeSelect(degree)}
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
                    {degree}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Year Selection */}
      {currentStep === "year" && (
        <div style={{ padding: '0 16px', marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#232323', borderRadius: 12, padding: '14px 16px', marginBottom: 24 }}>
            <Search size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
            <span style={{ color: '#fff', fontSize: 17 }}>{selectedDegree}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <span style={{ color: '#fff', fontSize: 18 }}>Year</span>
            <div style={{ display: 'flex', gap: 12 }}>
              {years.map((year) => (
                <button
                  key={year}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: 13,
                    background: selectedYear === year ? '#22FF88' : '#232323',
                    color: selectedYear === year ? '#000' : '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onClick={() => handleYearSelect(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div style={{ position: 'absolute', bottom: 24, left: 16, right: 16 }}>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          style={{
            width: '100%',
            padding: '16px 0',
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 600,
            fontFamily: "'Roboto Serif', serif",
            background: canContinue ? '#22FF88' : '#232323',
            color: canContinue ? '#000' : '#888',
            border: 'none',
            opacity: canContinue ? 1 : 0.7,
            transition: 'background 0.2s',
            cursor: canContinue ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
