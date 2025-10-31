import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import Button from './button';

type ResponsiveButtonProps = PropsWithChildren<{
  loading?: boolean;
  fullWidth?: boolean;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}> & ButtonHTMLAttributes<HTMLButtonElement>;

export default function ResponsiveButton({
  loading = false,
  fullWidth = false,
  children,
  disabled,
  className,
  variant,
  ...props
}: ResponsiveButtonProps) {
  const normalizedVariant = variant === 'danger' ? 'destructive' : variant;
  return (
    <Button
      {...props}
      className={[fullWidth ? 'w-full' : '', className || ''].join(' ').trim()}
      variant={normalizedVariant}
      disabled={disabled || loading}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
}

 