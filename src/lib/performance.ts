// Performance monitoring utilities for Citadel application

interface PerformanceMetrics {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private isEnabled: boolean;

  constructor() {
    // Enable performance monitoring in development and staging
    this.isEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true';
  }

  // Start timing a performance metric
  start(name: string, metadata?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const startTime = performance.now();
    this.metrics.set(name, {
      name,
      startTime,
      metadata
    });

    console.log(`🚀 Performance: Started tracking "${name}"`);
  }

  // End timing a performance metric
  end(name: string): number | null {
    if (!this.isEnabled) return null;

    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`⚠️ Performance: No metric found for "${name}"`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;

    console.log(`✅ Performance: "${name}" completed in ${duration.toFixed(2)}ms`);

    // Log slow operations
    if (duration > 1000) {
      console.warn(`🐌 Performance: Slow operation "${name}" took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  // Measure a function execution time
  measure<T>(name: string, fn: () => T, metadata?: Record<string, any>): T {
    if (!this.isEnabled) return fn();

    this.start(name, metadata);
    try {
      const result = fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  // Measure an async function execution time
  async measureAsync<T>(name: string, fn: () => Promise<T>, metadata?: Record<string, any>): Promise<T> {
    if (!this.isEnabled) return fn();

    this.start(name, metadata);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  // Get all metrics
  getMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  // Get metrics summary
  getSummary(): Record<string, any> {
    const metrics = this.getMetrics();
    const completed = metrics.filter(m => m.duration !== undefined);

    if (completed.length === 0) {
      return { totalMetrics: 0, averageDuration: 0, slowestOperation: null };
    }

    const totalDuration = completed.reduce((sum, m) => sum + (m.duration || 0), 0);
    const averageDuration = totalDuration / completed.length;
    const slowestOperation = completed.reduce((slowest, current) => 
      (current.duration || 0) > (slowest.duration || 0) ? current : slowest
    );

    return {
      totalMetrics: completed.length,
      averageDuration: averageDuration.toFixed(2),
      slowestOperation: {
        name: slowestOperation.name,
        duration: slowestOperation.duration?.toFixed(2)
      }
    };
  }

  // Clear all metrics
  clear(): void {
    this.metrics.clear();
  }

  // Log performance summary
  logSummary(): void {
    if (!this.isEnabled) return;

    const summary = this.getSummary();
    console.group('📊 Performance Summary');
    console.log('Total operations:', summary.totalMetrics);
    console.log('Average duration:', summary.averageDuration + 'ms');
    if (summary.slowestOperation) {
      console.log('Slowest operation:', summary.slowestOperation.name, summary.slowestOperation.duration + 'ms');
    }
    console.groupEnd();
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Web Vitals monitoring
export const measureWebVitals = () => {
  if (!('performance' in window)) return;

  // Measure First Contentful Paint (FCP)
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
        console.log(`🎨 First Contentful Paint: ${entry.startTime.toFixed(2)}ms`);
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['paint'] });
  } catch (e) {
    // Ignore if not supported
  }

  // Measure Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log(`🖼️ Largest Contentful Paint: ${lastEntry.startTime.toFixed(2)}ms`);
  });

  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    // Ignore if not supported
  }

  // Measure Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    }
    console.log(`📐 Cumulative Layout Shift: ${clsValue.toFixed(4)}`);
  });

  try {
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    // Ignore if not supported
  }
};

// API call performance tracking
export const trackAPICall = async <T>(
  url: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  const name = `API: ${url}`;
  return performanceMonitor.measureAsync(name, apiCall, { url, type: 'api' });
};

// Component render performance tracking
export const trackComponentRender = (componentName: string) => {
  const name = `Render: ${componentName}`;
  performanceMonitor.start(name, { type: 'render', component: componentName });
  
  return () => {
    performanceMonitor.end(name);
  };
};

// Image loading performance tracking
export const trackImageLoad = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const name = `Image: ${src.split('/').pop()}`;
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
};

// Route navigation performance tracking
export const trackRouteNavigation = (from: string, to: string) => {
  const name = `Navigation: ${from} → ${to}`;
  performanceMonitor.start(name, { from, to, type: 'navigation' });
  
  return () => {
    performanceMonitor.end(name);
  };
};

// Memory usage monitoring
export const logMemoryUsage = () => {
  if (!('memory' in performance)) return;

  const memory = (performance as any).memory;
  console.group('💾 Memory Usage');
  console.log('Used:', (memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB');
  console.log('Total:', (memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + ' MB');
  console.log('Limit:', (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + ' MB');
  console.groupEnd();
};

// Bundle size analysis helper
export const logBundleInfo = () => {
  console.group('📦 Bundle Information');
  console.log('Environment:', import.meta.env.MODE);
  console.log('Development:', import.meta.env.DEV);
  console.log('Production:', import.meta.env.PROD);
  console.groupEnd();
};
