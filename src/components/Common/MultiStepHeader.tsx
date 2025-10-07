import React from 'react';
import { ArrowLeft, X } from 'lucide-react';

interface MultiStepHeaderProps {
  title: string;
  onBack?: () => void;
  onClose?: () => void;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  className?: string;
  titleClassName?: string;
  variant?: 'light' | 'dark';
  currentStep?: number;
  totalSteps?: number;
}

const MultiStepHeader: React.FC<MultiStepHeaderProps> = ({
  title,
  onBack,
  onClose,
  showBackButton = true,
  showCloseButton = true,
  className = '',
  titleClassName = '',
  variant = 'light',
  currentStep,
  totalSteps
}) => {
  const isLight = variant === 'light';
  const textColor = isLight ? 'text-white' : 'text-gray-900';
  const hoverColor = isLight ? 'hover:text-gray-300' : 'hover:text-gray-600';

  return (
    <div className={`flex items-center justify-between px-6 flex-shrink-0 ${className}`}>
      {/* Left side - Back button or spacer */}
      <div className="w-6 h-6">
        {showBackButton && onBack ? (
          <button
            onClick={onBack}
            className={`${textColor} ${hoverColor} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full p-1`}
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        ) : null}
      </div>

      {/* Center - Title and optional step indicator */}
      <div className="flex-1 flex flex-col items-center">
        <h1 className={`${textColor} text-center font-semibold text-lg ${titleClassName}`}>
          {title}
        </h1>
        {currentStep && totalSteps && (
          <div className="flex items-center mt-1 space-x-1">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index < currentStep
                    ? isLight ? 'bg-white' : 'bg-blue-600'
                    : isLight ? 'bg-white/30' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right side - Close button or spacer */}
      <div className="w-6 h-6">
        {showCloseButton && onClose ? (
          <button
            onClick={onClose}
            className={`${textColor} ${hoverColor} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full p-1`}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default MultiStepHeader;
