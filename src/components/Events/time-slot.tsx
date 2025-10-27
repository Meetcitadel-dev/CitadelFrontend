"use client"

interface TimeSlotProps {
  date: string
  time: string
  isSelected: boolean
  onSelect: () => void
}

export function TimeSlot({ date, time, isSelected, onSelect }: TimeSlotProps) {
  return (
    <button
      onClick={onSelect}
      className="w-full transition-all duration-200 hover:bg-white/5"
      style={{
        maxWidth: '100%',
        minHeight: '80px',
        borderRadius: '15px',
        background: '#111111',
        border: 'none',
        padding: '20px',
        cursor: 'pointer'
      }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="text-left flex-1">
          <div
            style={{
              color: '#FFFFFF',
              fontFamily: 'Inter',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '135%',
              marginBottom: '4px'
            }}
          >
            {date}
          </div>
          <div
            style={{
              color: '#FFFFFF',
              fontFamily: 'Inter',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '135%',
              opacity: 0.8
            }}
          >
            {time}
          </div>
        </div>
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            isSelected ? "border-green-400 bg-green-400" : "border-white"
          }`}
        >
          {isSelected && <div className="w-2 h-2 bg-black rounded-full"></div>}
        </div>
      </div>
    </button>
  )
}
