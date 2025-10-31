import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

type ResponsiveCardProps = PropsWithChildren<{
  className?: string;
  hover?: boolean;
  clickable?: boolean;
}> & HTMLAttributes<HTMLDivElement>;

export default function ResponsiveCard({ className, children, ...props }: ResponsiveCardProps) {
  const { hover, clickable, ...rest } = props as ResponsiveCardProps;
  return (
    <div
      className={cn(
        'rounded-lg border border-white/10 bg-black/40 p-4',
        hover && 'hover:bg-white/5',
        clickable && 'cursor-pointer',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

 