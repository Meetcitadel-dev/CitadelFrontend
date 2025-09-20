"use client"

import { useState } from "react"
import { ArrowLeft, X } from "lucide-react"

interface Area {
  id: string
  name: string
}

interface AreaSelectionProps {
  onBack: () => void
  onClose: () => void
  onAreaSelect: (areaId: string) => void
  cityName: string
}

const delhiAreas: Area[] = [
  { id: "dwarka", name: "Dwarka" },
  { id: "chanakyapuri", name: "Chanakyapuri" },
  { id: "gurgaon", name: "Gurgaon" },
  { id: "vasant-kunj", name: "Vasant Kunj" },
  { id: "faridabad", name: "Faridabad" },
  { id: "hauz-khas", name: "Hauz Khas" },
]

export function AreaSelection({ onBack, onClose, onAreaSelect }: AreaSelectionProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null)

  const handleAreaClick = (area: Area) => {
    setSelectedArea(area.id)

    // Flash green border for a moment then proceed
    setTimeout(() => {
      onAreaSelect(area.id)
    }, 500) // Increased to 500ms to show the green border effect better
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6" style={{ paddingTop: '35px', paddingBottom: '0px' }}>
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl font-medium">Location</h1>
        <button onClick={onClose} className="text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6">
        <div className="text-center" style={{ marginTop: '30px' }}>
          <h2 
            className="text-white font-bold leading-tight"
            style={{
              fontSize: '28px',
              fontFamily: 'Inter'
            }}
          >
            Where would you like
            <br />
            to have <span className="text-green-400 italic">DINNER?</span>
          </h2>
        </div>

        {/* Areas Grid */}
        <div className="grid grid-cols-2 gap-4" style={{ marginTop: '30px', gap: '15px' }}>
          {delhiAreas.map((area) => (
            <button
              key={area.id}
              onClick={() => handleAreaClick(area)}
              className={`relative transition-all duration-300 hover:scale-105 ${
                selectedArea === area.id ? "ring-4 ring-green-400 scale-105" : ""
              }`}
              style={{
                width: '173px',
                height: '102px',
                borderRadius: '15px',
                background: '#111',
                border: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <span 
                style={{
                  color: '#FFFFFF',
                  textAlign: 'center',
                  fontFamily: 'Inter',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '135%' // 24.3px
                }}
              >
                {area.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
