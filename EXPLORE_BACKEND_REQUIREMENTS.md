# Backend Requirements for Explore Functionality

## Overview
The explore functionality allows users to discover other profiles, connect with them, and use trait/adjective matching. This document outlines the missing backend endpoints and requirements.

## 1. Missing API Endpoints

### Connection Management Endpoint
**Currently Missing:** `POST /api/v1/connections/manage`

**Required Endpoint:** `POST /api/v1/connections/manage`

**Request Body:**
```json
{
  "targetUserId": "string",
  "action": "connect" | "accept" | "reject" | "remove" | "block" | "unblock"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Connection request sent successfully",
  "connectionState": {
    "id": "string",
    "userId1": "string",
    "userId2": "string", 
    "status": "not_connected" | "requested" | "connected" | "blocked",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Adjective Selection Endpoint
**Currently Missing:** Proper validation for adjectives

**Required Endpoint:** `POST /api/v1/explore/adjectives/select`

**Request Body:**
```json
{
  "targetUserId": "string",
  "adjective": "string"
}
```

**Response:**
```json
{
  "success": true,
  "matched": true,
  "matchData": {
    "userId1": "string",
    "userId2": "string",
    "adjective": "string",
    "timestamp": "2024-01-01T00:00:00Z",
    "matched": true
  }
}
```

## 2. Valid Adjectives List

The backend should accept these adjectives (case-sensitive):

```javascript
const VALID_ADJECTIVES = [
  "Beautiful", "Handsome", "Smart", "Intelligent", "Creative", "Funny", 
  "Kind", "Ambitious", "Confident", "Friendly", "Adventurous", "Caring",
  "Passionate", "Reliable", "Optimistic", "Energetic", "Thoughtful", "Dynamic"
]
```

**Currently Used in Frontend:**
- "Beautiful"
- "Smart" 
- "Funny"
- "Kind"

## 3. Database Schema Requirements

### Connections Table
```sql
CREATE TABLE connections (
  id VARCHAR(36) PRIMARY KEY,
  userId1 VARCHAR(36) NOT NULL,
  userId2 VARCHAR(36) NOT NULL,
  status ENUM('not_connected', 'requested', 'connected', 'blocked') DEFAULT 'not_connected',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_connection (userId1, userId2),
  FOREIGN KEY (userId1) REFERENCES users(id),
  FOREIGN KEY (userId2) REFERENCES users(id)
);
```

### Adjective Matches Table
```sql
CREATE TABLE adjective_matches (
  id VARCHAR(36) PRIMARY KEY,
  userId1 VARCHAR(36) NOT NULL,
  userId2 VARCHAR(36) NOT NULL,
  adjective VARCHAR(50) NOT NULL,
  matched BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId1) REFERENCES users(id),
  FOREIGN KEY (userId2) REFERENCES users(id)
);
```

## 4. Backend Implementation Details

### Connection Management Logic
1. **Connect Action:**
   - Create a connection request from current user to target user
   - Status: "requested"
   - Send notification to target user

2. **Accept Action:**
   - Update connection status to "connected"
   - Send notification to requesting user

3. **Reject Action:**
   - Delete the connection request
   - Send notification to requesting user

4. **Remove Action:**
   - Delete the connection
   - Send notification to other user

5. **Block Action:**
   - Update status to "blocked"
   - Prevent future interactions

### Adjective Matching Logic
1. **Validation:**
   - Check if adjective is in VALID_ADJECTIVES list
   - Return error if invalid

2. **Matching Algorithm:**
   - Check if target user has selected the same adjective for current user
   - If both users select same adjective for each other → MATCH!
   - Store the match in adjective_matches table

3. **Match Notification:**
   - Send push notification to both users
   - Show match screen/alert

## 5. Error Handling

### Connection Management Errors
```json
{
  "success": false,
  "message": "User not found",
  "errorCode": "USER_NOT_FOUND"
}
```

```json
{
  "success": false,
  "message": "Cannot connect to yourself",
  "errorCode": "SELF_CONNECTION"
}
```

```json
{
  "success": false,
  "message": "Connection already exists",
  "errorCode": "CONNECTION_EXISTS"
}
```

### Adjective Selection Errors
```json
{
  "success": false,
  "message": "Invalid adjective",
  "errorCode": "INVALID_ADJECTIVE"
}
```

```json
{
  "success": false,
  "message": "User not found",
  "errorCode": "USER_NOT_FOUND"
}
```

## 6. Security Considerations

1. **Authentication:** Require valid JWT token
2. **Authorization:** Users can only manage their own connections
3. **Rate Limiting:** Prevent spam connection requests
4. **Input Validation:** Sanitize all inputs
5. **SQL Injection Protection:** Use parameterized queries

## 7. Testing Requirements

### Unit Tests
- Test all connection actions (connect, accept, reject, remove, block)
- Test adjective validation
- Test matching algorithm
- Test error scenarios

### Integration Tests
- Test complete connection flow
- Test adjective matching flow
- Test with invalid data
- Test rate limiting

## 8. Frontend Integration Notes

The frontend is already prepared to handle:
- ✅ Loading profiles from `/api/v1/explore/profiles`
- ✅ Displaying connection status
- ✅ Sending connection requests
- ✅ Selecting adjectives
- ✅ Handling API errors gracefully
- ✅ Showing user feedback messages

## 9. Current Issues to Fix

### High Priority
1. **Missing Connection Endpoint:** `POST /api/v1/connections/manage` returns 404
2. **Invalid Adjectives:** Backend rejects "Intelligent", "Creative", "Handsome"
3. **Error Handling:** Need proper error responses

### Medium Priority
1. **Match Notifications:** Real-time notifications for matches
2. **Connection Status Updates:** Real-time updates
3. **Rate Limiting:** Prevent abuse

## 10. Deployment Checklist

- [ ] Create connections table
- [ ] Create adjective_matches table
- [ ] Implement connection management endpoint
- [ ] Update adjective validation
- [ ] Add proper error handling
- [ ] Test all scenarios
- [ ] Deploy to staging
- [ ] Deploy to production

## 11. API Documentation Updates

Update your API documentation to include:

1. **Connection Management API**
2. **Adjective Selection API** 
3. **Valid Adjectives List**
4. **Error Response Formats**
5. **Authentication Requirements**

## 12. Monitoring and Analytics

Consider adding:
- Connection request success/failure rates
- Most popular adjectives
- Match success rates
- User engagement metrics
- Error rate monitoring 