import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface AreaSelectionProps {
  city: string;
  onSelect: (areas: string[]) => void;
  onBack: () => void;
  initialSelectedAreas?: string[];
}

const areasByCity: Record<string, string[]> = {
  'New Delhi': ['CP', 'Gurgaon', 'South Delhi', 'Hauz Khas', 'Saket'],
  'Mumbai': ['Bandra', 'Andheri', 'Powai', 'Lower Parel', 'Colaba'],
  'Bangalore': ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'MG Road']
};

export default function AreaSelection({ city, onSelect, onBack, initialSelectedAreas }: AreaSelectionProps) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>(initialSelectedAreas || []);
  const areas = areasByCity[city] || [];

  useEffect(() => {
    const available = areasByCity[city] || [];
    const initial =
      (initialSelectedAreas || []).filter(area => available.includes(area));
    setSelectedAreas(initial);
  }, [city, initialSelectedAreas]);

  const toggleArea = (area: string) => {
    setSelectedAreas(prev =>
      prev.includes(area)
        ? []
        : [area]
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

      {/* Area Grid */}
      {areas.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-white/70">
          Areas for {city || 'this city'} are coming soon. Please check back later.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => toggleArea(area)}
              className={`relative overflow-hidden transition-all duration-300 ${
                selectedAreas.includes(area)
                  ? 'ring-4 ring-green-400'
                  : 'hover:scale-105'
              }`}
              style={{
                height: '102px',
                borderRadius: '15px',
                background: '#111',
                border: 'none'
              }}
            >
              <div className="flex h-full w-full items-center justify-center transition-transform duration-300">
                <span
                  style={{
                    color: '#FFFFFF',
                    textAlign: 'center',
                    fontFamily: 'Inter',
                    fontSize: '18px',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: '135%'
                  }}
                >
                  {area}
                </span>
              </div>

              {selectedAreas.includes(area) && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-black"
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
            </button>
          ))}
        </div>
      )}

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

