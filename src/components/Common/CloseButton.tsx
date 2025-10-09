import React from 'react';
import { X } from 'lucide-react';

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'light' | 'dark';
  ariaLabel?: string;
}

const CloseButton: React.FC<CloseButtonProps> = ({
  onClick,
  className = '',
  size = 'md',
  variant = 'default',
  ariaLabel = 'Close'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const variantClasses = {
    default: 'text-gray-500 hover:text-gray-700',
    light: 'text-white hover:text-gray-300',
    dark: 'text-gray-800 hover:text-gray-600'
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${variantClasses[variant]}
        transition-colors
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:ring-opacity-50
        rounded-full
        p-1
        hover:bg-gray-100
        hover:bg-opacity-10
        ${className}
      `}
      aria-label={ariaLabel}
      type="button"
    >
      <X className={sizeClasses[size]} />
    </button>
  );
};

export default CloseButton;
