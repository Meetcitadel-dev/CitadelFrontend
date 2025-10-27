import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  BellIcon as BellIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  CalendarIcon as CalendarIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Events',
    href: '/events',
    icon: CalendarIcon,
    iconSolid: CalendarIconSolid
  },
  {
    name: 'Explore',
    href: '/explore',
    icon: MagnifyingGlassIcon,
    iconSolid: MagnifyingGlassIconSolid
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: UserIcon,
    iconSolid: UserIconSolid
  }
];

export default function ResponsiveNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll for mobile nav background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const isActive = (href: string) => {
    if (href === '/explore' && location.pathname === '/') return true;
    return location.pathname === href;
  };

  return (
    <>
      {/* Mobile Navigation */}
      <nav className="mobile-nav lg:hidden">
        <div className="container-responsive">
          <div className="flex items-center justify-between py-3">
            {/* Logo/Brand */}
            <Link 
              to="/explore" 
              className="text-xl font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            >
              Citadel
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="touch-target p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile menu items */}
          {isMobileMenuOpen && (
            <div className="animate-slide-up border-t border-white/10 pt-4 pb-6">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const active = isActive(item.href);
                  const Icon = active ? item.iconSolid : item.icon;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors touch-target ${
                        active 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 lg:fixed lg:inset-y-0 lg:z-50">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-black via-black/95 to-black backdrop-blur-xl border-r border-white/10 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-white/10">
            <Link
              to="/explore"
              className="text-2xl xl:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent hover:from-green-300 hover:to-blue-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded-lg"
            >
              Citadel
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const active = isActive(item.href);
              const Icon = active ? item.iconSolid : item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-400 shadow-lg shadow-green-500/10 border border-green-500/30'
                      : 'text-white/80 hover:bg-white/10 hover:text-white hover:shadow-md'
                  }`}
                >
                  <Icon className={`h-5 w-5 xl:h-6 xl:w-6 ${active ? 'text-green-400' : 'text-white/70 group-hover:text-white'}`} />
                  <span className="font-medium text-sm xl:text-base">{item.name}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full px-2.5 py-1 min-w-[24px] text-center shadow-lg shadow-red-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/98 to-black/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
        <div className="grid grid-cols-3 gap-0.5 px-2 py-2 safe-area-bottom">
          {navigationItems.map((item) => {
            const active = isActive(item.href);
            const Icon = active ? item.iconSolid : item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl transition-all duration-200 touch-target ${
                  active
                    ? 'text-green-400 bg-green-500/10 shadow-lg shadow-green-500/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="relative">
                  <Icon className={`h-6 w-6 mx-auto transition-transform ${active ? 'scale-110' : ''}`} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-red-500/40 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-medium ${active ? 'font-semibold' : ''}`}>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main content offset for desktop sidebar */}
      <div className="lg:pl-64">
        {/* Content goes here */}
      </div>
    </>
  );
}
