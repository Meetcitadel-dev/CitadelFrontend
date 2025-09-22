"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"

interface EditPreferencesProps {
  onBack: () => void
  onSave: (preferences: UserPreferences) => void
}

interface UserPreferences {
  languages: string[]
  vegetarianOnly: boolean
}

export function EditPreferences({ onBack, onSave }: EditPreferencesProps) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"])
  

  const languages = [
    { id: "English", name: "English" },
    { id: "Hindi", name: "Hindi" },
  ]

  

  const handleLanguageToggle = (languageId: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(languageId) ? prev.filter((id) => id !== languageId) : [...prev, languageId],
    )
  }

  

  

  const handleContinue = () => {
    const preferences: UserPreferences = {
      languages: selectedLanguages,
      vegetarianOnly: false,
    }
    onSave(preferences)
  }

  // Check if required question is answered (at least one language selected)
  const canContinue = selectedLanguages.length > 0

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 flex-shrink-0" style={{ paddingTop: '35px', paddingBottom: '0px' }}>
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 
          style={{
            color: '#FFFFFF',
            textAlign: 'center',
            fontFamily: 'Inter',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '135%' // 21.6px
          }}
        >
          Your Dinner
        </h1>
        <div className="w-6"></div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="pb-8" style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '28px' }}>
          {/* Languages Question */}
          <div style={{ marginBottom: '30px' }}>
            <h2 
              style={{
                width: '346px',
                color: '#FFFFFF',
                fontFamily: 'Inter',
                fontSize: '18px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '135%', // 24.3px
                marginBottom: '23px'
              }}
            >
              What languages are you willing to speak at dinner?*
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {languages.map((language) => (
                <button
                  key={language.id}
                  onClick={() => handleLanguageToggle(language.id)}
                  className="flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                  style={{
                    width: '345px',
                    height: '60px',
                    flexShrink: 0,
                    borderRadius: '15px',
                    background: '#111',
                    border: 'none',
                    padding: '16px'
                  }}
                >
                  <span className="text-white text-lg font-medium">{language.name}</span>
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      selectedLanguages.includes(language.id) ? "border-green-400 bg-green-400" : "border-gray-400"
                    }`}
                  >
                    {selectedLanguages.includes(language.id) && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Removed budget question per requirements */}

          {/* Vegetarian question moved to additional preferences */}
        </div>
      </div>

      {/* Fixed Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!canContinue}
        className={`transition-colors ${
          canContinue ? "hover:bg-green-300" : "cursor-not-allowed"
        }`}
        style={{
          display: 'flex',
          height: '50px',
          padding: '14.5px 16px',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          flex: '1 0 0',
          borderRadius: '48px',
          background: canContinue ? '#1BEA7B' : '#666666',
          color: canContinue ? '#040404' : '#999999',
          border: 'none',
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          right: '16px',
          zIndex: 10
        }}
      >
        Continue
      </button>
    </div>
  )
}
