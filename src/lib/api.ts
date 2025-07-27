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
  return apiClient<{ 
    success: boolean; 
    message?: string; 
    token?: string;
    tokens?: {
      accessToken: string;
      refreshToken: string;
    };
    user?: {
      id: number;
      email: string;
      isProfileComplete: boolean;
    };
  }>(
    '/api/v1/auth/verify-otp',
    {
      method: 'POST',
      body: { email, otp },
    }
  );
}

// Submit onboarding data
export function submitOnboardingData(data: any, token?: string) {
  // If no token provided, try to get it from localStorage
  const authToken = token || localStorage.getItem('token');
  
  return apiClient<{ success: boolean; message?: string }>(
    '/api/v1/onboarding',
    {
      method: 'POST',
      body: data,
      token: authToken,
    }
  );
}

// Upload image to S3
export async function uploadImage(file: File, token?: string) {
  const formData = new FormData();
  formData.append('image', file);
  
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Remove Content-Type header to let browser set it with boundary for FormData
  delete headers['Content-Type'];
  
  const base = import.meta.env.VITE_API_URL;
  const url = base.replace(/\/$/, '') + '/api/profile/upload';
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }
  
  return response.json();
}

// Get user images
export function getUserImages(token?: string) {
  return apiClient<{ success: boolean; images: any[] }>(
    '/api/profile/images',
    {
      method: 'GET',
      token,
    }
  );
}

// Delete user image
export function deleteUserImage(imageId: string, token?: string) {
  return apiClient<{ success: boolean; message?: string }>(
    `/api/profile/images/${imageId}`,
    {
      method: 'DELETE',
      token,
    }
  );
}

// Get current user profile data
export function getCurrentUserProfile(token?: string) {
  return apiClient<{
    success: boolean;
    message: string;
    data: {
      id: number;
      email: string;
      name: string;
      university: {
        id: number;
        name: string;
        domain: string;
        country: string;
      };
      degree: string;
      year: string;
      gender: string;
      dateOfBirth: string;
      skills: string[];
      friends: string[];
      isProfileComplete: boolean;
      isEmailVerified: boolean;
      images: Array<{
        id: number;
        cloudfrontUrl: string;
        originalName: string;
        mimeType: string;
        fileSize: number;
        createdAt: string;
      }>;
      createdAt: string;
      updatedAt: string;
    };
  }>(
    '/api/v1/profile/me',
    {
      method: 'GET',
      token,
    }
  );
} 