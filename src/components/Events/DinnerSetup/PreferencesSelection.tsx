import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface PreferencesSelectionProps {
  onSelect: (preferences: any) => void;
  onBack: () => void;
}

export default function PreferencesSelection({ onSelect, onBack }: PreferencesSelectionProps) {
  const [language, setLanguage] = useState<string[]>([]);
  const [dietaryRestriction, setDietaryRestriction] = useState('');

  const toggleLanguage = (lang: string) => {
    setLanguage(prev =>
      prev.includes(lang)
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  };

  const handleContinue = () => {
    if (language.length > 0 && dietaryRestriction) {
      onSelect({
        language,
        dietaryRestriction
      });
    }
  };

  const isValid = language.length > 0 && dietaryRestriction;

  return (
    <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2">
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
          Your <span className="text-green-400">Dinner</span>
        </h2>
      </div>

      {/* Dietary Preferences */}
      {/* <div>
        <label className="block text-white font-medium mb-4">
          Dietary preferences
        </label>
        <div className="space-y-3">
          <button
            onClick={() => setDietaryRestriction('everything')}
            className={`w-full py-4 px-6 rounded-xl text-left font-medium transition-all flex items-center justify-between ${
              dietaryRestriction === 'everything'
                ? 'bg-green-400 text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <span>Everything</span>
            {dietaryRestriction === 'everything' && (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </div> */}

      {/* Language */}
      <div>
        <label className="block text-white font-medium mb-4">
          What languages are you willing to speak at dinner?*
        </label>
        <div className="space-y-3">
          {['English', 'Hindi'].map((lang) => (
            <button
              key={lang}
              onClick={() => toggleLanguage(lang)}
              className={`w-full py-4 px-6 rounded-xl text-left font-medium transition-all flex items-center justify-between ${
                language.includes(lang)
                  ? 'bg-green-400 text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span>{lang}</span>
              {language.includes(lang) && (
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Meal Preference */}
      <div>
        <label className="block text-white font-medium mb-4">
          Select your meal preference*
        </label>
        <div className="space-y-3">
          {[
            { value: 'everything', label: 'Everything' },
            { value: 'vegetarian', label: 'Vegetarian' },
            { value: 'vegan', label: 'Vegan' }
          ].map((meal) => (
            <button
              key={meal.value}
              onClick={() => setDietaryRestriction(meal.value)}
              className={`w-full py-4 px-6 rounded-xl text-left font-medium transition-all flex items-center justify-between ${
                dietaryRestriction === meal.value
                  ? 'bg-green-400 text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span>{meal.label}</span>
              {dietaryRestriction === meal.value && (
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!isValid}
        className={`w-full py-4 rounded-full font-semibold transition-all duration-200 ${
          isValid
            ? 'bg-green-400 text-black hover:bg-green-500'
            : 'bg-white/10 text-white/50 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
}

