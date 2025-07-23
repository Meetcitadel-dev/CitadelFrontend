// Simple API client for fetch with token support
export type ApiClientOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  token?: string;
};

function getApiUrl(url: string) {
  const base = import.meta.env.VITE_API_URL;
  // If url is absolute (starts with http), return as is
  if (/^https?:\/\//.test(url)) return url;
  // Otherwise, prepend base URL
  return base.replace(/\/$/, '') + (url.startsWith('/') ? url : '/' + url);
}

export async function apiClient<T = any>(
  url: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }
  const fetchOptions: RequestInit = {
    method: options.method || 'GET',
    headers,
  };
  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }
  const apiUrl = getApiUrl(url);
  const res = await fetch(apiUrl, fetchOptions);
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || res.statusText);
  }
  // Try to parse JSON, fallback to text
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  return (await res.text()) as any;
} 