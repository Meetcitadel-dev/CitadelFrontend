import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import { Input } from './input';

export type ResponsiveInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const ResponsiveInput = forwardRef<HTMLInputElement, ResponsiveInputProps>(
  ({ label, helperText, leftIcon, rightIcon, className, type, children, ...props }, ref) => {
    const control = type === 'select' ? (
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/60">
            {leftIcon}
          </div>
        )}
        <select
          className={[
            'w-full px-3 py-2 rounded-md bg-white/5 text-white border border-white/20 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed',
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
            className || '',
          ].join(' ').trim()}
          {...(props as any)}
        >
          {children}
        </select>
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60">
            {rightIcon}
          </div>
        )}
      </div>
    ) : (
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/60">
            {leftIcon}
          </div>
        )}
        <Input
          ref={ref}
          className={[
            leftIcon ? 'pl-10' : '',
            rightIcon ? 'pr-10' : '',
            className || '',
          ].join(' ').trim()}
          type={type}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60">
            {rightIcon}
          </div>
        )}
      </div>
    );

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-white/80 mb-1">{label}</label>
        )}
        {control}
        {helperText && (
          <p className="mt-1 text-xs text-white/60">{helperText}</p>
        )}
      </div>
    );
  }
);

ResponsiveInput.displayName = 'ResponsiveInput';

export default ResponsiveInput;

 