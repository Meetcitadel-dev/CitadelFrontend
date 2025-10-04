"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"

interface AdditionalPreferencesProps {
  onBack: () => void
  onContinue: (preferences: AdditionalPrefs) => void
}

interface AdditionalPrefs {
  relationshipStatus: string
  mealPreference: string
  vegetarianOnly: boolean
}

export function AdditionalPreferences({ onBack, onContinue }: AdditionalPreferencesProps) {
  const [relationshipStatus, setRelationshipStatus] = useState<string>("")
  const [mealPreference, setMealPreference] = useState<string>("")
  const [vegetarianOnly, setVegetarianOnly] = useState<boolean>(false)

  const relationshipOptions = [
    { id: "single", name: "Single" },
    { id: "relationship", name: "In relationship" },
    { id: "not-looking", name: "Not looking for anything" },
  ]

  const mealOptions = [
    { id: "everything", name: "Everything" },
    { id: "vegetarian", name: "Vegetarian" },
    { id: "vegan", name: "Vegan" },
  ]

  const handleContinue = () => {
    const preferences: AdditionalPrefs = {
      relationshipStatus,
      mealPreference,
      vegetarianOnly,
    }
    onContinue(preferences)
  }

  // Check if first two questions are answered
  const canContinue = relationshipStatus !== "" && mealPreference !== ""

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
        <div className="pb-8 px-6 pt-7">
          {/* Relationship Status Question */}
          <div style={{ marginBottom: '30px' }}>
            <h2 
              className="text-white text-lg font-bold leading-[135%] mb-[23px]"
              style={{
                fontFamily: 'Inter'
              }}
            >
              Select your relationship status*
            </h2>
            <div className="flex flex-col gap-3">
              {relationshipOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setRelationshipStatus(option.id)}
                  className="flex items-center justify-between hover:bg-gray-700/50 transition-colors w-full h-[60px] rounded-[15px] bg-[#111] border-none p-4"
                >
                  <span 
                    className="text-white text-lg font-medium"
                    style={{
                      fontFamily: 'Inter'
                    }}
                  >
                    {option.name}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      relationshipStatus === option.id ? "border-green-400 bg-green-400" : "border-gray-400"
                    }`}
                  >
                    {relationshipStatus === option.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Meal Preference Question */}
          <div style={{ marginBottom: '30px' }}>
            <p 
              className="text-white text-lg font-bold leading-[135%] mb-[23px]"
              style={{
                fontFamily: 'Inter'
              }}
            >
              Select your meal preference*
            </p>
            <div className="flex flex-col gap-3">
              {mealOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setMealPreference(option.id)}
                  className="flex items-center justify-between hover:bg-gray-700/50 transition-colors w-full h-[60px] rounded-[15px] bg-[#111] border-none p-4"
                >
                  <span 
                    className="text-white text-lg font-medium"
                    style={{
                      fontFamily: 'Inter'
                    }}
                  >
                    {option.name}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      mealPreference === option.id ? "border-green-400 bg-green-400" : "border-gray-400"
                    }`}
                  >
                    {mealPreference === option.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Vegetarian Question (moved from previous step) */}
          <div className="mb-8">
            <div className="flex items-center justify-between w-full pr-4">
              <span 
                className="text-white text-lg font-bold leading-[135%] flex-1"
                style={{
                  fontFamily: 'Inter'
                }}
              >
                I want only pure vegetarians at the table.
              </span>
              <button
                onClick={() => setVegetarianOnly(!vegetarianOnly)}
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
          fontFamily: 'Inter',
          fontSize: '18px',
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
