"use client"

import { ArrowLeft } from "lucide-react"

interface PreferencesDisplayProps {
  onBack: () => void
  onEditPreferences: () => void
  onContinue: () => void
}

export function PreferencesDisplay({ onBack, onEditPreferences, onContinue }: PreferencesDisplayProps) {
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-16">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl font-medium">Your Dinner</h1>
        <div className="w-6"></div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-8">
        {/* Preferences Card */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-8">
          {/* Budget */}
          <div className="mb-8">
            <h3 className="text-green-400 text-lg font-medium mb-2">Budget</h3>
            <p className="text-white text-2xl font-bold">500 Rs</p>
          </div>

          {/* Dietary Preferences */}
          <div className="mb-8">
            <h3 className="text-green-400 text-lg font-medium mb-2">Dietary preferences</h3>
            <p className="text-white text-2xl font-bold">No restrictions</p>
          </div>

          {/* Language */}
          <div>
            <h3 className="text-green-400 text-lg font-medium mb-2">Language</h3>
            <p className="text-white text-2xl font-bold">English</p>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={onEditPreferences}
          className="w-full py-4 rounded-full border-2 border-white text-white text-lg font-medium mb-8 hover:bg-white/10 transition-colors"
        >
          Edit my preferences
        </button>

        {/* Continue Button */}
        <div className="pb-8">
          <button
            onClick={onContinue}
            className="w-full py-4 rounded-2xl bg-green-400 text-black text-xl font-semibold hover:bg-green-300 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
