"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"

interface DateOfBirthScreenProps {
  onContinue: () => void
}

export default function DateOfBirthScreen({ onContinue }: DateOfBirthScreenProps) {
  const [day, setDay] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 2 && /^\d*$/.test(value)) {
      setDay(value)
    }
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 2 && /^\d*$/.test(value)) {
      setMonth(value)
    }
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setYear(value)
    }
  }

  const isDateValid = () => {
    const dayNum = Number.parseInt(day)
    const monthNum = Number.parseInt(month)
    const yearNum = Number.parseInt(year)

    return (
      day.length === 2 &&
      month.length === 2 &&
      year.length === 4 &&
      dayNum >= 1 &&
      dayNum <= 31 &&
      monthNum >= 1 &&
      monthNum <= 12 &&
      yearNum >= 1900 &&
      yearNum <= new Date().getFullYear()
    )
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
        <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: 32, margin: 0, textAlign: 'left', letterSpacing: '-0.5px' }}>Date of birth</h1>
      </div>

      {/* Date Input Fields */}
      <div style={{ padding: '0 16px', marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 16 }}>
          <input
            type="text"
            placeholder="DD"
            value={day}
            onChange={handleDayChange}
            maxLength={2}
            style={{
              width: 56,
              height: 56,
              background: '#232323',
              color: '#fff',
              border: 'none',
              borderRadius: 16,
              textAlign: 'center',
              fontSize: 17,
              fontWeight: 600,
              fontFamily: "'Roboto Serif', serif",
              outline: 'none',
              boxShadow: 'none',
              margin: 0,
              padding: 0,
              letterSpacing: '0',
            }}
          />
          <input
            type="text"
            placeholder="MM"
            value={month}
            onChange={handleMonthChange}
            maxLength={2}
            style={{
              width: 56,
              height: 56,
              background: '#232323',
              color: '#fff',
              border: 'none',
              borderRadius: 16,
              textAlign: 'center',
              fontSize: 17,
              fontWeight: 600,
              fontFamily: "'Roboto Serif', serif",
              outline: 'none',
              boxShadow: 'none',
              margin: 0,
              padding: 0,
              letterSpacing: '0',
            }}
          />
          <input
            type="text"
            placeholder="YYYY"
            value={year}
            onChange={handleYearChange}
            maxLength={4}
            style={{
              width: 80,
              height: 56,
              background: '#232323',
              color: '#fff',
              border: 'none',
              borderRadius: 16,
              textAlign: 'center',
              fontSize: 17,
              fontWeight: 600,
              fontFamily: "'Roboto Serif', serif",
              outline: 'none',
              boxShadow: 'none',
              margin: 0,
              padding: 0,
              letterSpacing: '0',
            }}
          />
        </div>
      </div>

      {/* Continue Button */}
      <div style={{ position: 'absolute', bottom: 24, left: 16, right: 16 }}>
        <button
          onClick={onContinue}
          disabled={!isDateValid()}
          style={{
            width: '100%',
            padding: '16px 0',
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 600,
            fontFamily: "'Roboto Serif', serif",
            background: isDateValid() ? '#22FF88' : '#232323',
            color: isDateValid() ? '#000' : '#888',
            border: 'none',
            opacity: isDateValid() ? 1 : 0.7,
            transition: 'background 0.2s',
            cursor: isDateValid() ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
