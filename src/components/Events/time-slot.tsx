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
      className="transition-all duration-200"
      style={{
        width: '345px', // Adjusted to fit within container (393px - 48px padding)
        height: '80px',
        flexShrink: 0,
        borderRadius: '15px',
        background: '#111111',
        border: 'none',
        padding: '16px',
        cursor: 'pointer',
        margin: '0 auto' // Center align each row
      }}
    >
      <div className="flex items-center justify-between">
        <div className="text-left">
          <div 
            style={{
              color: '#FFFFFF',
              fontFamily: 'Inter',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '135%', // 21.6px
              marginBottom: '2px'
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
              lineHeight: '135%' // 18.9px
            }}
          >
            {time}
          </div>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            isSelected ? "border-green-400 bg-green-400" : "border-white"
          }`}
        >
          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
        </div>
      </div>
    </button>
  )
}
