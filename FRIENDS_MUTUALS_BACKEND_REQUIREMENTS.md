# Friends and Mutuals Backend Requirements

## Overview
This document outlines the backend requirements for correctly implementing the friends and mutuals functionality in the user profile view. The current implementation incorrectly shows onboarding preferences instead of actual connection counts.

## Current Issue
- **Friends Count**: Currently shows the number of friends selected during onboarding (preferences)
- **Mutuals Count**: Currently shows the number of mutual friends selected during onboarding
- **Should Show**: 
  - Friends: Total number of actual connections/relationships the profile has
  - Mutuals: Number of common connections between current user and the profile being viewed

## 1. API Endpoint Updates

### 1.1 Update User Profile Endpoint
**Endpoint:** `GET /api/v1/users/{username}`

**Updated Response Structure:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "university": {
      "id": "number",
      "name": "string",
      "domain": "string",
      "country": "string"
    },
    "degree": "string",
    "year": "string",
    "skills": ["string"],
    "aboutMe": "string",
    "sports": "string",
    "movies": "string",
    "tvShows": "string",
    "teams": "string",
    "portfolioLink": "string",
    "phoneNumber": "string",
    "images": [
      {
        "id": "string",
        "cloudfrontUrl": "string"
      }
    ],
    "connections": [
      {
        "id": "string",
        "name": "string"
      }
    ],
    "mutualConnections": [
      {
        "id": "string",
        "name": "string"
      }
    ],
    "connectionState": {
      "id": "string",
      "status": "connected" | "requested" | "not_connected" | "blocked",
      "requesterId": "string",
      "targetId": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
}
```

## 2. Database Schema Requirements

### 2.1 Connections Table
```sql
CREATE TABLE connections (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  connected_user_id VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'connected',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, connected_user_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (connected_user_id) REFERENCES users(id)
);
```

### 2.2 Indexes for Performance
```sql
-- Index for fast connection lookups
CREATE INDEX idx_connections_user_id ON connections(user_id);
CREATE INDEX idx_connections_connected_user_id ON connections(connected_user_id);
CREATE INDEX idx_connections_status ON connections(status);

-- Composite index for mutual connections query
CREATE INDEX idx_connections_user_connected ON connections(user_id, connected_user_id);
```

## 3. Business Logic Implementation

### 3.1 Get User Connections Count
```sql
-- Get total connections for a user
SELECT COUNT(*) as connection_count
FROM connections 
WHERE user_id = ? AND status = 'connected'
```

### 3.2 Get Mutual Connections
```sql
-- Get mutual connections between two users
SELECT c1.connected_user_id, u.name
FROM connections c1
JOIN connections c2 ON c1.connected_user_id = c2.connected_user_id
JOIN users u ON c1.connected_user_id = u.id
WHERE c1.user_id = ? 
  AND c2.user_id = ? 
  AND c1.status = 'connected' 
  AND c2.status = 'connected'
```

### 3.3 Backend Implementation Logic

#### 3.3.1 User Profile Service
```javascript
// Get user profile with connection counts
async function getUserProfile(username, currentUserId) {
  const user = await getUserByUsername(username);
  
  // Get user's total connections
  const connections = await getConnections(user.id);
  
  // Get mutual connections between current user and target user
  const mutualConnections = await getMutualConnections(currentUserId, user.id);
  
  // Get connection state between current user and target user
  const connectionState = await getConnectionState(currentUserId, user.id);
  
  return {
    ...user,
    connections: connections,
    mutualConnections: mutualConnections,
    connectionState: connectionState
  };
}
```

#### 3.3.2 Connection Service
```javascript
// Get all connections for a user
async function getConnections(userId) {
  const query = `
    SELECT c.connected_user_id, u.name
    FROM connections c
    JOIN users u ON c.connected_user_id = u.id
    WHERE c.user_id = ? AND c.status = 'connected'
  `;
  return await db.query(query, [userId]);
}

