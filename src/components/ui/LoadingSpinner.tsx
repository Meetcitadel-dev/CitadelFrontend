import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = '', 
  text,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const spinnerClasses = cn(
    'animate-spin border-2 border-white/20 border-t-white rounded-full',
    sizeClasses[size],
    className
  );

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={spinnerClasses}></div>
      {text && (
        <p className="text-white/70 text-sm font-medium">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-black/80 rounded-lg p-8">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
