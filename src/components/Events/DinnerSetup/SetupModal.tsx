import { useState } from 'react';
import { X } from 'lucide-react';
import CitySelection from './CitySelection';
import AreaSelection from './AreaSelection';
import PreferencesSelection from './PreferencesSelection';
import PersonalityQuiz from './PersonalityQuiz';

interface SetupModalProps {
  onComplete: () => void;
  onClose: () => void;
}

type SetupStep = 'city' | 'area' | 'preferences' | 'quiz';

export default function SetupModal({ onComplete, onClose }: SetupModalProps) {
  const [currentStep, setCurrentStep] = useState<SetupStep>('city');
  const [setupData, setSetupData] = useState({
    city: '',
    preferredAreas: [] as string[],
    budget: '',
    language: [] as string[],
    dietaryRestriction: '',
    drinksPreference: '',
    relationshipStatus: ''
  });

  const handleCitySelect = (city: string) => {
    setSetupData(prev => ({ ...prev, city }));
    setCurrentStep('area');
  };

  const handleAreaSelect = (areas: string[]) => {
    setSetupData(prev => ({ ...prev, preferredAreas: areas }));
    setCurrentStep('preferences');
  };

  const handlePreferencesSelect = (preferences: any) => {
    setSetupData(prev => ({ ...prev, ...preferences }));
    setCurrentStep('quiz');
  };

  const handleQuizComplete = () => {
    onComplete();
  };

  const handleBack = () => {
    if (currentStep === 'area') setCurrentStep('city');
    else if (currentStep === 'preferences') setCurrentStep('area');
    else if (currentStep === 'quiz') setCurrentStep('preferences');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-black border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Content */}
        <div className="p-6">
          {currentStep === 'city' && (
            <CitySelection onSelect={handleCitySelect} />
          )}
          {currentStep === 'area' && (
            <AreaSelection
              city={setupData.city}
              onSelect={handleAreaSelect}
              onBack={handleBack}
            />
          )}
          {currentStep === 'preferences' && (
            <PreferencesSelection
              onSelect={handlePreferencesSelect}
              onBack={handleBack}
            />
          )}
          {currentStep === 'quiz' && (
            <PersonalityQuiz
              setupData={setupData}
              onComplete={handleQuizComplete}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
}

