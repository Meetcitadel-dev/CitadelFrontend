// Enhanced API client with performance tracking and caching
import { performanceMonitor } from './performance';
import { setAuthToken, ensureValidToken, getAuthToken } from './utils';
export type ApiClientOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  token?: string;
  cache?: boolean;
  timeout?: number;
  retries?: number;
  // When true, include cookies (for refresh/logout and CSRF-protected routes)
  withCredentials?: boolean;
};

function getApiUrl(url: string) {
  //const base = import.meta.env.VITE_API_URL;
  
  // If url is absolute (starts with http), return as is
  if (/^https?:\/\//.test(url)) return url;
  
  // If base is not defined, use localhost:3001 as default (backend port)
  const apiBase = 'https://citadelbackend-3.onrender.com';
  // const apiBase = 'http://localhost:3001';
  
  // Otherwise, prepend base URL
  return apiBase.replace(/\/$/, '') + (url.startsWith('/') ? url : '/' + url);
}

// Simple in-memory cache for GET requests
const apiCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Cache cleanup interval (5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of apiCache.entries()) {
    if (now - value.timestamp > value.ttl) {
      apiCache.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Timeout helper
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
}

// Retry helper
async function withRetries<T>(
  fn: () => Promise<T>,
  retries: number,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetries(fn, retries - 1, delay * 2); // Exponential backoff
    }
    throw error;
  }
}

export async function apiClient<T = any>(
  url: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const method = options.method || 'GET';
  const timeout = options.timeout || 10000; // 10 second default timeout
  const retries = options.retries || 0;
  const useCache = options.cache !== false && method === 'GET';

  // Generate cache key
  const cacheKey = `${method}:${url}:${JSON.stringify(options.body || {})}`;

  // Check cache for GET requests
  if (useCache) {
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      console.log(`📦 Cache hit for ${url}`);
      return cached.data;
    }
  }

  const performanceKey = `API: ${method} ${url}`;
  performanceMonitor.start(performanceKey, {
    url,
    method,
    cached: false,
    retries: options.retries || 0
  });

  const makeRequest = async (): Promise<Response> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Automatically include auth token if available
    const authToken = options.token || getAuthToken();
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    // Include credentials (cookies) if requested
    if (options.withCredentials) {
      fetchOptions.credentials = 'include';
    }

    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const apiUrl = getApiUrl(url);
    const res = await fetch(apiUrl, fetchOptions);
    if (!res.ok) {
      const errorText = await res.text();
      const err: any = new Error(errorText || res.statusText);
      err.status = res.status;
      throw err;
    }
    return res;
  };

  try {
    // Only attempt token refresh if we have an existing token (user was logged in)
    if (!options.token) {
      const existingToken = getAuthToken();
      if (existingToken) {
        await ensureValidToken();
      }
    }
    let hasRefreshed = false;
    const exec = async (): Promise<Response> => {
      try {
        return await (retries > 0
          ? withRetries(() => withTimeout(makeRequest(), timeout), retries)
          : withTimeout(makeRequest(), timeout)
        );
      } catch (e: any) {
        // If unauthorized, attempt a single refresh then retry once
        if (!hasRefreshed && (e?.status === 401 || e?.status === 403 || e?.message?.includes('401') || e?.message?.includes('403'))) {
          try {
            // Attempt refresh using a direct fetch to avoid circular imports
            const refreshUrl = getApiUrl('/api/v1/auth/refresh');
            const refreshRes = await fetch(refreshUrl, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }
            });
            const refreshJson = await refreshRes.json().catch(() => ({} as any));
            if (refreshRes.ok && refreshJson?.success && refreshJson?.tokens?.accessToken) {
              setAuthToken(refreshJson.tokens.accessToken);
              // Update header token for the retry if caller provided one
              if (options && refreshJson.tokens.accessToken) {
                options.token = refreshJson.tokens.accessToken;
              }
              hasRefreshed = true;
              return await (retries > 0
                ? withRetries(() => withTimeout(makeRequest(), timeout), retries)
                : withTimeout(makeRequest(), timeout)
              );
            }
          } catch (_) {
            // fallthrough
          }
        }
        throw e;
      }
    };

    const res = await exec();

    // Try to parse JSON, fallback to text
    const contentType = res.headers.get('content-type');
    let data: T;

    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text() as any;
    }

    // Cache successful GET requests
    if (useCache && method === 'GET') {
      const ttl = 5 * 60 * 1000; // 5 minutes default TTL
      apiCache.set(cacheKey, { data, timestamp: Date.now(), ttl });
    }

    performanceMonitor.end(performanceKey);
    return data;

  } catch (error) {
    performanceMonitor.end(performanceKey);
    console.error(`API Error for ${method} ${url}:`, error);
    throw error;
  }
}

// Convenience methods
export const apiGet = <T = any>(url: string, options?: Omit<ApiClientOptions, 'method'>) =>
  apiClient<T>(url, { ...options, method: 'GET' });

export const apiPost = <T = any>(url: string, body?: any, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
  apiClient<T>(url, { ...options, method: 'POST', body });

export const apiPut = <T = any>(url: string, body?: any, options?: Omit<ApiClientOptions, 'method' | 'body'>) =>
  apiClient<T>(url, { ...options, method: 'PUT', body });

export const apiDelete = <T = any>(url: string, options?: Omit<ApiClientOptions, 'method'>) =>
  apiClient<T>(url, { ...options, method: 'DELETE' });

// Cache management
export const clearApiCache = () => {
  apiCache.clear();
  console.log('🗑️ API cache cleared');
};

export const getApiCacheSize = () => {
  return apiCache.size;
};

export const getApiCacheStats = () => {
  const now = Date.now();
  let validEntries = 0;
  let expiredEntries = 0;

  for (const [, value] of apiCache.entries()) {
    if (now - value.timestamp < value.ttl) {
      validEntries++;
    } else {
      expiredEntries++;
    }
  }

  return {
    total: apiCache.size,
    valid: validEntries,
    expired: expiredEntries
  };
};