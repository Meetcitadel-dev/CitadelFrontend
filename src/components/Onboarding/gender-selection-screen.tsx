import { useState } from "react"

const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
]

interface GenderSelectionScreenProps {
  value?: string
  nameValue?: string
  onContinue: (result: { name: string; gender: string }) => void
  onBack?: () => void
}

export default function GenderSelectionScreen({ value, nameValue, onContinue, onBack }: GenderSelectionScreenProps) {
  const [selectedGender, setSelectedGender] = useState(value || "")
  const [name, setName] = useState(nameValue || "")

  const isReady = selectedGender.length > 0 && name.trim().length > 1

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender)
  }

  const handleContinue = () => {
    if (!isReady) return
    onContinue({ name: name.trim(), gender: selectedGender })
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-[393px] mx-auto h-screen flex flex-col relative" style={{ fontFamily: "'Inter', sans-serif" }}>
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
        <div className="px-6 mt-6 mb-6">
          <h1 className="text-3xl font-bold m-0 text-left" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.5px' }}>
            Who are you?
          </h1>
        </div>

        {/* Name Input */}
        <div className="px-6">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Write your full name"
            className="w-full text-white placeholder:text-white/50"
            style={{
              background: '#1E1E1E',
              borderRadius: 18,
              border: '1px solid #2F2F2F',
              padding: '18px 20px',
              fontFamily: "'Inter', sans-serif",
              fontSize: 18,
              outline: 'none',
            }}
          />
        </div>

        {/* Gender Options */}
        <div className="px-6 mt-8">
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: '#B5B5B5', display: 'block', marginBottom: 16 }}>Gender</span>
          <div className="flex items-center gap-4">
            {GENDER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleGenderSelect(option.value)}
                className="flex-1 py-3"
                style={{
                  background: selectedGender === option.value ? '#22C55E' : '#1F1F1F',
                  color: selectedGender === option.value ? '#000000' : '#FFFFFF',
                  borderRadius: 18,
                  border: '1px solid #2F2F2F',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={handleContinue}
            disabled={!isReady}
            className="w-full py-4 rounded-full text-lg font-semibold border-none transition-all"
            style={{
              fontFamily: "'Inter', sans-serif",
              background: isReady ? '#22C55E' : '#232323',
              color: isReady ? '#000' : '#888',
              opacity: isReady ? 1 : 0.7,
              cursor: isReady ? 'pointer' : 'not-allowed',
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

