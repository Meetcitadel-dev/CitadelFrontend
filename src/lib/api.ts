import { apiClient } from './apiClient';
import type { ExploreResponse, ConnectionRequest, AdjectiveSelection, AdjectiveMatchResponse } from '@/types';

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
      aboutMe?: string;
      sports?: string;
      movies?: string;
      tvShows?: string;
      teams?: string;
      portfolioLink?: string;
      phoneNumber?: string;
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

// Update user profile data
export function updateUserProfile(data: {
  name?: string;
  gender?: string;
  degree?: string;
  year?: string;
  skills?: string[];
  aboutMe?: string;
  sports?: string;
  movies?: string;
  tvShows?: string;
  teams?: string;
  portfolioLink?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}, token?: string) {
  return apiClient<{ success: boolean; message: string; data?: any }>(
    '/api/v1/profile/update',
    {
      method: 'PUT',
      body: data,
      token,
    }
  );
}

// Explore Section API Functions

// Fetch explore profiles with pagination and matching algorithm
export function fetchExploreProfiles(params?: {
  limit?: number;
  offset?: number;
  token?: string;
}) {
  const query = new URLSearchParams();
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.offset) query.append('offset', params.offset.toString());
  
  const url = '/api/v1/explore/profiles' + (query.toString() ? `?${query.toString()}` : '');
  
  return apiClient<ExploreResponse>(url, {
    method: 'GET',
    token: params?.token,
  });
}

// Manage connection requests (connect, accept, reject, remove, block, unblock)
export function manageConnection(request: ConnectionRequest, token?: string) {
  return apiClient<{ 
    success: boolean; 
    message: string; 
    connectionState?: {
      id: string | number;
      requesterId?: string | number;
      targetId?: string | number;
      userId1?: string | number;
      userId2?: string | number;
      status: 'not_connected' | 'requested' | 'connected' | 'blocked' | 'pending';
      createdAt: string;
      updatedAt: string;
    }
  }>(
    '/api/v1/connections/manage',
    {
      method: 'POST',
      body: request,
      token,
    }
  );
}

// Select adjective for a profile
export function selectAdjective(selection: AdjectiveSelection, token?: string) {
  return apiClient<AdjectiveMatchResponse>(
    '/api/v1/explore/adjectives/select',
    {
      method: 'POST',
      body: selection,
      token,
    }
  );
}

// Get adjective matches for current user
export function getAdjectiveMatches(token?: string) {
  return apiClient<{ success: boolean; matches: any[] }>(
    '/api/v1/explore/adjectives/matches',
    {
      method: 'GET',
      token,
    }
  );
}

// Get connection status with a specific user
export function getConnectionStatus(targetUserId: string, token?: string) {
  return apiClient<{ success: boolean; connectionState: any }>(
    `/api/v1/connections/status/${targetUserId}`,
    {
      method: 'GET',
      token,
    }
  );
}

// Track profile view interaction
export function trackProfileView(targetUserId: string, token?: string) {
  return apiClient<{ success: boolean; message: string }>(
    '/api/v1/explore/track-view',
    {
      method: 'POST',
      body: { targetUserId },
      token,
    }
  );
}

// Check if user has already selected an adjective for a specific profile
export function checkAdjectiveSelection(targetUserId: string, token?: string) {
  return apiClient<{ success: boolean; hasSelectedAdjective: boolean; message: string }>(
    `/api/v1/explore/adjectives/check/${targetUserId}`,
    {
      method: 'GET',
      token,
    }
  );
}

// Notification API Functions

// Fetch all notifications (connection requests and adjective notifications)
export function fetchNotifications(token?: string) {
  return apiClient<NotificationResponse>(
    '/api/v1/notifications',
    {
      method: 'GET',
      token,
    }
  );
}

// Accept or reject a connection request
export function handleConnectionRequest(request: AcceptRejectRequest, token?: string) {
  return apiClient<{ success: boolean; message: string; connectionState?: any }>(
    '/api/v1/notifications/connection-request',
    {
      method: 'POST',
      body: request,
      token,
    }
  );
}

// Mark notification as read
export function markNotificationAsRead(notificationId: string, token?: string) {
  return apiClient<{ success: boolean; message: string }>(
    `/api/v1/notifications/${notificationId}/read`,
    {
      method: 'POST',
      token,
    }
  );
} 