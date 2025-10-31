import { useState } from 'react';
import IndiaGate from '@/assets/unsplash_va77t8vGbJ8.png';
import MumbaiGateway from '@/assets/gateway of mumbai stylized image.png';
import BangaloreMonument from '@/assets/bangalore monument.png';

interface CitySelectionProps {
  onSelect: (city: string) => void;
}

const cities = [
  { id: 'new-delhi', name: 'New Delhi', image: IndiaGate, available: true },
  { id: 'bangalore', name: 'Bangalore', image: BangaloreMonument, available: false },
  { id: 'mumbai', name: 'Mumbai', image: MumbaiGateway, available: false }
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
      <div className="grid grid-cols-2 gap-4">
        {cities.map((city) => (
          <button
            key={city.id}
            onClick={() => city.available && handleCityClick(city.name)}
            disabled={!city.available}
            className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
              selectedCity === city.name
                ? 'ring-4 ring-green-400 scale-105'
                : city.available
                  ? 'hover:scale-105'
                  : 'opacity-60 cursor-not-allowed'
            }`}
            style={{ height: '180px' }}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${city.image})`,
                filter: city.available ? 'brightness(0.7)' : 'brightness(0.4) grayscale(0.5)'
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-end pb-6 px-4">
              <span className="text-2xl font-bold text-white text-center mb-1">
                {city.name}
              </span>

              {!city.available && (
                <span className="text-xs text-white/70 bg-black/50 px-3 py-1 rounded-full">
                  Coming soon
                </span>
              )}

              {selectedCity === city.name && (
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-green-400 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-black"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
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

