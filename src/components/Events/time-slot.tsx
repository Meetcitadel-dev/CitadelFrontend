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
      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
        isSelected ? "border-green-400 bg-green-400/10" : "border-white/20 bg-white/5 hover:border-white/30"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-left">
          <div className="text-white text-lg font-medium mb-0.5">{date}</div>
          <div className="text-white/70 text-base">{time}</div>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            isSelected ? "border-green-400 bg-green-400" : "border-white/40"
          }`}
        >
          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
        </div>
      </div>
    </button>
  )
}
