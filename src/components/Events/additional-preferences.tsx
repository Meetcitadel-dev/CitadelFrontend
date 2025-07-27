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
      <div className="flex items-center justify-between p-6 pt-16 flex-shrink-0">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl font-medium">Your Dinner</h1>
        <div className="w-6"></div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pb-8">
          {/* Relationship Status Question */}
          <div className="mb-8">
            <h2 className="text-white text-2xl font-bold mb-6">Select your relationship status*</h2>
            <div className="space-y-3">
              {relationshipOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setRelationshipStatus(option.id)}
                  className="w-full p-4 rounded-2xl bg-gray-800/50 border border-gray-700 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-white text-lg font-medium">{option.name}</span>
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
          <div className="mb-8">
            <h2 className="text-white text-2xl font-bold mb-6">Select your meal preference*</h2>
            <div className="space-y-3">
              {mealOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setMealPreference(option.id)}
                  className="w-full p-4 rounded-2xl bg-gray-800/50 border border-gray-700 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-white text-lg font-medium">{option.name}</span>
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
            <button
              onClick={() => setWantToDrink(!wantToDrink)}
              className="w-full p-4 rounded-2xl bg-gray-800/50 border border-gray-700 flex items-center justify-between hover:bg-gray-700/50 transition-colors text-left"
            >
              <span className="text-white text-2xl font-bold">Do you want to drink?</span>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  wantToDrink ? "border-green-400 bg-green-400" : "border-gray-400"
                }`}
              >
                {wantToDrink && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Continue Button */}
      <div className="p-6 flex-shrink-0">
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full py-4 rounded-2xl text-xl font-semibold transition-colors ${
            canContinue ? "bg-green-400 text-black hover:bg-green-300" : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
