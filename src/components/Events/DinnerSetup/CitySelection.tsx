import { useState } from 'react';
import { MapPin } from 'lucide-react';

interface CitySelectionProps {
  onSelect: (city: string) => void;
}

const cities = [
  { id: 'new-delhi', name: 'New Delhi', image: '/assets/india-gate.png' },
  { id: 'mumbai', name: 'Mumbai', image: '/assets/gateway-mumbai.png' },
  { id: 'bangalore', name: 'Bangalore', image: '/assets/bangalore-monument.png' }
];

export default function CitySelection({ onSelect }: CitySelectionProps) {
  const [selectedCity, setSelectedCity] = useState('');

  const handleCityClick = (cityName: string) => {
    setSelectedCity(cityName);
    // Auto-proceed after selection
    setTimeout(() => {
      onSelect(cityName);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Select <span className="text-green-400">CITY</span>
        </h2>
        <p className="text-white/70 text-sm">
          You can change it later
        </p>
      </div>

      {/* City Cards */}
      <div className="space-y-4">
        {cities.map((city) => (
          <button
            key={city.id}
            onClick={() => handleCityClick(city.name)}
            className={`w-full relative overflow-hidden rounded-2xl transition-all duration-300 ${
              selectedCity === city.name
                ? 'ring-2 ring-green-400 scale-105'
                : 'hover:scale-102'
            }`}
            style={{ height: '120px' }}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${city.image})`,
                filter: 'brightness(0.6)'
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

            {/* Content */}
            <div className="relative h-full flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-white" />
                <span className="text-xl font-semibold text-white">
                  {city.name}
                </span>
              </div>

              {selectedCity === city.name && (
                <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-black"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

