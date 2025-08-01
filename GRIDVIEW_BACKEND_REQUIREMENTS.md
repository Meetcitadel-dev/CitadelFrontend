# Grid View Backend Requirements

## Overview
The grid view functionality allows users to browse all available profiles in a card-based interface with infinite scrolling, search, filtering, and sorting capabilities. This document outlines the backend requirements for this feature.

## 1. Enhanced API Endpoints

### 1.1 GET /api/v1/explore/profiles (Enhanced)
**Purpose**: Fetch profiles with advanced filtering, sorting, and pagination
**Parameters**:
- `limit` (number): Number of profiles to return (default: 20)
- `offset` (number): Pagination offset (default: 0)
- `search` (string): Search query for name or university
- `sortBy` (string): Sorting option ("year_asc", "year_desc", "name_asc", "name_desc")
- `gender` (string): Filter by gender ("male", "female", "other")
- `years` (string[]): Filter by academic years (["First", "Second", "Third", "Fourth"])
- `universities` (string[]): Filter by university names
- `skills` (string[]): Filter by skills
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
      "gender": "string",
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
  "totalCount": 100,
  "filters": {
    "availableUniversities": ["string"],
    "availableSkills": ["string"],
    "availableYears": ["string"]
  }
}
```

### 1.2 POST /api/v1/connections/manage (Enhanced)
**Purpose**: Manage connection requests with improved response handling
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
    "requesterId": "uuid",
    "targetId": "uuid",
    "status": "not_connected|requested|connected|blocked",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

## 2. Database Schema Enhancements

### 2.1 Users Table (Additions)
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(10);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active TIMESTAMP DEFAULT NOW();
```

### 2.2 Connections Table (Enhanced)
```sql
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID NOT NULL REFERENCES users(id),
  user_id_2 UUID NOT NULL REFERENCES users(id),
  requester_id UUID REFERENCES users(id),
  target_id UUID REFERENCES users(id),
  status VARCHAR(20) NOT NULL CHECK (status IN ('requested', 'connected', 'blocked', 'not_connected')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id_1, user_id_2)
);

CREATE INDEX idx_connections_user_id_1 ON connections(user_id_1);
CREATE INDEX idx_connections_user_id_2 ON connections(user_id_2);
CREATE INDEX idx_connections_status ON connections(status);
```

### 2.3 Profile Views Table (New)
```sql
CREATE TABLE IF NOT EXISTS profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_id UUID NOT NULL REFERENCES users(id),
  viewed_id UUID NOT NULL REFERENCES users(id),
  viewed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(viewer_id, viewed_id)
);

CREATE INDEX idx_profile_views_viewer_id ON profile_views(viewer_id);
CREATE INDEX idx_profile_views_viewed_id ON profile_views(viewed_id);
```

## 3. Backend Implementation Requirements

