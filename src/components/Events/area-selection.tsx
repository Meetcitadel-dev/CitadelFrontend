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

export function AreaSelection({ onBack, onClose, onAreaSelect, cityName }: AreaSelectionProps) {
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
      <div className="flex items-center justify-between p-6 pt-16">
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
        <div className="text-center mb-8">
          <h2 className="text-white text-3xl font-bold leading-tight">
            Where would you like
            <br />
            to have <span className="text-green-400 italic">DINNER?</span>
          </h2>
        </div>

        {/* Areas Grid */}
        <div className="grid grid-cols-2 gap-4">
          {delhiAreas.map((area) => (
            <button
              key={area.id}
              onClick={() => handleAreaClick(area)}
              className={`relative h-32 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                selectedArea === area.id
                  ? "bg-gray-800/50 border-green-400 scale-105"
                  : "bg-gray-800/50 border-gray-700"
              }`}
            >
              <span className="text-white text-lg font-medium">{area.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
