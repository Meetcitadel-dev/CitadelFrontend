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
      <div className="flex items-center justify-between px-6" style={{ paddingTop: '35px', paddingBottom: '0px' }}>
        <div></div>
        <h1 className="text-white text-xl font-medium">Location</h1>
        <button onClick={onClose} className="text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6">
        <div className="text-center" style={{ marginTop: '30px' }}>
          <h2 className="text-white text-4xl font-bold mb-2">
            Select <span className="text-green-400 italic">CITY</span>
          </h2>
          <p 
            style={{
              color: '#FFFFFF',
              textAlign: 'center',
              fontFamily: 'Inter',
              fontSize: '15px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '135%', // 20.25px
              marginBottom: '32px'
            }}
          >
            You can change it later
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 gap-4">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => handleCityClick(city)}
              disabled={!city.available}
              className={`relative overflow-hidden transition-all duration-300 ${
                selectedCity === city.id ? "ring-4 ring-green-400 scale-105" : ""
              } ${city.available ? "hover:scale-105" : "opacity-60"}`}
              style={{
                height: '184px',
                borderRadius: '15px',
                backgroundColor: '#111'
              }}
            >
              <img 
                src={city.image || "/placeholder.svg"} 
                alt={city.name} 
                className="object-cover w-full h-full absolute inset-0"
                style={{
                  borderRadius: '15px'
                }}
              />
              <div className="absolute inset-0 bg-black/40" style={{ borderRadius: '15px' }}></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center p-4">
                <h3 className="text-white text-xl font-bold mb-1 text-center">{city.name}</h3>
                {!city.available && <p className="text-white/70 text-sm text-center">(Coming soon)</p>}
              </div>
              {selectedCity === city.id && <div className="absolute inset-0 bg-green-400/20 animate-pulse"></div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
