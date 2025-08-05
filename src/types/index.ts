export interface SplashScreenProps {
  onComplete?: () => void
}

export interface SlideToStartScreenProps {
  onSlideComplete: () => void
}

export interface ConnectStudentsScreenProps {
  onContinue: () => void
}

export interface UniversitySelectionScreenProps {
  onContinue: () => void
}

export interface EmailInputScreenProps {
  onContinue: () => void
}

export interface OTPInputScreenProps {
  onContinue: () => void
}

export interface NameInputScreenProps {
  onContinue: () => void
}

export interface DateOfBirthScreenProps {
  onContinue: () => void
}

export interface SkillsetsScreenProps {
  onContinue: () => void
}

export interface AuthFormData {
  firstName?: string
  lastName?: string
  email: string
  password: string
  confirmPassword?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

// Explore Section Types
export interface MatchingCriteria {
  collegeWeight: number;
  yearWeight: number;
  degreeWeight: number;
  skillsWeight: number;
}

export interface AdjectiveMatch {
  userId1: string;
  userId2: string;
  adjective: string;
  timestamp: Date;
  matched: boolean;
}

// New types for enhanced adjective system
export interface GenderBasedAdjectives {
  male: string[];
  female: string[];
  neutral: string[];
}

export interface UserAdjectiveSelection {
  id: string;
  userId: string;
  targetUserId: string;
  adjective: string;
  timestamp: Date;
  isMatched: boolean;
}

export interface AdjectiveDisplayData {
  selectedAdjective: string;
  randomAdjectives: string[];
  allAdjectives: string[];
  isMatched: boolean;
  matchData?: {
    mutualAdjective: string;
    matchTimestamp: Date;
  };
}

export interface MatchState {
  id: string;
  userId1: string;
  userId2: string;
  mutualAdjective: string;
  isConnected: boolean;
  matchTimestamp: Date;
  connectionTimestamp?: Date;
  iceBreakingPrompt?: string;
}

export interface ConnectionState {
  id: string | number;
  userId1?: string | number;
  userId2?: string | number;
  requesterId?: string | number;
  targetId?: string | number;
  status: 'not_connected' | 'requested' | 'connected' | 'blocked' | 'pending' | 'matched';
  createdAt: Date | string;
  updatedAt: Date | string;
  matchData?: {
    mutualAdjective: string;
    matchTimestamp: Date;
  };
}

export interface ExploreProfile {
  id: string | number;
  name: string;
  email: string;
  gender?: string;
  university: {
    id: number;
    name: string;
    domain: string;
    country: string;
  };
  degree: string;
  year: string;
  skills: string[];
  profileImage?: string;
  uploadedImages?: string[];
  connectionState: ConnectionState | null;
  matchScore: number;
  selectedAdjectives: string[];
}

export interface ExploreResponse {
  success: boolean;
  profiles: ExploreProfile[];
  hasMore: boolean;
  totalCount: number;
  filters?: {
    availableUniversities: string[];
    availableSkills: string[];
    availableYears: string[];
  };
}

export interface ConnectionRequest {
  targetUserId: string;
  action: 'connect' | 'accept' | 'reject' | 'remove' | 'block' | 'unblock';
}

export interface AdjectiveSelection {
  targetUserId: string;
  adjective: string;
}

export interface AdjectiveMatchResponse {
  success: boolean;
  matched: boolean;
  matchData?: AdjectiveMatch;
  message?: string;
}

// Notification Types
export interface ConnectionRequestNotification {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterLocation: string;
  requesterProfileImage?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface AdjectiveNotification {
  id: string;
  adjective: string;
  count: number;
  userIds: string[];
  userNames: string[];
  userProfileImages?: string[];
  timeAgo: string;
  createdAt: Date;
}

export interface NotificationResponse {
  success: boolean;
  connectionRequests: ConnectionRequestNotification[];
  adjectiveNotifications: AdjectiveNotification[];
  requestCount: number;
}

export interface AcceptRejectRequest {
  requestId: string;
  action: 'accept' | 'reject';
} 