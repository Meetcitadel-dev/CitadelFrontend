import { MapPin, RotateCcw } from "lucide-react"

interface LocationHeaderProps {
  city: string
  venue: string
  onChangeLocation?: () => void
}

export function LocationHeader({ city, venue, onChangeLocation }: LocationHeaderProps) {
  return (
    <div className="text-center text-white px-6 w-full">
      {/* Location Badge */}
      <div
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm mx-auto"
        style={{
          minWidth: '153px',
          height: '36px',
          borderRadius: '80px',
          border: '1px solid #FFFFFF'
        }}
      >
        <MapPin className="w-4 h-4" />
        <span className="text-sm font-medium" style={{ fontFamily: 'Inter' }}>{city}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="13" viewBox="0 0 19 13" fill="none">
          <path d="M0 4.43164H19V8.56799H0V4.43164Z" fill="#E6E7E8"/>
          <path d="M16.0312 0H2.96875C1.00136 0 0 1.45511 0 3.24999V4.4318H19V3.24999C19 1.45511 17.9986 0 16.0312 0Z" fill="#FF9933"/>
          <path d="M0 9.75017C0 11.5451 1.00136 13.0002 2.96875 13.0002H16.0312C17.9986 13.0002 19 11.5451 19 9.75017V8.56836H0V9.75017Z" fill="#128807"/>
        </svg>
      </div>

      {/* Venue Name */}
      <h1
        className="mt-4 mb-2 px-4"
        style={{
          color: '#FFFFFF',
          textAlign: 'center',
          fontFamily: '"Roboto Serif"',
          fontSize: '32px',
          fontStyle: 'normal',
          fontWeight: 600,
          lineHeight: '1.2'
        }}
      >
        {venue}
      </h1>

      {/* Change Location */}
      <button
        onClick={onChangeLocation}
        className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer"
        style={{
          marginTop: '8px'
        }}
      >
        <span
          style={{
            color: '#FFFFFF',
            textAlign: 'center',
            fontFamily: 'Inter',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: '135%',
            textDecoration: 'underline'
          }}
        >
          Change location
        </span>
        <RotateCcw className="w-4 h-4" style={{ color: '#FFFFFF' }} />
      </button>
    </div>
  )
}
