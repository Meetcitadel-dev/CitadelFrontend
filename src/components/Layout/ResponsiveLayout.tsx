import React, { ReactNode } from 'react';
import ResponsiveNavigation from '../Navigation/ResponsiveNavigation';
import { useAuth } from '@/hooks/useAuth';

interface ResponsiveLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
  className?: string;
}

export default function ResponsiveLayout({ 
  children, 
  showNavigation = true, 
  className = '' 
}: ResponsiveLayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      {showNavigation && isAuthenticated && <ResponsiveNavigation />}
      
      <main className={`${showNavigation && isAuthenticated ? 'pb-20 lg:pb-0 lg:pl-64' : ''} ${className}`}>
        <div className="container-responsive min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