### 3.1 Profile Fetching Algorithm
```javascript
// Pseudo-code for enhanced profile fetching
async function fetchExploreProfiles(params) {
  const {
    limit = 20,
    offset = 0,
    search = '',
    sortBy = 'match_score',
    gender = '',
    years = [],
    universities = [],
    skills = [],
    userId
  } = params;

  // Build query with filters
  let query = `
    SELECT DISTINCT u.*, 
           c.status as connection_status,
           c.id as connection_id,
           c.requester_id,
           c.target_id,
           COUNT(pv.id) as view_count
    FROM users u
    LEFT JOIN connections c ON (c.user_id_1 = u.id AND c.user_id_2 = $1) 
                           OR (c.user_id_2 = u.id AND c.user_id_1 = $1)
    LEFT JOIN profile_views pv ON pv.viewed_id = u.id
    WHERE u.id != $1 AND u.is_active = true
  `;

  const queryParams = [userId];
  let paramIndex = 2;

  // Add search filter
  if (search) {
    query += ` AND (u.name ILIKE $${paramIndex} OR u.university_name ILIKE $${paramIndex})`;
    queryParams.push(`%${search}%`);
    paramIndex++;
  }

  // Add gender filter
  if (gender) {
    query += ` AND u.gender = $${paramIndex}`;
    queryParams.push(gender);
    paramIndex++;
  }

  // Add years filter
  if (years.length > 0) {
    query += ` AND u.year = ANY($${paramIndex})`;
    queryParams.push(years);
    paramIndex++;
  }

  // Add universities filter
  if (universities.length > 0) {
    query += ` AND u.university_name = ANY($${paramIndex})`;
    queryParams.push(universities);
    paramIndex++;
  }

  // Add skills filter
  if (skills.length > 0) {
    query += ` AND u.skills && $${paramIndex}`;
    queryParams.push(skills);
    paramIndex++;
  }

  query += ` GROUP BY u.id, c.status, c.id, c.requester_id, c.target_id`;

  // Add sorting
  switch (sortBy) {
    case 'year_asc':
      query += ' ORDER BY u.year ASC';
      break;
    case 'year_desc':
      query += ' ORDER BY u.year DESC';
      break;
    case 'name_asc':
      query += ' ORDER BY u.name ASC';
      break;
    case 'name_desc':
      query += ' ORDER BY u.name DESC';
      break;
    default:
      query += ' ORDER BY view_count DESC, u.created_at DESC';
  }

  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  queryParams.push(limit, offset);

  return await db.query(query, queryParams);
}
```

### 3.2 Connection Management
```javascript
async function manageConnection(userId, targetUserId, action) {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    switch (action) {
      case 'connect':
        // Send connection request
        await client.query(`
          INSERT INTO connections (user_id_1, user_id_2, requester_id, target_id, status)
          VALUES ($1, $2, $1, $2, 'requested')
          ON CONFLICT (user_id_1, user_id_2) DO UPDATE SET
          status = 'requested',
          requester_id = $1,
          target_id = $2,
          updated_at = NOW()
        `, [userId, targetUserId]);
        break;
        
      case 'accept':
        // Accept connection request
        await client.query(`
          UPDATE connections 
          SET status = 'connected', updated_at = NOW()
          WHERE (user_id_1 = $1 AND user_id_2 = $2) 
             OR (user_id_1 = $2 AND user_id_2 = $1)
        `, [userId, targetUserId]);
        break;
        
      case 'reject':
        // Reject connection request
        await client.query(`
          UPDATE connections 
          SET status = 'not_connected', updated_at = NOW()
          WHERE (user_id_1 = $1 AND user_id_2 = $2) 
             OR (user_id_1 = $2 AND user_id_2 = $1)
        `, [userId, targetUserId]);
        break;
        
      case 'remove':
        // Remove connection
        await client.query(`
          DELETE FROM connections 
          WHERE (user_id_1 = $1 AND user_id_2 = $2) 
             OR (user_id_1 = $2 AND user_id_2 = $1)
        `, [userId, targetUserId]);
        break;
        
      case 'block':
        // Block user
        await client.query(`
          INSERT INTO connections (user_id_1, user_id_2, requester_id, target_id, status)
          VALUES ($1, $2, $1, $2, 'blocked')
          ON CONFLICT (user_id_1, user_id_2) DO UPDATE SET
          status = 'blocked',
          updated_at = NOW()
        `, [userId, targetUserId]);
        break;
    }
    
    await client.query('COMMIT');
    
    // Return updated connection state
    const result = await client.query(`
      SELECT * FROM connections 
      WHERE (user_id_1 = $1 AND user_id_2 = $2) 
         OR (user_id_1 = $2 AND user_id_2 = $1)
    `, [userId, targetUserId]);
    
    return result.rows[0] || { status: 'not_connected' };
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

### 3.3 Profile View Tracking
```javascript
async function trackProfileView(viewerId, viewedId) {
  await db.query(`
    INSERT INTO profile_views (viewer_id, viewed_id)
    VALUES ($1, $2)
    ON CONFLICT (viewer_id, viewed_id) DO UPDATE SET
    viewed_at = NOW()
  `, [viewerId, viewedId]);
}
```

## 4. Performance Optimizations

### 4.1 Database Indexes
```sql
-- Performance indexes for grid view
CREATE INDEX idx_users_active_gender ON users(is_active, gender);
CREATE INDEX idx_users_active_year ON users(is_active, year);
CREATE INDEX idx_users_active_university ON users(is_active, university_name);
CREATE INDEX idx_users_skills_gin ON users USING GIN(skills);
CREATE INDEX idx_users_name_search ON users USING GIN(to_tsvector('english', name));
CREATE INDEX idx_users_university_search ON users USING GIN(to_tsvector('english', university_name));
```

### 4.2 Caching Strategy
```javascript
// Redis caching for frequently accessed data
const CACHE_TTL = 300; // 5 minutes

