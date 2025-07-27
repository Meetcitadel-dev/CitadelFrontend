import { MapPin, RotateCcw } from "lucide-react"

interface LocationHeaderProps {
  city: string
  venue: string
}

export function LocationHeader({ city, venue }: LocationHeaderProps) {
  return (
    <div className="text-center text-white px-6">
      {/* Location Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm mb-6">
        <MapPin className="w-4 h-4" />
        <span className="text-sm font-medium">{city}</span>
        <div className="w-5 h-3 bg-gradient-to-b from-orange-500 via-white to-green-500 rounded-sm"></div>
      </div>

      {/* Venue Name */}
      <h1 className="text-4xl font-bold mb-2">{venue}</h1>

      {/* Change Location */}
      <button className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
        <span className="underline text-lg">Change location</span>
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  )
}
