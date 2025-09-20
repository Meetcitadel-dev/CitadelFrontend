import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAuthToken(): string | null {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

export function setAuthToken(token: string): void {
  localStorage.setItem('token', token)
}

export function removeAuthToken(): void {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
}

// Temporary function for testing - remove this in production
export function setTestToken(): void {
  // This is a test token - replace with a real one from your backend
  const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiZGVtbyIsInJvbGUiOiJPV05FUiIsImVtYWlsIjoicmFodWxAaHlkeWNvLmFpIiwiaWF0IjoxNzUzMzQ5ODI2LCJleHAiOjE3NTMzNTM0MjZ9.SfeKTorYGqOi7uNfWlEGhxcnyAu14eMBlwev0wj3OuE"
  setAuthToken(testToken)
}

/**
 * Format a date to a relative time string (e.g., "2 hours ago", "1 day ago")
 */
export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Validate if a string is a valid UUID
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Debounce function to limit API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function prefetchImages(urls: string[]): void {
  if (!Array.isArray(urls) || urls.length === 0) return
  
  // Remove duplicates and filter valid URLs
  const uniqueUrls = Array.from(new Set(urls.filter(url => typeof url === 'string' && url)))
  
  uniqueUrls.forEach((url, index) => {
    try {
      const img = new Image()
      
      // Set high priority for first few images
      if (index < 3) {
        img.fetchPriority = 'high'
      }
      
      // Add error handling to prevent console errors
      img.onerror = () => {
        // Silently handle errors - don't spam console
      }
      
      img.src = url
    } catch (error) {
      // Silently handle any errors during prefetching
    }
  })
}

/**
 * Enhanced prefetching with priority and error handling
 */
export function prefetchImagesWithPriority(urls: string[], priority: 'high' | 'low' = 'low'): void {
  if (!Array.isArray(urls) || urls.length === 0) return
  
  const uniqueUrls = Array.from(new Set(urls.filter(url => typeof url === 'string' && url)))
  
  uniqueUrls.forEach((url) => {
    try {
      const img = new Image()
      img.fetchPriority = priority
      img.onerror = () => {
        // Silently handle errors
      }
      img.src = url
    } catch (error) {
      // Silently handle any errors
    }
  })
}

/**
 * Prefetch images in batches to avoid overwhelming the browser
 */
export function prefetchImagesBatched(urls: string[], batchSize: number = 5): void {
  if (!Array.isArray(urls) || urls.length === 0) return
  
  const uniqueUrls = Array.from(new Set(urls.filter(url => typeof url === 'string' && url)))
  
  // Process in batches with small delays
  for (let i = 0; i < uniqueUrls.length; i += batchSize) {
    const batch = uniqueUrls.slice(i, i + batchSize)
    
    setTimeout(() => {
      batch.forEach((url, index) => {
        try {
          const img = new Image()
          img.fetchPriority = index === 0 ? 'high' : 'low'
          img.onerror = () => {}
          img.src = url
        } catch (error) {
          // Silently handle errors
        }
      })
    }, i * 50) // Small delay between batches
  }
}

/**
 * Track image loading performance
 */
export function trackImagePerformance(src: string, startTime?: number): void {
  if (typeof window === 'undefined') return
  
  const loadStart = startTime || performance.now()
  
  const img = new Image()
  img.onload = () => {
    const loadTime = performance.now() - loadStart
    console.log(`✅ Image loaded: ${src} (${loadTime.toFixed(2)}ms)`)
    
    // Track slow images
    if (loadTime > 1000) {
      console.warn(`⚠️ Slow image load: ${src} (${loadTime.toFixed(2)}ms)`)
    }
  }
  
  img.onerror = () => {
    const loadTime = performance.now() - loadStart
    console.error(`❌ Image failed: ${src} (${loadTime.toFixed(2)}ms)`)
  }
  
  img.src = src
}

/**
 * Preload critical images with performance tracking
 */
export function preloadCriticalImages(urls: string[]): void {
  if (!Array.isArray(urls) || urls.length === 0) return
  
  const startTime = performance.now()
  
  urls.forEach((url, index) => {
    if (typeof url === 'string' && url) {
      const img = new Image()
      img.fetchPriority = 'high'
      img.onload = () => {
        const loadTime = performance.now() - startTime
        console.log(`🚀 Critical image ${index + 1}/${urls.length} loaded: ${loadTime.toFixed(2)}ms`)
      }
      img.onerror = () => {
        console.error(`❌ Critical image failed: ${url}`)
      }
      img.src = url
    }
  })
}
