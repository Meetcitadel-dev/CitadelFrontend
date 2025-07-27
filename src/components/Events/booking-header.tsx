interface BookingHeaderProps {
    waitingCount: number
  }
  
  export function BookingHeader({ waitingCount }: BookingHeaderProps) {
    return (
      <div className="text-center text-white mb-6">
        <h2 className="text-2xl font-bold mb-1">
          Book your next <span className="text-green-400 italic">DINNER</span>
        </h2>
        <p className="text-white/80 text-base">{waitingCount} people are waiting for you</p>
      </div>
    )
  }
  