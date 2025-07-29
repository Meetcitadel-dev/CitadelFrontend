# Backend Requirements for Notification Functionality

## Overview
The notification system handles two types of notifications:
1. **Connection Requests** - When users send connection requests to each other
2. **Adjective Notifications** - When users receive adjective selections from others

## 1. Database Schema Updates

### Connection Requests Table
```sql
CREATE TABLE connection_requests (
  id VARCHAR(36) PRIMARY KEY,
  requester_id VARCHAR(36) NOT NULL,
  target_id VARCHAR(36) NOT NULL,
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_id) REFERENCES users(id),
  FOREIGN KEY (target_id) REFERENCES users(id),
  UNIQUE KEY unique_request (requester_id, target_id)
);
```

### Adjective Notifications Table
```sql
CREATE TABLE adjective_notifications (
  id VARCHAR(36) PRIMARY KEY,
  target_user_id VARCHAR(36) NOT NULL,
  adjective VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (target_user_id) REFERENCES users(id)
);
```

### Notification Read Status Table
```sql
CREATE TABLE notification_read_status (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  notification_id VARCHAR(36) NOT NULL,
  notification_type ENUM('connection_request', 'adjective_notification') NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_notification_read (user_id, notification_id, notification_type)
);
```

## 2. API Endpoints

### Fetch All Notifications
**Endpoint:** `GET /api/v1/notifications`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "connectionRequests": [
    {
      "id": "uuid",
      "requesterId": "uuid",
      "requesterName": "John Doe",
      "requesterLocation": "IIT Delhi",
      "requesterProfileImage": "https://example.com/image.jpg",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "adjectiveNotifications": [
    {
      "id": "uuid",
      "adjective": "funny",
      "count": 5,
      "userIds": ["uuid1", "uuid2", "uuid3", "uuid4", "uuid5"],
      "userNames": ["User1", "User2", "User3", "User4", "User5"],
      "userProfileImages": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
      "timeAgo": "2 hours ago",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "requestCount": 3
}
```

### Handle Connection Request (Accept/Reject)
**Endpoint:** `POST /api/v1/notifications/connection-request`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "requestId": "uuid",
  "action": "accept" | "reject"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Request accepted successfully",
  "connectionState": {
    "id": "uuid",
    "userId1": "uuid",
    "userId2": "uuid",
    "status": "connected",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Mark Notification as Read
**Endpoint:** `POST /api/v1/notifications/{notificationId}/read`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

## 3. Backend Implementation Details

### Notification Aggregation Logic

#### Connection Requests
1. **Fetch Pending Requests:**
   - Query `connection_requests` table where `target_id = current_user_id` AND `status = 'pending'`
   - Join with `users` table to get requester details
   - Order by `created_at` DESC

2. **Handle Accept/Reject:**
   - Update `connection_requests` status to 'accepted' or 'rejected'
   - If accepted, create/update connection in `connections` table
   - Send push notification to requester

#### Adjective Notifications
1. **Aggregate by Adjective:**
   - Query `adjective_selections` table where `target_user_id = current_user_id`
   - Group by `adjective`
   - Count unique users who selected each adjective
   - Get user details for display

2. **Time Ago Calculation:**
   - Calculate relative time from `created_at` to now
   - Format as "2 hours ago", "1 day ago", etc.

### Data Processing Functions

#### Get Connection Requests
```javascript
async function getConnectionRequests(userId) {
  const requests = await db.query(`
    SELECT 
      cr.id,
      cr.requester_id,
      cr.status,
      cr.created_at,
      u.name as requester_name,
      u.university as requester_location,
      u.profile_image as requester_profile_image
    FROM connection_requests cr
    JOIN users u ON cr.requester_id = u.id
    WHERE cr.target_id = ? AND cr.status = 'pending'
    ORDER BY cr.created_at DESC
  `, [userId]);
  
  return requests;
}
```

#### Get Adjective Notifications
```javascript
async function getAdjectiveNotifications(userId) {
  const notifications = await db.query(`
    SELECT 
      adjective,
      COUNT(DISTINCT user_id) as count,
      GROUP_CONCAT(DISTINCT u.name) as user_names,
      GROUP_CONCAT(DISTINCT u.profile_image) as user_profile_images,
      MAX(created_at) as latest_selection
    FROM adjective_selections as
    JOIN users u ON as.user_id = u.id
    WHERE as.target_user_id = ?
    GROUP BY adjective
    ORDER BY latest_selection DESC
  `, [userId]);
  
  return notifications.map(notification => ({
    ...notification,
    userNames: notification.user_names.split(','),
    userProfileImages: notification.user_profile_images.split(','),
    timeAgo: calculateTimeAgo(notification.latest_selection)
  }));
}
```

## 4. Error Handling

### Common Error Responses
```json
{
  "success": false,
  "message": "Unauthorized",
  "errorCode": "UNAUTHORIZED"
}
```

```json
{
  "success": false,
  "message": "Request not found",
  "errorCode": "REQUEST_NOT_FOUND"
}
```

```json
{
  "success": false,
  "message": "Invalid action",
  "errorCode": "INVALID_ACTION"
}
```

## 5. Security Considerations

1. **Authentication:** Require valid JWT token for all endpoints
2. **Authorization:** Users can only view their own notifications
3. **Rate Limiting:** Prevent spam notification requests
4. **Data Validation:** Validate all input parameters

## 6. Performance Considerations

1. **Indexing:** Add indexes on frequently queried columns
2. **Pagination:** Implement pagination for large notification lists
3. **Caching:** Cache notification counts and recent notifications
4. **Database Optimization:** Use efficient queries with proper joins

## 7. Integration Points

### Connection Management Integration
- When a connection request is sent, create entry in `connection_requests` table
- When connection is accepted/rejected, update status and send notifications

### Adjective Selection Integration
- When adjective is selected, create entry in `adjective_selections` table
- Aggregate adjective selections for notification display

### Real-time Updates
- Consider implementing WebSocket connections for real-time notification updates
- Send push notifications for immediate user awareness