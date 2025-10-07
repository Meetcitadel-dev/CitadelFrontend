import { useEffect, useRef, useCallback } from 'react';
import { performanceMonitor, trackComponentRender, trackRouteNavigation } from '../lib/performance';
import { useLocation } from 'react-router-dom';

// Hook for tracking component render performance
export const useComponentPerformance = (componentName: string) => {
  const renderEndRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Start tracking render
    renderEndRef.current = trackComponentRender(componentName);

    // End tracking when component unmounts or re-renders
    return () => {
      if (renderEndRef.current) {
        renderEndRef.current();
        renderEndRef.current = null;
      }
    };
  }, [componentName]);

  // Manual render tracking for specific operations
  const trackOperation = useCallback((operationName: string) => {
    const fullName = `${componentName}: ${operationName}`;
    performanceMonitor.start(fullName);
    
    return () => {
      performanceMonitor.end(fullName);
    };
  }, [componentName]);

  return { trackOperation };
};

// Hook for tracking route navigation performance
export const useRoutePerformance = () => {
  const location = useLocation();
  const previousLocationRef = useRef<string>('');
  const navigationEndRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const currentPath = location.pathname;
    const previousPath = previousLocationRef.current;

    if (previousPath && previousPath !== currentPath) {
      // End previous navigation tracking
      if (navigationEndRef.current) {
        navigationEndRef.current();
      }

      // Start new navigation tracking
      navigationEndRef.current = trackRouteNavigation(previousPath, currentPath);
    }

    previousLocationRef.current = currentPath;

    // Cleanup on unmount
    return () => {
      if (navigationEndRef.current) {
        navigationEndRef.current();
        navigationEndRef.current = null;
      }
    };
  }, [location.pathname]);
};

// Hook for tracking API call performance
export const useAPIPerformance = () => {
  const trackAPICall = useCallback(async <T>(
    endpoint: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    const name = `API: ${endpoint}`;
    return performanceMonitor.measureAsync(name, apiCall, { 
      endpoint, 
      type: 'api',
      timestamp: Date.now()
    });
  }, []);

  return { trackAPICall };
};

// Hook for tracking image loading performance
export const useImagePerformance = () => {
  const trackImageLoad = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const name = `Image: ${src.split('/').pop() || 'unknown'}`;
      performanceMonitor.start(name, { src, type: 'image' });

      const img = new Image();
      img.onload = () => {
        performanceMonitor.end(name);
        resolve();
      };
      img.onerror = () => {
        performanceMonitor.end(name);
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });
  }, []);

  const trackMultipleImages = useCallback(async (sources: string[]): Promise<void> => {
    const name = `Images: Batch load (${sources.length} images)`;
    performanceMonitor.start(name, { count: sources.length, type: 'image-batch' });

    try {
      await Promise.all(sources.map(src => trackImageLoad(src)));
      performanceMonitor.end(name);
    } catch (error) {
      performanceMonitor.end(name);
      throw error;
    }
  }, [trackImageLoad]);

  return { trackImageLoad, trackMultipleImages };
};

// Hook for tracking form submission performance
export const useFormPerformance = (formName: string) => {
  const trackSubmission = useCallback(async <T>(
    submitFn: () => Promise<T>
  ): Promise<T> => {
    const name = `Form: ${formName} submission`;
    return performanceMonitor.measureAsync(name, submitFn, { 
      form: formName, 
      type: 'form-submission' 
    });
  }, [formName]);

  const trackValidation = useCallback((validationFn: () => boolean | Promise<boolean>) => {
    const name = `Form: ${formName} validation`;
    if (validationFn.constructor.name === 'AsyncFunction') {
      return performanceMonitor.measureAsync(name, validationFn as () => Promise<boolean>, { 
        form: formName, 
        type: 'form-validation' 
      });
    } else {
      return performanceMonitor.measure(name, validationFn as () => boolean, { 
        form: formName, 
        type: 'form-validation' 
      });
    }
  }, [formName]);

  return { trackSubmission, trackValidation };
};

// Hook for tracking search performance
export const useSearchPerformance = () => {
  const trackSearch = useCallback(async <T>(
    query: string,
    searchFn: () => Promise<T>
  ): Promise<T> => {
    const name = `Search: "${query}"`;
    return performanceMonitor.measureAsync(name, searchFn, { 
      query, 
      queryLength: query.length,
      type: 'search' 
    });
  }, []);

  return { trackSearch };
};

// Hook for performance summary and reporting
export const usePerformanceSummary = () => {
  const getSummary = useCallback(() => {
    return performanceMonitor.getSummary();
  }, []);

  const logSummary = useCallback(() => {
    performanceMonitor.logSummary();
  }, []);

  const clearMetrics = useCallback(() => {
    performanceMonitor.clear();
  }, []);

  const getMetrics = useCallback(() => {
    return performanceMonitor.getMetrics();
  }, []);

  // Log summary on component unmount (useful for page-level components)
  useEffect(() => {
    return () => {
      if (import.meta.env.DEV) {
        logSummary();
      }
    };
  }, [logSummary]);

  return {
    getSummary,
    logSummary,
    clearMetrics,
    getMetrics
  };
};

// Hook for monitoring component re-renders
export const useRenderCount = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;

    if (import.meta.env.DEV) {
      console.log(
        `🔄 ${componentName} render #${renderCount.current} ` +
        `(${timeSinceLastRender}ms since last render)`
      );

      // Warn about frequent re-renders
      if (timeSinceLastRender < 100 && renderCount.current > 5) {
        console.warn(
          `⚠️ ${componentName} is re-rendering frequently! ` +
          `Consider optimizing with React.memo, useMemo, or useCallback.`
        );
      }
    }
  });

  return renderCount.current;
};
