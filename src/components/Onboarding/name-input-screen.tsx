"use client"

import type React from "react"
import { useState } from "react"
// ... existing code ...

interface NameInputScreenProps {
  value: string
  gender?: string
  onContinue: (name: string, gender: string) => void
  onBack?: () => void
}

export default function NameInputScreen({ value, gender: initialGender, onContinue, onBack }: NameInputScreenProps) {
  const [name, setName] = useState(value || "")
  const [gender, setGender] = useState(initialGender || "")

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const isNameValid = name.length > 2 && gender.length > 0

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        position: "relative",
        fontFamily: "'Roboto Serif', serif",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "0 0 0 24px", paddingTop: 35, height: 56 }}>
        <button 
          onClick={onBack}
          style={{ background: "none", border: "none", padding: 0, marginRight: 0 }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
            <path d="M10.5 20L1 10.5M1 10.5L10.5 1M1 10.5L20 10.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Title */}
      <div style={{ padding: "0 16px 0 24px", marginBottom: 16, marginTop: 28 }}>
        <h1
          style={{
            fontFamily: "'Roboto Serif', serif",
            fontWeight: 700,
            fontSize: 32,
            margin: 0,
            textAlign: "left",
            letterSpacing: "-0.5px",
          }}
        >
          Who are you?
        </h1>
      </div>

      {/* Name Input */}
      <div style={{ padding: "0 16px", marginBottom: 0 }}>
        <input
          type="text"
          placeholder="Write your full name"
          value={name}
          onChange={handleNameChange}
          style={{
            width: "100%",
            background: "#232323",
            borderRadius: 12,
            border: "none",
            padding: "14px 16px",
            color: "#fff",
            fontFamily: "'Roboto Serif', serif",
            fontSize: 17,
            marginBottom: 0,
            outline: "none",
            boxSizing: "border-box",
            fontWeight: 400,
            letterSpacing: "-0.2px",
          }}
        />
      </div>

      {/* Gender Selection */}
      <div style={{ padding: "0 16px", marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: "#fff", fontSize: 17, fontFamily: "'Roboto Serif', serif", fontWeight: 400 }}>
            Gender
          </span>
          {["Male", "Female", "Other"].map((option) => (
            <button
              key={option}
              onClick={() => setGender(option)}
              style={{
                padding: "12px 20px",
                borderRadius: 8,
                border: "none",
                background: gender === option ? "#22FF88" : "#232323",
                color: gender === option ? "#000" : "#fff",
                fontFamily: "'Roboto Serif', serif",
                fontSize: 16,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
                letterSpacing: "-0.2px",
                minWidth: 80,
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div style={{ position: "absolute", bottom: 24, left: 16, right: 16 }}>
        <button
          onClick={() => onContinue(name, gender)}
          disabled={!isNameValid}
          style={{
            width: "100%",
            padding: "16px 0",
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 600,
            fontFamily: "'Roboto Serif', serif",
            background: isNameValid ? "#22FF88" : "#232323",
            color: isNameValid ? "#000" : "#888",
            border: "none",
            opacity: isNameValid ? 1 : 0.7,
            transition: "background 0.2s",
            cursor: isNameValid ? "pointer" : "not-allowed",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