async function getCachedProfiles(cacheKey) {
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  return null;
}

async function cacheProfiles(cacheKey, profiles) {
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(profiles));
}
```

## 5. Security Requirements

### 5.1 Rate Limiting
```javascript
// Rate limiting for profile fetching
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
};
```

### 5.2 Input Validation
```javascript
// Validation for filter parameters
const validateFilters = (filters) => {
  const allowedSortBy = ['year_asc', 'year_desc', 'name_asc', 'name_desc'];
  const allowedGenders = ['male', 'female', 'other'];
  const allowedYears = ['First', 'Second', 'Third', 'Fourth'];
  
  if (filters.sortBy && !allowedSortBy.includes(filters.sortBy)) {
    throw new Error('Invalid sortBy parameter');
  }
  
  if (filters.gender && !allowedGenders.includes(filters.gender)) {
    throw new Error('Invalid gender parameter');
  }
  
  if (filters.years && !filters.years.every(year => allowedYears.includes(year))) {
    throw new Error('Invalid years parameter');
  }
};
```

## 6. Error Handling

### 6.1 API Error Responses
```javascript
// Standard error response format
const errorResponse = (message, statusCode = 400) => ({
  success: false,
  error: {
    message,
    code: statusCode,
    timestamp: new Date().toISOString()
  }
});

// Common error scenarios
const handleProfileFetchError = (error) => {
  if (error.code === 'INVALID_TOKEN') {
    return errorResponse('Authentication required', 401);
  }
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    return errorResponse('Too many requests', 429);
  }
  return errorResponse('Internal server error', 500);
};
```

## 7. Testing Requirements

### 7.1 Unit Tests
```javascript
describe('Grid View API', () => {
  test('should fetch profiles with pagination', async () => {
    const response = await request(app)
      .get('/api/v1/explore/profiles?limit=10&offset=0')
      .set('Authorization', `Bearer ${validToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.profiles).toHaveLength(10);
  });
  
  test('should filter profiles by search query', async () => {
    const response = await request(app)
      .get('/api/v1/explore/profiles?search=john')
      .set('Authorization', `Bearer ${validToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.profiles.every(p => 
      p.name.toLowerCase().includes('john') || 
      p.university.name.toLowerCase().includes('john')
    )).toBe(true);
  });
});
```

### 7.2 Integration Tests
```javascript
describe('Connection Management', () => {
  test('should send connection request', async () => {
    const response = await request(app)
      .post('/api/v1/connections/manage')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        targetUserId: 'target-user-id',
        action: 'connect'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.connectionState.status).toBe('requested');
  });
});
```

## 8. Monitoring and Analytics

### 8.1 Metrics to Track
- Profile view counts
- Connection request success rates
- Search query patterns
- Filter usage statistics
- API response times
- Error rates

### 8.2 Logging
```javascript
// Structured logging for grid view actions
const logProfileView = (viewerId, viewedId) => {
  logger.info('Profile viewed', {
    viewerId,
    viewedId,
    timestamp: new Date().toISOString(),
    action: 'profile_view'
  });
};

const logConnectionAction = (userId, targetUserId, action) => {
  logger.info('Connection action', {
    userId,
    targetUserId,
    action,
    timestamp: new Date().toISOString()
  });
};
```

This comprehensive backend implementation will support all the frontend features including infinite scrolling, search, filtering, sorting, and real-time connection management. 