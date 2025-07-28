# Explore Section Implementation

## Frontend Implementation (COMPLETED)

### 1. Core Features Implemented

#### 1.1 Card-based Swipe Interface
- **PanGestureHandler**: Implemented touch gesture recognition for swipe directions
- **Smooth Animations**: Card transforms with rotation and translation during swipes
- **Swipe Directions**: 
  - Right/Up = Like
  - Left/Down = Pass
- **Visual Feedback**: Cards follow finger movement with rotation

#### 1.2 Connection Management System
- **Dynamic Button States**:
  - `Connect` (green) - when not connected
  - `Requested` (yellow) - when request sent
  - `Connected` (blue) - when connected
  - `Unblock` (red) - when blocked
- **Connection Modal**: Shows appropriate actions based on current state
- **Real-time Updates**: Optimistic UI updates with rollback capability

#### 1.3 Adjective Selection System
- **4 Pre-defined Adjectives**: Smart, Creative, Funny, Ambitious (from 15 total)
- **Selection Tracking**: Real-time selection state with timestamp
- **Matching Logic**: Checks for mutual adjective selection
- **Match Notifications**: Alert when mutual adjective is selected

#### 1.4 Profile Display
- **Match Score Badge**: Shows percentage match based on algorithm
- **Connection Status Badge**: Shows current connection state
- **Profile Information**: Name, skills, education, year
- **Image Handling**: CORS proxy for S3 images

### 2. Technical Implementation Details

#### 2.1 State Management
```typescript
// Profile Management
const [profiles, setProfiles] = useState<ExploreProfile[]>([])
const [currentIndex, setCurrentIndex] = useState(0)
const [hasMore, setHasMore] = useState(true)
const [offset, setOffset] = useState(0)

// Connection States
const [connectionStates, setConnectionStates] = useState<Record<string, ConnectionState | null>>({})

// Adjective Selection
const [selectedAdjectives, setSelectedAdjectives] = useState<string[]>([])
```

#### 2.2 API Integration
```typescript
// Fetch profiles with matching algorithm
fetchExploreProfiles({ limit: 10, offset, token })

// Manage connections
manageConnection({ targetUserId, action }, token)

// Select adjectives
selectAdjective({ targetUserId, adjective }, token)

// Get connection status
getConnectionStatus(targetUserId, token)
```

#### 2.3 Matching Algorithm Weights
```typescript
const MATCHING_CRITERIA = {
  collegeWeight: 0.4,  // Same college
  yearWeight: 0.3,     // Same year
  degreeWeight: 0.2,   // Same degree
  skillsWeight: 0.1    // Common skills
}
```

### 3. User Experience Features

#### 3.1 Lazy Loading
- Preloads next 5 profiles when current index reaches threshold
- Smooth infinite scrolling experience
- Loading states and error handling

#### 3.2 Optimistic Updates
- Immediate UI feedback for user actions
- Rollback capability on API failures
- Error handling with user notifications

#### 3.3 Visual Design
- Card-based interface with rounded corners
- Gradient overlays for text readability
- Status badges and match scores
- Responsive design for mobile

## Backend Requirements (TO BE IMPLEMENTED)

### 1. Database Schema

#### 1.1 Connections Table
```sql
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID NOT NULL REFERENCES users(id),
  user_id_2 UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) NOT NULL CHECK (status IN ('requested', 'connected', 'blocked')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id_1, user_id_2)
);
```

#### 1.2 Adjective Matches Table
```sql
CREATE TABLE adjective_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID NOT NULL REFERENCES users(id),
  user_id_2 UUID NOT NULL REFERENCES users(id),
  adjective VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  matched BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id_1, user_id_2, adjective)
);
```

### 2. API Endpoints Required

#### 2.1 GET /api/v1/explore/profiles
**Purpose**: Fetch profiles with matching algorithm
**Parameters**:
- `limit` (number): Number of profiles to return
- `offset` (number): Pagination offset
- `token` (string): Authentication token

**Response**:
```json
{
  "success": true,
  "profiles": [
    {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "university": {
        "id": 1,
        "name": "string",
        "domain": "string",
        "country": "string"
      },
      "degree": "string",
      "year": "string",
      "skills": ["string"],
      "profileImage": "string",
      "uploadedImages": ["string"],
      "connectionState": {
        "id": "uuid",
        "userId1": "uuid",
        "userId2": "uuid",
        "status": "not_connected|requested|connected|blocked",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      },
      "matchScore": 0.85,
      "selectedAdjectives": ["string"]
    }
  ],
  "hasMore": true,
  "totalCount": 100
}
```

#### 2.2 POST /api/v1/connections/manage
**Purpose**: Manage connection requests
**Body**:
```json
{
  "targetUserId": "uuid",
  "action": "connect|accept|reject|remove|block|unblock"
}
```

