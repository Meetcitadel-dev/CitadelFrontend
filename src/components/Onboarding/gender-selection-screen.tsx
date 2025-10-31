import { useState } from "react"

interface GenderSelectionScreenProps {
  value?: string
  onContinue: (gender: string) => void
  onBack?: () => void
}

export default function GenderSelectionScreen({ value, onContinue, onBack }: GenderSelectionScreenProps) {
  const [selectedGender, setSelectedGender] = useState(value || "")

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender)
  }

  const handleContinue = () => {
    if (selectedGender) {
      onContinue(selectedGender)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md mx-auto h-screen flex flex-col relative" style={{ fontFamily: "'Roboto Serif', serif" }}>
        {/* Header */}
        <div className="flex items-center px-6 pt-8 h-14">
          <button
            onClick={onBack}
            className="bg-transparent border-none p-0 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
              <path d="M10.5 20L1 10.5M1 10.5L10.5 1M1 10.5L20 10.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Title */}
        <div className="px-6 mt-7 mb-8">
          <h1 className="text-3xl font-bold m-0 text-left" style={{ fontFamily: "'Roboto Serif', serif", letterSpacing: '-0.5px' }}>
            Select your gender
          </h1>
        </div>

        {/* Gender Options */}
        <div className="px-6 space-y-4">
          {/* Male Option */}
          <button
            onClick={() => handleGenderSelect("male")}
            className={`w-full py-4 px-6 rounded-xl border-2 transition-all ${
              selectedGender === "male"
                ? "border-green-500 bg-green-500/10"
                : "border-gray-700 bg-[#232323] hover:border-gray-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">👨</div>
                <span className="text-lg font-semibold">Male</span>
              </div>
              {selectedGender === "male" && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22C55E"/>
                  <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </button>

          {/* Female Option */}
          <button
            onClick={() => handleGenderSelect("female")}
            className={`w-full py-4 px-6 rounded-xl border-2 transition-all ${
              selectedGender === "female"
                ? "border-green-500 bg-green-500/10"
                : "border-gray-700 bg-[#232323] hover:border-gray-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">👩</div>
                <span className="text-lg font-semibold">Female</span>
              </div>
              {selectedGender === "female" && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22C55E"/>
                  <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </button>
        </div>

        {/* Continue Button */}
        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={handleContinue}
            disabled={!selectedGender}
            className="w-full py-4 rounded-full text-lg font-semibold border-none transition-all"
            style={{
              fontFamily: "'Roboto Serif', serif",
              background: selectedGender ? '#22C55E' : '#232323',
              color: selectedGender ? '#000' : '#888',
              opacity: selectedGender ? 1 : 0.7,
              cursor: selectedGender ? 'pointer' : 'not-allowed',
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

