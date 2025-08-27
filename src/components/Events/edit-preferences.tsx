"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"

interface EditPreferencesProps {
  onBack: () => void
  onSave: (preferences: UserPreferences) => void
}

interface UserPreferences {
  languages: string[]
  budget: string
  vegetarianOnly: boolean
}

export function EditPreferences({ onBack, onSave }: EditPreferencesProps) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"])
  const [selectedBudget, setSelectedBudget] = useState<string>("500")
  const [vegetarianOnly, setVegetarianOnly] = useState<boolean>(false)

  const languages = [
    { id: "English", name: "English" },
    { id: "Hindi", name: "Hindi" },
  ]

  const budgetOptions = [
    { id: "500", name: "500 Rs" },
    { id: "1000", name: "1000 Rs" },
    { id: "1500", name: "1500 Rs" },
  ]

  const handleLanguageToggle = (languageId: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(languageId) ? prev.filter((id) => id !== languageId) : [...prev, languageId],
    )
  }

  const handleBudgetSelect = (budget: string) => {
    setSelectedBudget(budget)
  }

  const handleVegetarianToggle = () => {
    setVegetarianOnly(!vegetarianOnly)
  }

  const handleContinue = () => {
    const preferences: UserPreferences = {
      languages: selectedLanguages,
      budget: selectedBudget,
      vegetarianOnly,
    }
    onSave(preferences)
  }

  // Check if first two questions are answered (at least one language and budget selected)
  const canContinue = selectedLanguages.length > 0 && selectedBudget !== ""

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

          {/* Budget Question */}
          <div className="mb-8">
            <h2 
              style={{
                display: 'flex',
                width: '346px',
                height: '47px',
                flexDirection: 'column',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#FFFFFF',
                fontFamily: 'Inter',
                fontSize: '18px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '135%', // 24.3px
                marginBottom: '24px'
              }}
            >
              How much are you willing to spend at dinner?*
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {budgetOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleBudgetSelect(option.id)}
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
                  <span className="text-white text-lg font-medium">{option.name}</span>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedBudget === option.id ? "border-green-400 bg-green-400" : "border-gray-400"
                    }`}
                  >
                    {selectedBudget === option.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Vegetarian Question */}
          <div className="mb-8">
            <div className="flex items-center" style={{ width: '345px', justifyContent: 'space-between', paddingRight: '16px' }}>
              <span 
                style={{
                  width: '267px',
                  color: '#FFFFFF',
                  fontFamily: 'Inter',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '135%' // 24.3px
                }}
              >
                I want only pure vegetarians at the table.
              </span>
              <button
                onClick={handleVegetarianToggle}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  vegetarianOnly ? "border-green-400 bg-green-400" : "border-gray-400"
                }`}
              >
                {vegetarianOnly && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </button>
            </div>
          </div>
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
