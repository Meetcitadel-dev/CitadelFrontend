"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"

interface NameInputScreenProps {
  value: string
  onContinue: (name: string) => void
}

export default function NameInputScreen({ value, onContinue }: NameInputScreenProps) {
  const [name, setName] = useState(value || "")

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const isNameValid = name.length > 2

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
        <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: 32, margin: 0, textAlign: 'left', letterSpacing: '-0.5px' }}>Who are you?</h1>
      </div>

      {/* Name Input */}
      <div style={{ padding: '0 16px', marginBottom: 0 }}>
        <input
          type="text"
          placeholder="Write your full name"
          value={name}
          onChange={handleNameChange}
          style={{
            width: '100%',
            background: '#232323',
            borderRadius: 12,
            border: 'none',
            padding: '14px 16px',
            color: '#fff',
            fontFamily: "'Roboto Serif', serif",
            fontSize: 17,
            marginBottom: 0,
            outline: 'none',
            boxSizing: 'border-box',
            fontWeight: 400,
            letterSpacing: '-0.2px',
          }}
        />
      </div>

      {/* Continue Button */}
      <div style={{ position: 'absolute', bottom: 24, left: 16, right: 16 }}>
        <button
          onClick={() => onContinue(name)}
          disabled={!isNameValid}
          style={{
            width: '100%',
            padding: '16px 0',
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 600,
            fontFamily: "'Roboto Serif', serif",
            background: isNameValid ? '#22FF88' : '#232323',
            color: isNameValid ? '#000' : '#888',
            border: 'none',
            opacity: isNameValid ? 1 : 0.7,
            transition: 'background 0.2s',
            cursor: isNameValid ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
