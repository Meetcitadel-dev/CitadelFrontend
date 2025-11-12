import { useState } from 'react';
import { X } from 'lucide-react';
import CitySelection from './CitySelection';
import AreaSelection from './AreaSelection';
import PreferencesSelection from './PreferencesSelection';
import MatchingScreen from './MatchingScreen';
import { apiClient } from '@/lib/apiClient';
import { getAuthToken } from '@/lib/utils';

interface SetupModalProps {
  mode: 'full' | 'location-only';
  onComplete: () => void;
  onClose: () => void;
  initialCity?: string | null;
  initialAreas?: string[] | null;
}

type SetupStep = 'city' | 'area' | 'preferences' | 'matching';

export default function SetupModal({ mode, onComplete, onClose, initialCity, initialAreas }: SetupModalProps) {
  const [currentStep, setCurrentStep] = useState<SetupStep>('city');
  const [setupData, setSetupData] = useState({
    city: initialCity || '',
    preferredAreas: (initialAreas || []) as string[],
    budget: '',
    language: [] as string[],
    dietaryRestriction: '',
    drinksPreference: '',
    relationshipStatus: ''
  });

  const handleCitySelect = (city: string) => {
    setSetupData(prev => ({ ...prev, city, preferredAreas: [] }));
    setCurrentStep('area');
  };

  const handleAreaSelect = async (areas: string[], cityOverride?: string) => {
    setSetupData(prev => ({ ...prev, preferredAreas: areas }));

    // If mode is 'location-only', update location and complete
    if (mode === 'location-only') {
      try {
        const token = getAuthToken();
        if (!token) {
          console.error('No auth token found');
          alert('Please login again');
          return;
        }

        // Update user preferences with new city and areas
        const cityToUse = cityOverride || setupData.city;

        const response = await apiClient('/api/v1/dinner-preferences', {
          method: 'PATCH',
          token,
          body: {
            city: cityToUse,
            preferredAreas: areas
          }
        });

        if (response.success) {
          onComplete();
        } else {
          throw new Error(response.message || 'Failed to update location');
        }
      } catch (error: any) {
        console.error('Error updating location:', error);
        alert(error.message || 'Failed to update location. Please try again.');
      }
    } else {
      // Otherwise continue to preferences
      setCurrentStep('preferences');
    }
  };

  const handlePreferencesSelect = (preferences: any) => {
    setSetupData(prev => ({ ...prev, ...preferences }));
    setCurrentStep('matching');
  };

  const handleMatchingComplete = () => {
    // After matching completes, proceed to payment (handled by parent)
    onComplete();
  };

  const handleBack = () => {
    if (currentStep === 'area') setCurrentStep('city');
    else if (currentStep === 'preferences') setCurrentStep('area');
  };

  // Show matching screen without modal wrapper
  if (currentStep === 'matching') {
    return <MatchingScreen onComplete={handleMatchingComplete} />;
  }

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
            <CitySelection onSelect={handleCitySelect} initialCity={setupData.city} />
          )}
          {currentStep === 'area' && (
            <AreaSelection
              city={setupData.city}
              onSelect={(areas) => handleAreaSelect(areas, setupData.city)}
              onBack={handleBack}
              initialSelectedAreas={setupData.preferredAreas}
            />
          )}
          {currentStep === 'preferences' && (
            <PreferencesSelection
              onSelect={handlePreferencesSelect}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
}

