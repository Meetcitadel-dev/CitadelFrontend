import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface AreaSelectionProps {
  city: string;
  onSelect: (areas: string[]) => void;
  onBack: () => void;
}

const areasByCity: Record<string, string[]> = {
  'New Delhi': ['South Delhi', 'Connaught Place', 'Hauz Khas', 'Saket', 'Gurgaon'],
  'Mumbai': ['Bandra', 'Andheri', 'Powai', 'Lower Parel', 'Colaba'],
  'Bangalore': ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'MG Road']
};

export default function AreaSelection({ city, onSelect, onBack }: AreaSelectionProps) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const areas = areasByCity[city] || [];

  const toggleArea = (area: string) => {
    setSelectedAreas(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const handleContinue = () => {
    if (selectedAreas.length > 0) {
      onSelect(selectedAreas);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">
          Where would you like to have <span className="text-green-400">DINNER?</span>
        </h2>
        <p className="text-white/70 text-sm">
          Select preferred areas in {city}
        </p>
      </div>

      {/* Area Chips */}
      <div className="flex flex-wrap gap-3">
        {areas.map((area) => (
          <button
            key={area}
            onClick={() => toggleArea(area)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedAreas.includes(area)
                ? 'bg-green-400 text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {area}
          </button>
        ))}
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={selectedAreas.length === 0}
        className={`w-full py-4 rounded-full font-semibold transition-all duration-200 ${
          selectedAreas.length > 0
            ? 'bg-green-400 text-black hover:bg-green-500'
            : 'bg-white/10 text-white/50 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
}

