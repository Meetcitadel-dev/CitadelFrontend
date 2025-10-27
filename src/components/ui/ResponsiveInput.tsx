import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  type?: string;
}

const ResponsiveInput = forwardRef<HTMLInputElement, ResponsiveInputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    leftIcon, 
    rightIcon, 
    fullWidth = true,
    className = '',
    ...props 
  }, ref) => {
    const inputClasses = cn(
      "form-responsive w-full px-3 py-2 text-white placeholder-white/50",
      "border border-white/20 rounded-lg bg-white/5",
      "focus:border-green-500 focus:ring-2 focus:ring-green-500/20",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      leftIcon && "pl-10",
      rightIcon && "pr-10",
      error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
      fullWidth && "w-full",
      className
    );

    return (
      <div className={cn("space-y-2", fullWidth && "w-full")}>
        {label && (
          <label className="block text-sm font-medium text-white">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
              {leftIcon}
            </div>
          )}
          
          {props.type === 'select' ? (
            <select
              ref={ref as any}
              className={inputClasses}
              {...props}
            >
              {props.children}
            </select>
          ) : (
            <input
              ref={ref}
              className={inputClasses}
              {...props}
            />
          )}
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="error-message">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-white/70">{helperText}</p>
        )}
      </div>
    );
  }
);

ResponsiveInput.displayName = 'ResponsiveInput';

export default ResponsiveInput;
