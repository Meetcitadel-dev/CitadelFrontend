import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface PreferencesSelectionProps {
  onSelect: (preferences: any) => void;
  onBack: () => void;
}

export default function PreferencesSelection({ onSelect, onBack }: PreferencesSelectionProps) {
  const [budget, setBudget] = useState('');
  const [language, setLanguage] = useState<string[]>([]);
  const [dietaryRestriction, setDietaryRestriction] = useState('');
  const [drinksPreference, setDrinksPreference] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');

  const toggleLanguage = (lang: string) => {
    setLanguage(prev =>
      prev.includes(lang)
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  };

  const handleContinue = () => {
    if (budget && language.length > 0 && dietaryRestriction) {
      onSelect({
        budget,
        language,
        dietaryRestriction,
        drinksPreference,
        relationshipStatus
      });
    }
  };

  const isValid = budget && language.length > 0 && dietaryRestriction;

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
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
          Tell us your <span className="text-green-400">PREFERENCES</span>
        </h2>
      </div>

      {/* Budget */}
      <div>
        <label className="block text-white font-medium mb-3">Budget *</label>
        <div className="flex gap-3">
          {['low', 'medium', 'high'].map((b) => (
            <button
              key={b}
              onClick={() => setBudget(b)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                budget === b
                  ? 'bg-green-400 text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {b === 'low' ? '$' : b === 'medium' ? '$$' : '$$$'}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <label className="block text-white font-medium mb-3">Language *</label>
        <div className="flex flex-wrap gap-3">
          {['English', 'Hindi', 'Everything'].map((lang) => (
            <button
              key={lang}
              onClick={() => toggleLanguage(lang)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                language.includes(lang)
                  ? 'bg-green-400 text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Dietary Restriction */}
      <div>
        <label className="block text-white font-medium mb-3">Dietary Restriction *</label>
        <div className="flex flex-wrap gap-3">
          {['veg', 'non-veg', 'vegan', 'any'].map((diet) => (
            <button
              key={diet}
              onClick={() => setDietaryRestriction(diet)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all capitalize ${
                dietaryRestriction === diet
                  ? 'bg-green-400 text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {diet === 'non-veg' ? 'Non-Veg' : diet.charAt(0).toUpperCase() + diet.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Drinks Preference */}
      <div>
        <label className="block text-white font-medium mb-3">Drinks Preference</label>
        <div className="flex gap-3">
          {['yes', 'no', 'occasionally'].map((drink) => (
            <button
              key={drink}
              onClick={() => setDrinksPreference(drink)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all capitalize ${
                drinksPreference === drink
                  ? 'bg-green-400 text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {drink}
            </button>
          ))}
        </div>
      </div>

      {/* Relationship Status */}
      <div>
        <label className="block text-white font-medium mb-3">Relationship Status</label>
        <div className="grid grid-cols-2 gap-3">
          {['single', 'in-relationship', 'married', 'prefer-not-to-say'].map((status) => (
            <button
              key={status}
              onClick={() => setRelationshipStatus(status)}
              className={`py-3 rounded-xl text-sm font-medium transition-all ${
                relationshipStatus === status
                  ? 'bg-green-400 text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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

