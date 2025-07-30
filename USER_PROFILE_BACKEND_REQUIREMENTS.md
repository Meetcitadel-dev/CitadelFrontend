# User Profile Backend Requirements

## Overview
This document outlines the backend requirements for the new user profile functionality that allows users to view other users' profiles at `/{name}` route.

## 1. API Endpoints Required

### 1.1 Get User Profile by Username
**Endpoint:** `GET /api/v1/users/{username}`

**Purpose:** Fetch a user's profile information by their username/name

**Request:**
- Headers: `Authorization: Bearer {token}`
- URL Parameters: `{username}` - the username in lowercase format (e.g., `rahulkumar`, `nehapatel`)

**Examples:**
- `GET /api/v1/users/rahulkumar` - Get profile for user "Rahul Kumar"
- `GET /api/v1/users/nehapatel` - Get profile for user "Neha Patel"
- `GET /api/v1/users/arjunsingh` - Get profile for user "Arjun Singh"

**Response:**
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
    "friends": [
      {
        "id": "string",
        "name": "string"
      }
    ],
    "mutualFriends": [
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

**Error Responses:**
```json
{
  "success": false,
  "message": "User not found"
}
```

### 1.2 Get Mutual Friends
**Endpoint:** `GET /api/v1/users/{username}/mutual-friends`

**Purpose:** Get list of mutual friends between current user and target user

**Request:**
- Headers: `Authorization: Bearer {token}`
- URL Parameters: `{username}` - the username/name of the target user

**Response:**
```json
{
  "success": true,
  "data": {
    "mutualFriends": [
      {
        "id": "string",
        "name": "string",
        "profileImage": "string"
      }
    ],
    "totalCount": "number"
  }
}
```

## 2. Database Schema Updates

### 2.1 User Table
Ensure the user table has a unique `username` field that follows the pattern: `firstname + lastname` in lowercase with no spaces.

**Username Generation Pattern:**
- Full Name: "Rahul Kumar" → Username: `rahulkumar`
- Full Name: "Neha Patel" → Username: `nehapatel`
- Full Name: "Arjun Singh" → Username: `arjunsingh`

**Database Field:**
```sql
ALTER TABLE users ADD COLUMN username VARCHAR(255) UNIQUE NOT NULL;
-- Username should be generated as: LOWER(REPLACE(CONCAT(first_name, last_name), ' ', ''))
```

### 2.2 Friends Table
```sql
CREATE TABLE friends (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  friend_id VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, friend_id)
);
```

### 2.3 Mutual Friends Query
The backend should implement a query to find mutual friends between two users:

```sql
SELECT f1.friend_id, u.name, u.profile_image
FROM friends f1
JOIN friends f2 ON f1.friend_id = f2.friend_id
JOIN users u ON f1.friend_id = u.id
WHERE f1.user_id = ? AND f2.user_id = ?
```

## 3. Business Logic Requirements

### 3.1 Profile Visibility
- Users should be able to view other users' profiles
- Private information (email, phone) should be hidden for non-connected users
- Profile images should be accessible to all users

### 3.2 Connection Status
- Show current connection status between users
- Handle different states: connected, requested, not_connected, blocked
- Update connection status in real-time

### 3.3 Mutual Friends Calculation
- Calculate mutual friends efficiently
- Cache mutual friends count for performance
- Update mutual friends when connections change

### 3.4 Security Considerations
- Validate user authentication for all requests
- Prevent access to private user data
- Rate limiting for profile views
- Input validation for usernames

## 4. Performance Requirements

### 4.1 Caching
- Cache user profiles for frequently accessed users
- Cache mutual friends calculations
- Implement Redis or similar for session management

### 4.2 Database Optimization
- Index on username/name field for fast lookups
- Index on friends table for efficient mutual friends queries
- Consider denormalization for frequently accessed data

### 4.3 API Response Time
- Profile fetch: < 200ms
- Mutual friends: < 500ms
- Connection status: < 100ms

## 5. Error Handling

### 5.1 Common Error Scenarios
- User not found (404)
- Invalid username format (400)
- Unauthorized access (401)
- Rate limit exceeded (429)
- Server errors (500)

### 5.2 Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## 6. Testing Requirements

### 6.1 Unit Tests
- User profile retrieval
- Mutual friends calculation
- Connection status updates
- Input validation

### 6.2 Integration Tests
- End-to-end profile viewing
- Connection management flow
- Error handling scenarios

### 6.3 Performance Tests
- Load testing for profile endpoints
- Database query optimization
- Caching effectiveness

## 7. Monitoring and Analytics

### 7.1 Metrics to Track
- Profile view counts
- Connection request rates
- API response times
- Error rates

### 7.2 Logging
- Profile access logs
- Connection activity logs
- Error logs with context

## 8. Implementation Priority

### Phase 1 (High Priority)
1. Basic user profile endpoint
2. Connection status integration
3. Basic mutual friends calculation

### Phase 2 (Medium Priority)
1. Performance optimization
2. Caching implementation
3. Advanced mutual friends features

### Phase 3 (Low Priority)
1. Analytics and monitoring
2. Advanced security features
3. Performance tuning

## 9. API Documentation

The backend team should provide:
- OpenAPI/Swagger documentation
- Postman collection for testing
- Example requests and responses
- Error code documentation

## 10. Frontend Integration Notes

The frontend expects:
- Consistent API response format
- Real-time connection status updates
- Efficient image loading
- Graceful error handling
- Loading states for better UX