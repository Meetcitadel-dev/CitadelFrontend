"use client"

import type React from "react"

import { useState } from "react"
import { Search, X } from "lucide-react"

interface SkillsetsScreenProps {
  value?: string[]
  onContinue: (skills: string[]) => void
  onBack?: () => void
}

const availableSkills = [
  "Figma",
  "Python",
  "Da Vinci",
  "JavaScript",
  "React",
  "Node.js",
  "TypeScript",
  "Java",
  "C++",
  "HTML/CSS",
  "SQL",
  "MongoDB",
  "Express.js",
  "Vue.js",
  "Angular",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "Flutter",
  "React Native",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud",
  "Git",
  "Linux",
  "Machine Learning",
  "Data Science",
  "UI/UX Design",
  "Photoshop",
  "Illustrator",
  "Project Management",
  "Agile",
  "Scrum",
  "DevOps",
  "CI/CD",
  "Testing",
  "Plaksha University",
  "IIM Indore",
  "MUJ",
]

export default function SkillsetsScreen({ value, onContinue, onBack }: SkillsetsScreenProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>(value || [])
  const [showDropdown, setShowDropdown] = useState(false)

  const filteredSkills = availableSkills.filter(
    (skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()) && !selectedSkills.includes(skill),
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSkillSelect = (skill: string) => {
    if (selectedSkills.length < 5 && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill])
      setSearchTerm("")
      setShowDropdown(false)
    }
  }

  const handleSkillRemove = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter((skill) => skill !== skillToRemove))
  }

  const handleInputFocus = () => {
    setShowDropdown(true)
  }

  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 150)
  }

  const isSkillsValid = selectedSkills.length >= 1 && selectedSkills.length <= 5

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', position: 'relative', fontFamily: "'Roboto Serif', serif", display: 'flex', flexDirection: 'column' }}>
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
        <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: 32, margin: 0, textAlign: 'left', letterSpacing: '-0.5px' }}>Tell your skillsets</h1>
      </div>

      {/* Search Input */}
      <div style={{ padding: '0 16px', marginBottom: 0, position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, height: '100%', display: 'flex', alignItems: 'center', pointerEvents: 'none', paddingLeft: 16 }}>
            <Search size={20} color="#9CA3AF" />
          </div>
          <input
            type="text"
            placeholder="Select 1-5 skills"
            value={searchTerm}
            onChange={handleSearchChange}
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
          />
        </div>
        {/* Dropdown */}
        {showDropdown && (
          <div style={{ position: 'absolute', left: 0, right: 0, background: '#232323', borderRadius: 12, marginTop: 8, maxHeight: 240, overflowY: 'auto', zIndex: 10 }}>
            {filteredSkills.map((skill, index) => (
              <button
                key={index}
                onClick={() => handleSkillSelect(skill)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '16px',
                  color: '#fff',
                  background: 'none',
                  border: 'none',
                  fontFamily: "'Roboto Serif', serif",
                  fontSize: 17,
                  borderBottom: index !== filteredSkills.length - 1 ? '1px solid #333' : 'none',
                  cursor: 'pointer',
                }}
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Skills List */}
      <div style={{ padding: '0 16px', marginTop: 24, marginBottom: 0, flex: 1 }}>
        {selectedSkills.map((skill, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <button
              onClick={() => handleSkillRemove(skill)}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#22FF88',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <X size={16} color="black" />
            </button>
            <span style={{ color: '#fff', fontSize: 18, fontFamily: "'Roboto Serif', serif", fontWeight: 400 }}>{skill}</span>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, padding: 16, background: 'transparent', zIndex: 20 }}>
        <button
          onClick={() => onContinue(selectedSkills)}
          disabled={!isSkillsValid}
          style={{
            width: '100%',
            padding: '16px 0',
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 600,
            fontFamily: "'Roboto Serif', serif",
            background: isSkillsValid ? '#22FF88' : '#232323',
            color: isSkillsValid ? '#000' : '#888',
            border: 'none',
            opacity: isSkillsValid ? 1 : 0.7,
            transition: 'background 0.2s',
            cursor: isSkillsValid ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
