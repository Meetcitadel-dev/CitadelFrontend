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
  wantToDrink: boolean
}

export function AdditionalPreferences({ onBack, onContinue }: AdditionalPreferencesProps) {
  const [relationshipStatus, setRelationshipStatus] = useState<string>("")
  const [mealPreference, setMealPreference] = useState<string>("")
  const [wantToDrink, setWantToDrink] = useState<boolean>(false)

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
      wantToDrink,
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
        <div className="pb-8" style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '28px' }}>
          {/* Relationship Status Question */}
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
              Select your relationship status*
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {relationshipOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setRelationshipStatus(option.id)}
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
                  <span 
                    style={{
                      color: '#FFFFFF',
                      fontFamily: 'Inter',
                      fontSize: '18px',
                      fontWeight: 500
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
                marginBottom: '23px'
              }}
            >
              Select your meal preference*
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mealOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setMealPreference(option.id)}
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
                  <span 
                    style={{
                      color: '#FFFFFF',
                      fontFamily: 'Inter',
                      fontSize: '18px',
                      fontWeight: 500
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

          {/* Drink Question */}
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
                Do you want to drink?
              </span>
              <button
                onClick={() => setWantToDrink(!wantToDrink)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  wantToDrink ? "border-green-400 bg-green-400" : "border-gray-400"
                }`}
              >
                {wantToDrink && <div className="w-2 h-2 bg-white rounded-full"></div>}
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
