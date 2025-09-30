import { apiClient } from './apiClient';
import { getAuthToken } from './utils';
import type { ExploreResponse, ConnectionRequest, AdjectiveSelection, AdjectiveMatchResponse, NotificationResponse, AcceptRejectRequest } from '@/types';

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

// Check if user exists
export function checkUserExists(email: string) {
  return apiClient<{ 
    success: boolean; 
    message: string; 
    user?: {
      id: number;
      email: string;
      isProfileComplete: boolean;
    };
  }>(
    '/api/v1/auth/check-user',
    {
      method: 'POST',
      body: { email },
    }
  );
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
  const authToken = token || getAuthToken();
  
  return apiClient<{ success: boolean; message?: string }>(
    '/api/v1/onboarding',
    {
      method: 'POST',
      body: data,
      token: authToken || undefined,
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
  
  const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
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

// Assign an uploaded image to a specific slot (0..4)
export function assignImageToSlot(params: { slot: number; userImageId: number }, token?: string) {
  return apiClient<{ success: boolean; message?: string }>(
    '/api/profile/images/slot',
    {
      method: 'PUT',
      body: params,
      token,
    }
  );
}

// Clear a specific slot (0..4)
export function clearImageSlot(slot: number, token?: string) {
  return apiClient<{ success: boolean; message?: string }>(
    `/api/profile/images/slot/${slot}`,
    {
      method: 'DELETE',
      token,
    }
  );
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
      // Recent uploads library (not used for slot rendering)
      images: Array<{
        id: number;
        cloudfrontUrl: string;
        originalName: string;
        mimeType: string;
        fileSize: number;
        createdAt: string;
      }>;
      // Fixed display slots 0..4
      slots?: Array<{
        slot: number;
        image: null | {
          id: number;
          cloudfrontUrl: string;
          originalName?: string;
          mimeType?: string;
          fileSize?: number;
          createdAt?: string;
        };
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
  search?: string;
  sortBy?: string;
  gender?: string;
  years?: string[];
  universities?: string[];
  skills?: string[];
}) {
  const query = new URLSearchParams();
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.offset) query.append('offset', params.offset.toString());
  if (params?.search) query.append('search', params.search);
  if (params?.sortBy) query.append('sortBy', params.sortBy);
  if (params?.gender) query.append('gender', params.gender);
  if (params?.years && params.years.length > 0) query.append('years', params.years.join(','));
  if (params?.universities && params.universities.length > 0) query.append('universities', params.universities.join(','));
  if (params?.skills && params.skills.length > 0) query.append('skills', params.skills.join(','));
  
  const url = '/api/v1/users/gridview' + (query.toString() ? `?${query.toString()}` : '');
  
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
    '/api/v1/enhanced-explore/adjectives/select',
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

// Fetch user profile by username/name
export function fetchUserProfileByName(username: string, token?: string) {
  return apiClient<{
    success: boolean;
    data?: {
      id: string;
      name: string;
      email: string;
      university?: {
        id: number;
        name: string;
        domain: string;
        country: string;
      };
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
      images?: Array<{
        id: string;
        cloudfrontUrl: string;
      }>;
      // Updated to reflect actual connection counts
      connections?: Array<{
        id: string;
        name: string;
      }>;
      mutualConnections?: Array<{
        id: string;
        name: string;
      }>;
      connectionState?: {
        id: string;
        status: 'connected' | 'requested' | 'not_connected' | 'blocked';
        requesterId?: string;
        targetId?: string;
        createdAt: string;
        updatedAt: string;
      };
    };
    message?: string;
  }>(
    `/api/v1/users/${encodeURIComponent(username)}`,
    {
      method: 'GET',
      token,
    }
  );
} 

// Chat API Functions

// Fetch active conversations (connected users)
export function fetchActiveConversations(token?: string) {
  return apiClient<{
    success: boolean;
    conversations: Array<{
      id: string;
      userId: string;
      name: string;
      profileImage?: string;
      lastMessage?: string;
      lastMessageTime?: string;
      isOnline: boolean;
      unreadCount: number;
    }>;
  }>(
    '/api/v1/chats/active',
    {
      method: 'GET',
      token,
    }
  );
}

// Fetch matched conversations (matched users)
export function fetchMatchedConversations(token?: string) {
  return apiClient<{
    success: boolean;
    conversations: Array<{
      id: string;
      userId: string;
      name: string;
      profileImage?: string;
      lastMessage?: string;
      lastMessageTime?: string;
      isOnline: boolean;
      unreadCount: number;
    }>;
  }>(
    '/api/v1/chats/matches',
    {
      method: 'GET',
      token,
    }
  );
}

// Fetch messages for a specific conversation
export function fetchConversationMessages(conversationId: string, token?: string) {
  return apiClient<{
    success: boolean;
    messages: Array<{
      id: string;
      text: string;
      isSent: boolean;
      timestamp: string;
      status: 'sent' | 'delivered' | 'read';
    }>;
  }>(
    `/api/v1/chats/${conversationId}/messages`,
    {
      method: 'GET',
      token,
    }
  );
}

// Send a message
export function sendMessage(conversationId: string, message: string, token?: string) {
  return apiClient<{
    success: boolean;
    message: {
      id: string;
      text: string;
      timestamp: string;
      status: 'sent';
    };
  }>(
    `/api/v1/chats/${conversationId}/messages`,
    {
      method: 'POST',
      body: { message },
      token,
    }
  );
}

// Mark messages as read
export function markMessagesAsRead(conversationId: string, token?: string) {
  return apiClient<{ success: boolean }>(
    `/api/v1/chats/${conversationId}/read`,
    {
      method: 'POST',
      token,
    }
  );
}

// Get conversation by user ID
export function getConversationByUserId(userId: string, token?: string) {
  return apiClient<{
    success: boolean;
    conversation?: {
      id: string;
      userId: string;
      name: string;
      profileImage?: string;
    };
  }>(
    `/api/v1/chats/conversation/${userId}`,
    {
      method: 'GET',
      token,
    }
  );
}

// Get conversation details by conversation ID
export function getConversationById(conversationId: string, token?: string) {
  return apiClient<{
    success: boolean;
    conversation?: {
      id: string;
      userId: string;
      name: string;
      profileImage?: string;
    };
  }>(
    `/api/v1/chats/conversation/details/${conversationId}`,
    {
      method: 'GET',
      token,
    }
  );
}

// Get user's connections count (actual connections, not onboarding friends)
export function getUserConnectionsCount(token?: string) {
  return apiClient<{
    success: boolean;
    connectionsCount: number;
    message?: string;
  }>(
    '/api/v1/connections/count',
    {
      method: 'GET',
      token,
    }
  );
} 

// Enhanced Adjective System API Functions

// Get user's gender for adjective selection
export function getUserGender(token?: string) {
  return apiClient<{
    success: boolean;
    gender: string;
    message?: string;
  }>(
    '/api/v1/enhanced-explore/profile/gender',
    {
      method: 'GET',
      token,
    }
  );
}

// Get adjective selections for a specific user
export function getAdjectiveSelections(targetUserId: string, token?: string) {
  return apiClient<{
    success: boolean;
    selections: Array<{
      id: string;
      userId: string;
      targetUserId: string;
      adjective: string;
      timestamp: string;
      isMatched: boolean;
    }>;
    message?: string;
  }>(
    `/api/v1/enhanced-explore/adjectives/selections/${targetUserId}`,
    {
      method: 'GET',
      token,
    }
  );
}

// Get available adjectives for a target user
export function getAvailableAdjectives(targetUserId: string, token?: string, sessionId?: string) {
  const url = `/api/v1/enhanced-explore/adjectives/available/${targetUserId}${sessionId ? `?sessionId=${sessionId}` : ''}`;
  return apiClient<{
    success: boolean;
    adjectives: string[];
    hasPreviousSelection: boolean;
    previousSelection?: string;
    sessionId?: string;
    message?: string;
  }>(
    url,
    {
      method: 'GET',
      token,
    }
  );
}

// Get match state between two users
export function getMatchState(targetUserId: string, token?: string) {
  return apiClient<{
    success: boolean;
    matchState?: {
      id: string;
      userId1: string;
      userId2: string;
      mutualAdjective: string;
      isConnected: boolean;
      matchTimestamp: string;
      connectionTimestamp?: string;
      iceBreakingPrompt?: string;
    };
    message?: string;
  }>(
    `/api/v1/enhanced-explore/matches/state/${targetUserId}`,
    {
      method: 'GET',
      token,
    }
  );
}

// Connect after matching
export function connectAfterMatch(targetUserId: string, token?: string) {
  return apiClient<{
    success: boolean;
    connectionState: any;
    message?: string;
  }>(
    '/api/v1/enhanced-explore/matches/connect',
    {
      method: 'POST',
      body: { targetUserId },
      token,
    }
  );
}

// Get ice-breaking prompt for a matched user
export function getIceBreakingPrompt(targetUserId: string, token?: string) {
  return apiClient<{
    success: boolean;
    prompt: string;
    message?: string;
  }>(
    `/api/v1/enhanced-explore/matches/ice-breaking/${targetUserId}`,
    {
      method: 'GET',
      token,
    }
  );
}

// Enhanced Chat Matching APIs
export function sendConnectionRequest(targetUserId: string, token?: string) {
  return apiClient<{
    success: boolean;
    message: string;
  }>(
    '/api/v1/enhanced-chats/connection-request',
    {
      method: 'POST',
      body: { targetUserId },
      token,
    }
  );
}

export function dismissMatchPrompt(targetUserId: string, token?: string) {
  return apiClient<{
    success: boolean;
    message: string;
  }>(
    '/api/v1/enhanced-chats/dismiss',
    {
      method: 'POST',
      body: { targetUserId },
      token,
    }
  );
}

export function moveChatToActive(targetUserId: string, token?: string) {
  return apiClient<{
    success: boolean;
    message: string;
  }>(
    '/api/v1/enhanced-chats/move-to-active',
    {
      method: 'POST',
      body: { targetUserId },
      token,
    }
  );
}

export function checkChatHistory(targetUserId: string, token?: string) {
  return apiClient<{
    success: boolean;
    hasChatHistory: boolean;
    message?: string;
  }>(
    `/api/v1/enhanced-chats/chat-history/${targetUserId}`,
    {
      method: 'GET',
      token,
    }
  );
}

// Enhanced matches endpoint
export function getEnhancedMatches(token?: string) {
  return apiClient<{
    success: boolean;
    conversations: Array<{
      id: string;
      userId: string;
      name: string;
      lastMessage?: string;
      lastMessageTime?: string;
      unreadCount: number;
      caseType: 'CASE_1' | 'CASE_2' | 'CASE_3';
      isConnected: boolean;
      hasChatHistory: boolean;
      matchData?: {
        mutualAdjective: string;
        iceBreakingPrompt: string;
      };
    }>;
    message?: string;
  }>(
    '/api/v1/enhanced-chats/matches',
    {
      method: 'GET',
      token,
    }
  );
}

// Delete user account
export function deleteUserAccount(token?: string) {
  return apiClient<{ success: boolean; message?: string }>(
    '/api/v1/user/delete-account',
    {
      method: 'DELETE',
      token,
    }
  );
} 

// Group Chat API Functions
export function fetchUserConnections(token?: string) {
  return apiClient<{ success: boolean; connections: any[] }>(
    '/api/v1/connections',
    {
      method: 'GET',
      token,
    }
  );
}

export function createGroupChat(data: {
  name: string;
  description?: string;
  memberIds: string[];
}, token?: string) {
  return apiClient<{ success: boolean; group?: any; message?: string }>(
    '/api/v1/groups',
    {
      method: 'POST',
      body: data,
      token,
    }
  );
}

export function fetchGroupChats(token?: string) {
  return apiClient<{ success: boolean; groups: any[] }>(
    '/api/v1/groups',
    {
      method: 'GET',
      token,
    }
  );
}

export function fetchGroupChat(groupId: string, token?: string) {
  return apiClient<{ success: boolean; group?: any; message?: string }>(
    `/api/v1/groups/${groupId}`,
    {
      method: 'GET',
      token,
    }
  );
}

export function updateGroupChat(groupId: string, data: {
  name?: string;
  description?: string;
  memberIds?: string[];
}, token?: string) {
  return apiClient<{ success: boolean; group?: any; message?: string }>(
    `/api/v1/groups/${groupId}`,
    {
      method: 'PUT',
      body: data,
      token,
    }
  );
}

export function deleteGroupChat(groupId: string, token?: string) {
  return apiClient<{ success: boolean; message?: string }>(
    `/api/v1/groups/${groupId}`,
    {
      method: 'DELETE',
      token,
    }
  );
}

export function fetchGroupMessages(groupId: string, token?: string) {
  return apiClient<{ success: boolean; messages: any[] }>(
    `/api/v1/groups/${groupId}/messages`,
    {
      method: 'GET',
      token,
    }
  );
}

export function sendGroupMessage(groupId: string, message: string, token?: string) {
  return apiClient<{ success: boolean; message?: any }>(
    `/api/v1/groups/${groupId}/messages`,
    {
      method: 'POST',
      body: { content: message },
      token,
    }
  );
}

export function markGroupMessagesAsRead(groupId: string, token?: string) {
  return apiClient<{ success: boolean; message?: string }>(
    `/api/v1/groups/${groupId}/messages/read`,
    {
      method: 'POST',
      token,
    }
  );
}

export function addGroupMembers(groupId: string, memberIds: string[], token?: string) {
  return apiClient<{ success: boolean; message?: string }>(
    `/api/v1/groups/${groupId}/members`,
    {
      method: 'POST',
      body: { memberIds },
      token,
    }
  );
}

export function removeGroupMember(groupId: string, memberId: string, token?: string) {
  return apiClient<{ success: boolean; message?: string }>(
    `/api/v1/groups/${groupId}/members/${memberId}`,
    {
      method: 'DELETE',
      token,
    }
  );
}

export function leaveGroupChat(groupId: string, token?: string) {
  return apiClient<{ success: boolean; message?: string }>(
    `/api/v1/groups/${groupId}/leave`,
    {
      method: 'POST',
      token,
    }
  );
} 