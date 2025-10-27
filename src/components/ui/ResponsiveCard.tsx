import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  loading?: boolean;
}

export default function ResponsiveCard({ 
  children, 
  className = '', 
  hover = false, 
  clickable = false,
  onClick,
  loading = false 
}: ResponsiveCardProps) {
  const baseClasses = "card-responsive";
  const hoverClasses = hover ? "hover:bg-white/10 hover:border-white/20" : "";
  const clickableClasses = clickable ? "cursor-pointer active:scale-98" : "";
  const loadingClasses = loading ? "loading-skeleton" : "";

  const cardClasses = cn(
    baseClasses,
    hoverClasses,
    clickableClasses,
    loadingClasses,
    className
  );

  if (loading) {
    return (
      <div className={cardClasses}>
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-white/20 rounded w-1/2 mb-4"></div>
          <div className="h-20 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
    >
      {children}
    </div>
  );
}