// Get mutual connections between two users
async function getMutualConnections(userId1, userId2) {
  const query = `
    SELECT c1.connected_user_id, u.name
    FROM connections c1
    JOIN connections c2 ON c1.connected_user_id = c2.connected_user_id
    JOIN users u ON c1.connected_user_id = u.id
    WHERE c1.user_id = ? 
      AND c2.user_id = ? 
      AND c1.status = 'connected' 
      AND c2.status = 'connected'
  `;
  return await db.query(query, [userId1, userId2]);
}
```

## 4. API Response Examples

### 4.1 Successful Response
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "name": "Rahul Kumar",
    "email": "rahul@example.com",
    "university": {
      "id": 1,
      "name": "IIT Delhi",
      "domain": "iitd.ac.in",
      "country": "India"
    },
    "degree": "Computer Science",
    "year": "3rd",
    "skills": ["JavaScript", "React", "Node.js"],
    "connections": [
      {"id": "user456", "name": "Neha Patel"},
      {"id": "user789", "name": "Arjun Singh"}
    ],
    "mutualConnections": [
      {"id": "user456", "name": "Neha Patel"}
    ],
    "connectionState": {
      "id": "conn123",
      "status": "connected",
      "requesterId": "user123",
      "targetId": "currentUser",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### 4.2 Error Response
```json
{
  "success": false,
  "message": "User not found",
  "code": "USER_NOT_FOUND"
}
```

## 5. Performance Considerations

### 5.1 Caching Strategy
- Cache connection counts for frequently accessed users
- Cache mutual connections for user pairs
- Use Redis for connection data caching
- Cache invalidation on connection status changes

### 5.2 Database Optimization
- Use materialized views for complex mutual connections queries
- Implement connection count denormalization
- Use read replicas for connection queries

### 5.3 Query Optimization
```sql
-- Optimized mutual connections query with indexing
SELECT DISTINCT c1.connected_user_id, u.name
FROM connections c1
FORCE INDEX (idx_connections_user_connected)
JOIN connections c2 ON c1.connected_user_id = c2.connected_user_id
JOIN users u ON c1.connected_user_id = u.id
WHERE c1.user_id = ? 
  AND c2.user_id = ? 
  AND c1.status = 'connected' 
  AND c2.status = 'connected'
```

## 6. Migration Strategy

### 6.1 Database Migration
```sql
-- Create connections table
CREATE TABLE connections (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  connected_user_id VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'connected',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, connected_user_id)
);

-- Migrate existing connections from other tables
INSERT INTO connections (user_id, connected_user_id, status)
SELECT user_id, friend_id, 'connected'
FROM existing_friends_table
WHERE status = 'accepted';
```

### 6.2 API Migration
- Maintain backward compatibility during transition
- Add new fields alongside old ones
- Gradually deprecate old fields
- Update frontend to use new fields

## 7. Testing Requirements

### 7.1 Unit Tests
- Connection count calculation
- Mutual connections calculation
- Connection state management
- Edge cases (no connections, blocked users)

### 7.2 Integration Tests
- End-to-end profile viewing with connections
- Connection request flow
- Mutual connections display
- Performance under load

### 7.3 Test Data
```javascript
// Sample test data
const testConnections = [
  { user_id: 'user1', connected_user_id: 'user2', status: 'connected' },
  { user_id: 'user1', connected_user_id: 'user3', status: 'connected' },
  { user_id: 'user2', connected_user_id: 'user3', status: 'connected' }
];
```

## 8. Monitoring and Analytics

### 8.1 Metrics to Track
- Connection count accuracy
- Mutual connections calculation time
- API response times for profile endpoints
- Cache hit rates for connection data

### 8.2 Logging
- Connection count queries
- Mutual connections calculations
- Performance bottlenecks
- Error rates in connection logic

## 9. Security Considerations

### 9.1 Data Privacy
- Only show mutual connections if both users are connected
- Respect user privacy settings
- Validate user permissions for connection data

### 9.2 Rate Limiting
- Limit profile view requests
- Prevent connection enumeration attacks
- Implement proper authentication checks

## 10. Implementation Priority

### Phase 1 (Immediate)
1. Update database schema with connections table
2. Implement connection count logic
3. Update API response structure
4. Test with sample data

### Phase 2 (Short-term)
1. Implement mutual connections logic
2. Add caching layer
3. Performance optimization
4. Frontend integration testing

### Phase 3 (Long-term)
1. Advanced analytics
2. Connection recommendations
3. Social graph features
4. Performance monitoring

## 11. Frontend Integration Notes

The frontend expects:
- `connections` array with connection details
- `mutualConnections` array with mutual connection details
- Connection counts displayed as numbers
- Real-time updates when connections change
- Proper error handling for missing data 