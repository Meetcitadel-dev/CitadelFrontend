"use client"

import { useState } from "react"

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
  const [selectedBudget, setSelectedBudget] = useState<string>("$")
  const [vegetarianOnly, setVegetarianOnly] = useState<boolean>(false)

  const languages = [
    { id: "English", name: "English" },
    { id: "Hindi", name: "Hindi" },
  ]

  const budgetOptions = [
    { id: "$", name: "$" },
    { id: "$$", name: "$$" },
    { id: "$$$", name: "$$$" },
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
      <div className="flex items-center justify-center p-6 pt-16 relative flex-shrink-0">
        <h1 className="text-white text-xl font-medium">Your Dinner</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pb-8">
          {/* Languages Question */}
          <div className="mb-8">
            <h2 className="text-white text-2xl font-bold mb-6 leading-tight">
              What languages are you willing to speak at dinner?*
            </h2>
            <div className="space-y-3">
              {languages.map((language) => (
                <button
                  key={language.id}
                  onClick={() => handleLanguageToggle(language.id)}
                  className="w-full p-4 rounded-2xl bg-gray-800/50 border border-gray-700 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
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
            <h2 className="text-white text-2xl font-bold mb-6 leading-tight">
              How much are you willing to spend at dinner?*
            </h2>
            <div className="space-y-3">
              {budgetOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleBudgetSelect(option.id)}
                  className="w-full p-4 rounded-2xl bg-gray-800/50 border border-gray-700 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
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
            <button
              onClick={handleVegetarianToggle}
              className="w-full p-4 rounded-2xl bg-gray-800/50 border border-gray-700 flex items-center justify-between hover:bg-gray-700/50 transition-colors text-left"
            >
              <span className="text-white text-xl font-bold leading-tight">
                I want only pure vegetarians at the table.
              </span>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  vegetarianOnly ? "border-green-400 bg-green-400" : "border-gray-400"
                }`}
              >
                {vegetarianOnly && <div className="w-2 h-2 bg-white rounded-full"></div>}
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
