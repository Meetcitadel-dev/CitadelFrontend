import React, { Suspense, ComponentType, LazyExoticComponent } from 'react';
import { performanceMonitor } from './performance';

// Loading component for lazy-loaded components
const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center min-h-[200px] bg-black">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
      <p className="text-white text-sm">{message}</p>
    </div>
  </div>
);

// Error boundary for lazy-loaded components
class LazyLoadErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
    performanceMonitor.measure('LazyLoad Error', () => {
      // Log error details for debugging
      console.error('Component failed to load:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    });
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      
      return (
        <div className="flex items-center justify-center min-h-[200px] bg-black">
          <div className="text-center text-white">
            <p className="text-lg mb-2">⚠️ Failed to load component</p>
            <p className="text-sm text-gray-400">Please refresh the page</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced lazy loading with performance tracking
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName: string,
  loadingMessage?: string,
  fallbackComponent?: React.ComponentType
): LazyExoticComponent<T> {
  const LazyComponent = React.lazy(() => {
    const startTime = performance.now();
    performanceMonitor.start(`LazyLoad: ${componentName}`);
    
    return importFn()
      .then((module) => {
        const loadTime = performance.now() - startTime;
        performanceMonitor.end(`LazyLoad: ${componentName}`);
        
        console.log(`📦 Lazy loaded ${componentName} in ${loadTime.toFixed(2)}ms`);
        
        // Warn about slow loading components
        if (loadTime > 1000) {
          console.warn(`🐌 Slow lazy load: ${componentName} took ${loadTime.toFixed(2)}ms`);
        }
        
        return module;
      })
      .catch((error) => {
        performanceMonitor.end(`LazyLoad: ${componentName}`);
        console.error(`❌ Failed to lazy load ${componentName}:`, error);
        throw error;
      });
  });

  // Return wrapped component with error boundary and suspense
  const WrappedComponent = (props: any) => (
    <LazyLoadErrorBoundary fallback={fallbackComponent}>
      <Suspense fallback={<LoadingSpinner message={loadingMessage} />}>
        <LazyComponent {...props} />
      </Suspense>
    </LazyLoadErrorBoundary>
  );

  // Set display name for debugging
  WrappedComponent.displayName = `LazyLoaded(${componentName})`;
  
  return WrappedComponent as any;
}

// Preload a lazy component
export function preloadLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName: string
): Promise<void> {
  performanceMonitor.start(`Preload: ${componentName}`);
  
  return importFn()
    .then(() => {
      performanceMonitor.end(`Preload: ${componentName}`);
      console.log(`🚀 Preloaded ${componentName}`);
    })
    .catch((error) => {
      performanceMonitor.end(`Preload: ${componentName}`);
      console.error(`❌ Failed to preload ${componentName}:`, error);
    });
}

// Batch preload multiple components
export async function preloadComponents(
  components: Array<{
    importFn: () => Promise<{ default: ComponentType<any> }>;
    name: string;
  }>
): Promise<void> {
  const batchName = `Preload Batch (${components.length} components)`;
  performanceMonitor.start(batchName);
  
  try {
    await Promise.all(
      components.map(({ importFn, name }) => preloadLazyComponent(importFn, name))
    );
    performanceMonitor.end(batchName);
    console.log(`✅ Preloaded ${components.length} components`);
  } catch (error) {
    performanceMonitor.end(batchName);
    console.error('❌ Batch preload failed:', error);
  }
}

// Hook for intersection observer-based lazy loading
export function useIntersectionLazyLoad(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hasLoaded, setHasLoaded] = React.useState(false);

  React.useEffect(() => {
    if (hasLoaded || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasLoaded(true);
          callback();
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [callback, hasLoaded, options]);

  return { ref, hasLoaded };
}

// Lazy load images with intersection observer
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = React.useState(placeholder || '');
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const { ref, hasLoaded } = useIntersectionLazyLoad(() => {
    if (src && !isLoaded) {
      performanceMonitor.start(`LazyImage: ${src.split('/').pop()}`);
      
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        performanceMonitor.end(`LazyImage: ${src.split('/').pop()}`);
      };
      img.onerror = () => {
        setIsError(true);
        performanceMonitor.end(`LazyImage: ${src.split('/').pop()}`);
      };
      img.src = src;
    }
  });

  return {
    ref,
    src: imageSrc,
    isLoaded,
    isError,
    hasStartedLoading: hasLoaded
  };
}

// Common lazy-loaded components for the app
export const LazyOnboardingPage = createLazyComponent(
  () => import('../pages/onboarding'),
  'OnboardingPage',
  'Loading onboarding...'
);

export const LazyExplorePage = createLazyComponent(
  () => import('../pages/explore'),
  'ExplorePage',
  'Loading explore...'
);

export const LazyEventsPage = createLazyComponent(
  () => import('../pages/events'),
  'EventsPage',
  'Loading events...'
);

export const LazyChatsPage = createLazyComponent(
  () => import('../pages/chats'),
  'ChatsPage',
  'Loading chats...'
);

export const LazyProfilePage = createLazyComponent(
  () => import('../pages/editprofile'),
  'ProfilePage',
  'Loading profile...'
);

export const LazySettingsPage = createLazyComponent(
  () => import('../pages/settings'),
  'SettingsPage',
  'Loading settings...'
);

export const LazyGridviewPage = createLazyComponent(
  () => import('../pages/gridview'),
  'GridviewPage',
  'Loading profiles...'
);

export const LazyNotificationPage = createLazyComponent(
  () => import('../pages/notification'),
  'NotificationPage',
  'Loading notifications...'
);
