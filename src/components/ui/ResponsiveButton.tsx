import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export default function ResponsiveButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  fullWidth = false
}: ResponsiveButtonProps) {
  const baseClasses = "btn-responsive touch-target font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black";
  
  const variantClasses = {
    primary: "btn-responsive-primary",
    secondary: "btn-responsive-secondary",
    outline: "border border-white/20 text-white hover:bg-white/10",
    ghost: "text-white hover:bg-white/10",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm min-h-[36px]",
    md: "px-4 py-2 text-base min-h-[44px]",
    lg: "px-6 py-3 text-lg min-h-[52px]"
  };

  const disabledClasses = disabled || loading ? "opacity-50 cursor-not-allowed" : "";
  const fullWidthClasses = fullWidth ? "w-full" : "";

  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    fullWidthClasses,
    className
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
