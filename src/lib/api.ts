import { apiClient } from './apiClient';

// Fetch list of universities with optional search, limit, offset
export async function fetchUniversities(params?: { search?: string; limit?: number; offset?: number }) {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.offset) query.append('offset', params.offset.toString());
  const url = '/api/v1/universities' + (query.toString() ? `?${query.toString()}` : '');
  // Extract the universities array from the response
  const res = await apiClient<{ success: boolean; universities: any[] }>(url);
  return res.universities;
}

// Fetch list of colleges for a university
export function fetchColleges(university: string) {
  return apiClient<string[]>(`/api/v1/colleges?university=${encodeURIComponent(university)}`);
}

// Send email for OTP
export function sendEmailOTP(email: string) {
  return apiClient<{ success: boolean; message?: string }>(
    '/api/v1/auth/send-otp',
    {
      method: 'POST',
      body: { email },
    }
  );
}

// Verify OTP (4 digits)
export function verifyOTP(email: string, otp: string) {
  return apiClient<{ success: boolean; message?: string }>(
    '/api/v1/auth/verify-otp',
    {
      method: 'POST',
      body: { email, otp },
    }
  );
}

// Submit onboarding data
export function submitOnboardingData(data: any, token?: string) {
  return apiClient<{ success: boolean; message?: string }>(
    '/api/v1/onboarding',
    {
      method: 'POST',
      body: data,
      token,
    }
  );
} 