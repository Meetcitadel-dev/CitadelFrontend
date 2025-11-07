import { useState } from "react"

interface DateOfBirthScreenProps {
  value?: { day: string; month: string; year: string }
  onContinue: (dob: { day: string; month: string; year: string }) => void
  onBack?: () => void
}

export default function DateOfBirthScreen({ value, onContinue, onBack }: DateOfBirthScreenProps) {
  const [day, setDay] = useState(value?.day || "")
  const [month, setMonth] = useState(value?.month || "")
  const [year, setYear] = useState(value?.year || "")

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 2 && /^\d*$/.test(value)) {
      setDay(value)
    }
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 2 && /^\d*$/.test(value)) {
      setMonth(value)
    }
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setYear(value)
    }
  }

  const isDateValid = () => {
    const dayNum = Number.parseInt(day)
    const monthNum = Number.parseInt(month)
    const yearNum = Number.parseInt(year)

    return (
      day.length === 2 &&
      month.length === 2 &&
      year.length === 4 &&
      dayNum >= 1 &&
      dayNum <= 31 &&
      monthNum >= 1 &&
      monthNum <= 12 &&
      yearNum >= 1900 &&
      yearNum <= new Date().getFullYear()
    )
  }

  const isReady = isDateValid()

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
            Date of birth
          </h1>
        </div>

        {/* Date Input Fields */}
        <div className="px-6">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="DD"
              value={day}
              onChange={handleDayChange}
              maxLength={2}
              className="text-white placeholder:text-white/50"
              style={{
                width: 80,
                height: 56,
                background: '#1E1E1E',
                borderRadius: 18,
                border: '1px solid #2F2F2F',
                textAlign: 'center',
                fontFamily: "'Inter', sans-serif",
                fontSize: 18,
                fontWeight: 400,
                outline: 'none',
                padding: 0,
              }}
            />
            <input
              type="text"
              placeholder="MM"
              value={month}
              onChange={handleMonthChange}
              maxLength={2}
              className="text-white placeholder:text-white/50"
              style={{
                width: 80,
                height: 56,
                background: '#1E1E1E',
                borderRadius: 18,
                border: '1px solid #2F2F2F',
                textAlign: 'center',
                fontFamily: "'Inter', sans-serif",
                fontSize: 18,
                fontWeight: 400,
                outline: 'none',
                padding: 0,
              }}
            />
            <input
              type="text"
              placeholder="YYYY"
              value={year}
              onChange={handleYearChange}
              maxLength={4}
              className="text-white placeholder:text-white/50"
              style={{
                width: 120,
                height: 56,
                background: '#1E1E1E',
                borderRadius: 18,
                border: '1px solid #2F2F2F',
                textAlign: 'center',
                fontFamily: "'Inter', sans-serif",
                fontSize: 18,
                fontWeight: 400,
                outline: 'none',
                padding: 0,
              }}
            />
          </div>
        </div>

        {/* Continue Button */}
        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={() => onContinue({ day, month, year })}
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
