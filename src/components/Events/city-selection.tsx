import { useState } from "react"
import { X } from "lucide-react"
import Bangloremonument from "@/assets/bangalore monument.png"
import IndiaGate from "@/assets/unsplash_va77t8vGbJ8.png"
import MumbaiGateway from "@/assets/gateway of mumbai stylized image.png"

interface City {
  id: string
  name: string
  image: string
  available: boolean
}

interface CitySelectionProps {
  onClose: () => void
  onCitySelect: (cityId: string) => void
}

const cities: City[] = [
  { id: "delhi", name: "New Delhi", image: IndiaGate, available: true },
  { id: "bangalore", name: "Bangalore", image: Bangloremonument, available: false },
  { id: "mumbai", name: "Mumbai", image: MumbaiGateway, available: false },
]

export function CitySelection({ onClose, onCitySelect }: CitySelectionProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const handleCityClick = (city: City) => {
    if (!city.available) return

    setSelectedCity(city.id)

    // Flash green for a moment then proceed
    setTimeout(() => {
      onCitySelect(city.id)
    }, 300)
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-16">
        <div></div>
        <h1 className="text-white text-xl font-medium">Location</h1>
        <button onClick={onClose} className="text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6">
        <div className="text-center mb-8">
          <h2 className="text-white text-4xl font-bold mb-2">
            Select <span className="text-green-400 italic">CITY</span>
          </h2>
          <p className="text-white/70 text-lg">You can change it later</p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 gap-4">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => handleCityClick(city)}
              disabled={!city.available}
              className={`relative h-48 rounded-2xl overflow-hidden transition-all duration-300 ${
                selectedCity === city.id ? "ring-4 ring-green-400 scale-105" : ""
              } ${city.available ? "hover:scale-105" : "opacity-60"}`}
            >
              <img src={city.image || "/placeholder.svg"} alt={city.name} className="object-cover w-full h-full absolute inset-0" />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <h3 className="text-white text-xl font-bold mb-1">{city.name}</h3>
                {!city.available && <p className="text-white/70 text-sm">(Coming soon)</p>}
              </div>
              {selectedCity === city.id && <div className="absolute inset-0 bg-green-400/20 animate-pulse"></div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