**Response**:
```json
{
  "success": true,
  "message": "string",
  "connectionState": {
    "id": "uuid",
    "userId1": "uuid",
    "userId2": "uuid",
    "status": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

#### 2.3 POST /api/v1/explore/adjectives/select
**Purpose**: Select adjective for a profile
**Body**:
```json
{
  "targetUserId": "uuid",
  "adjective": "string"
}
```

**Response**:
```json
{
  "success": true,
  "matched": true,
  "matchData": {
    "userId1": "uuid",
    "userId2": "uuid",
    "adjective": "string",
    "timestamp": "timestamp",
    "matched": true
  }
}
```

#### 2.4 GET /api/v1/explore/adjectives/matches
**Purpose**: Get adjective matches for current user
**Response**:
```json
{
  "success": true,
  "matches": [
    {
      "userId1": "uuid",
      "userId2": "uuid",
      "adjective": "string",
      "timestamp": "timestamp",
      "matched": true
    }
  ]
}
```

#### 2.5 GET /api/v1/connections/status/{targetUserId}
**Purpose**: Get connection status with specific user
**Response**:
```json
{
  "success": true,
  "connectionState": {
    "id": "uuid",
    "userId1": "uuid",
    "userId2": "uuid",
    "status": "string",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

### 3. Business Logic Required

#### 3.1 Matching Algorithm
```typescript
interface MatchingCriteria {
  collegeWeight: number; // 0.4
  yearWeight: number;    // 0.3
  degreeWeight: number;  // 0.2
  skillsWeight: number;  // 0.1
}

function calculateMatchScore(user1: User, user2: User): number {
  let score = 0;
  
  // Same college + same year + same degree (Score: 1.0)
  if (user1.university.id === user2.university.id && 
      user1.year === user2.year && 
      user1.degree === user2.degree) {
    score = 1.0;
  }
  // Same college + same year (Score: 0.7)
  else if (user1.university.id === user2.university.id && 
           user1.year === user2.year) {
    score = 0.7;
  }
  // Same college (Score: 0.4)
  else if (user1.university.id === user2.university.id) {
    score = 0.4;
  }
  // Same city + same degree + same year (Score: 0.3)
  else if (user1.city === user2.city && 
           user1.degree === user2.degree && 
           user1.year === user2.year) {
    score = 0.3;
  }
  // Same city + same year (Score: 0.2)
  else if (user1.city === user2.city && 
           user1.year === user2.year) {
    score = 0.2;
  }
  // Same city (Score: 0.1)
  else if (user1.city === user2.city) {
    score = 0.1;
  }
  
  return score;
}
```

#### 3.2 Adjective Matching Logic
```typescript
function checkAdjectiveMatch(userId1: string, userId2: string, adjective: string): boolean {
  // Check if both users selected the same adjective
  const user1Selection = await getAdjectiveSelection(userId1, userId2, adjective);
  const user2Selection = await getAdjectiveSelection(userId2, userId1, adjective);
  
  return user1Selection && user2Selection;
}
```

#### 3.3 Connection State Management
```typescript
enum ConnectionStatus {
  NOT_CONNECTED = 'not_connected',
  REQUESTED = 'requested',
  CONNECTED = 'connected',
  BLOCKED = 'blocked'
}

function manageConnection(userId1: string, userId2: string, action: string): ConnectionState {
  switch (action) {
    case 'connect':
      return createConnectionRequest(userId1, userId2);
    case 'accept':
      return acceptConnectionRequest(userId1, userId2);
    case 'reject':
      return rejectConnectionRequest(userId1, userId2);
    case 'remove':
      return removeConnection(userId1, userId2);
    case 'block':
      return blockUser(userId1, userId2);
    case 'unblock':
      return unblockUser(userId1, userId2);
  }
}
```

### 4. Security Considerations

#### 4.1 Authentication
- All endpoints require valid JWT token
- User can only access their own data
- Rate limiting on connection requests

#### 4.2 Authorization
- Users can only manage connections they're involved in
- Blocked users cannot see each other's profiles
- Privacy settings respect user preferences

#### 4.3 Data Validation
- Validate all input parameters
- Sanitize user inputs
- Prevent SQL injection

### 5. Performance Optimizations

#### 5.1 Database Indexes
```sql
-- Connections table indexes
CREATE INDEX idx_connections_user_id_1 ON connections(user_id_1);
CREATE INDEX idx_connections_user_id_2 ON connections(user_id_2);
CREATE INDEX idx_connections_status ON connections(status);

-- Adjective matches table indexes
CREATE INDEX idx_adjective_matches_user_id_1 ON adjective_matches(user_id_1);
CREATE INDEX idx_adjective_matches_user_id_2 ON adjective_matches(user_id_2);
CREATE INDEX idx_adjective_matches_adjective ON adjective_matches(adjective);
```

#### 5.2 Caching Strategy
- Cache user profiles for 5 minutes
- Cache connection states for 1 minute
- Cache match scores for 10 minutes

#### 5.3 Query Optimization
- Use pagination for large datasets
- Implement lazy loading for images
- Optimize matching algorithm queries

### 6. Testing Requirements

#### 6.1 Unit Tests
- Matching algorithm accuracy
- Connection state transitions
- Adjective matching logic
- Input validation

#### 6.2 Integration Tests
- API endpoint functionality
- Database operations
- Authentication flows
- Error handling

#### 6.3 End-to-End Tests
- Complete user flows
- Cross-browser compatibility
- Mobile responsiveness
- Performance under load

### 7. Monitoring and Analytics

#### 7.1 Metrics to Track
- Connection success rate
- Adjective match rate
- User engagement metrics
- API response times
- Error rates

#### 7.2 Logging
- User actions and interactions
- API request/response logs
- Error logs with stack traces
- Performance metrics

## Summary

The frontend implementation is complete with all required features:
- ✅ Card-based swipe interface
- ✅ Connection management system
- ✅ Adjective selection and matching
- ✅ Profile display with match scores
- ✅ Real-time state management
- ✅ Optimistic UI updates
- ✅ Error handling and rollback

The backend needs to implement:
- 🔄 Database schema for connections and adjective matches
- 🔄 API endpoints for profile fetching and connection management
- 🔄 Matching algorithm with proper weights
- 🔄 Adjective matching logic
- 🔄 Security and authentication
- 🔄 Performance optimizations
- 🔄 Testing and monitoring

The implementation provides a complete user experience for exploring and connecting with other profiles through an intuitive swipe interface with smart matching and connection management. 