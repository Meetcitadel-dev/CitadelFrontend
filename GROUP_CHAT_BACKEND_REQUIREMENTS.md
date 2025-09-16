# Group Chat Backend Requirements

## Overview
This document outlines the backend requirements for implementing group chat functionality in the Citadel application. The group chat feature allows users to create groups, add/remove members, send messages, and manage group settings.

## Database Schema

### 1. Groups Table
```sql
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    avatar_url VARCHAR(500),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);
```

### 2. Group Members Table
```sql
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_admin BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);
```

### 3. Group Messages Table
```sql
CREATE TABLE group_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text', -- text, image, file, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE
);
```

### 4. Group Message Read Status Table
```sql
CREATE TABLE group_message_reads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES group_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(message_id, user_id)
);
```

## API Endpoints

### 1. Group Management

#### GET /api/v1/connections
**Purpose**: Fetch user's connections for group creation
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "connections": [
    {
      "id": "uuid",
      "name": "John Doe",
      "location": "IIT Delhi",
      "avatar": "https://example.com/avatar.jpg"
    }
  ]
}
```

#### POST /api/v1/groups
**Purpose**: Create a new group
**Authentication**: Required
**Request Body**:
```json
{
  "name": "Study Group",
  "description": "Optional group description",
  "memberIds": ["uuid1", "uuid2", "uuid3"]
}
```
**Response**:
```json
{
  "success": true,
  "group": {
    "id": "uuid",
    "name": "Study Group",
    "description": "Optional group description",
    "avatar": null,
    "members": [...],
    "memberCount": 3,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "lastMessage": null,
    "unreadCount": 0,
    "isAdmin": true
  }
}
```

#### GET /api/v1/groups
**Purpose**: Fetch user's groups
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "groups": [
    {
      "id": "uuid",
      "name": "Study Group",
      "description": "Optional description",
      "avatar": null,
      "members": [...],
      "memberCount": 3,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "lastMessage": {
        "id": "uuid",
        "content": "Hello everyone!",
        "senderId": "uuid",
        "senderName": "John Doe",
        "timestamp": "2024-01-01T00:00:00Z"
      },
      "unreadCount": 2,
      "isAdmin": true
    }
  ]
}
```

#### GET /api/v1/groups/{groupId}
**Purpose**: Fetch specific group details
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "group": {
    "id": "uuid",
    "name": "Study Group",
    "description": "Optional description",
    "avatar": null,
    "members": [
      {
        "id": "uuid",
        "name": "John Doe",
        "location": "IIT Delhi",
        "avatar": "https://example.com/avatar.jpg",
        "isAdmin": true,
        "joinedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "memberCount": 3,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "lastMessage": {...},
    "unreadCount": 2,
    "isAdmin": true
  }
}
```

#### PUT /api/v1/groups/{groupId}
**Purpose**: Update group details
**Authentication**: Required (Admin only)
**Request Body**:
```json
{
  "name": "Updated Group Name",
  "description": "Updated description",
  "memberIds": ["uuid1", "uuid2"] // Optional: update members
}
```
**Response**:
```json
{
  "success": true,
  "group": {
    // Updated group object
  }
}
```

#### DELETE /api/v1/groups/{groupId}
**Purpose**: Delete group
**Authentication**: Required (Admin only)
**Response**:
```json
{
  "success": true,
  "message": "Group deleted successfully"
}
```

### 2. Group Members Management

#### POST /api/v1/groups/{groupId}/members
**Purpose**: Add members to group
**Authentication**: Required (Admin only)
**Request Body**:
```json
{
  "memberIds": ["uuid1", "uuid2", "uuid3"]
}
```
**Response**:
```json
{
  "success": true,
  "message": "Members added successfully"
}
```

#### DELETE /api/v1/groups/{groupId}/members/{memberId}
**Purpose**: Remove member from group
**Authentication**: Required (Admin only)
**Response**:
```json
{
  "success": true,
  "message": "Member removed successfully"
}
```

#### POST /api/v1/groups/{groupId}/leave
**Purpose**: Leave group
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "message": "Left group successfully"
}
```

### 3. Group Messages

#### GET /api/v1/groups/{groupId}/messages
**Purpose**: Fetch group messages
**Authentication**: Required
**Query Parameters**:
- `limit`: Number of messages to fetch (default: 50)
- `offset`: Offset for pagination (default: 0)
**Response**:
```json
{
  "success": true,
  "messages": [
    {
      "id": "uuid",
      "groupId": "uuid",
      "senderId": "uuid",
      "senderName": "John Doe",
      "senderAvatar": "https://example.com/avatar.jpg",
      "content": "Hello everyone!",
      "timestamp": "2024-01-01T00:00:00Z",
      "isEdited": false,
      "editedAt": null
    }
  ]
}
```

#### POST /api/v1/groups/{groupId}/messages
**Purpose**: Send message to group
**Authentication**: Required
**Request Body**:
```json
{
  "content": "Hello everyone!"
}
```
**Response**:
```json
{
  "success": true,
  "message": {
    "id": "uuid",
    "groupId": "uuid",
    "senderId": "uuid",
    "senderName": "John Doe",
    "senderAvatar": "https://example.com/avatar.jpg",
    "content": "Hello everyone!",
    "timestamp": "2024-01-01T00:00:00Z",
    "isEdited": false,
    "editedAt": null
  }
}
```

#### POST /api/v1/groups/{groupId}/messages/read
**Purpose**: Mark group messages as read
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "message": "Messages marked as read"
}
```

## Business Logic Requirements

### 1. Group Creation
- Only authenticated users can create groups
- Group creator automatically becomes admin
- All selected members must be connections of the creator
- Group name is required, description is optional
- Maximum group size: 50 members (configurable)

### 2. Group Membership
- Users can only be added to groups if they are connections of an admin
- Admins can add/remove members
- Regular members can leave the group
- If admin leaves, transfer admin role to another member or delete group

### 3. Message Handling
- Only group members can send messages
- Messages are stored with sender information
- Support for message editing (within time limit)
- Track read status for each member
- Real-time message delivery via WebSocket

### 4. Permissions
- **Admin permissions**: Add/remove members, edit group details, delete group
- **Member permissions**: Send messages, view group details, leave group
- **Non-member permissions**: None

### 5. Data Validation
- Group name: 1-255 characters
- Message content: 1-1000 characters
- Member count: 2-50 members per group
- User can be in maximum 20 groups

## Real-time Features

### WebSocket Events
```javascript
// Client joins group
socket.emit('join-group', { groupId: 'uuid' });

// New message
socket.on('group-message', {
  groupId: 'uuid',
  message: { /* message object */ }
});

// Member joined
socket.on('member-joined', {
  groupId: 'uuid',
  member: { /* member object */ }
});

// Member left
socket.on('member-left', {
  groupId: 'uuid',
  memberId: 'uuid'
});

// Group updated
socket.on('group-updated', {
  groupId: 'uuid',
  group: { /* updated group object */ }
});
```

## Security Considerations

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: Users can only access groups they're members of
3. **Input Validation**: Sanitize all user inputs
4. **Rate Limiting**: Limit message sending frequency
5. **Content Moderation**: Optional content filtering
6. **Data Privacy**: Ensure group data is not exposed to non-members

## Performance Considerations

1. **Pagination**: Implement cursor-based pagination for messages
2. **Caching**: Cache frequently accessed group data
3. **Indexing**: Proper database indexes for queries
4. **Message Delivery**: Optimize for real-time delivery
5. **File Uploads**: Support for image/file sharing (future enhancement)

## Error Handling

### Common Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

### Error Codes
- `GROUP_NOT_FOUND`: Group doesn't exist
- `NOT_MEMBER`: User is not a member of the group
- `NOT_ADMIN`: User doesn't have admin permissions
- `MEMBER_LIMIT_EXCEEDED`: Group is full
- `INVALID_INPUT`: Invalid request data
- `UNAUTHORIZED`: Authentication required

## Testing Requirements

1. **Unit Tests**: Test all business logic functions
2. **Integration Tests**: Test API endpoints
3. **WebSocket Tests**: Test real-time functionality
4. **Load Tests**: Test with multiple concurrent users
5. **Security Tests**: Test authorization and input validation

## Deployment Considerations

1. **Database Migration**: Create migration scripts for new tables
2. **Environment Variables**: Configure database connections, WebSocket settings
3. **Monitoring**: Set up logging and monitoring for group chat activity
4. **Backup Strategy**: Ensure group data is backed up regularly
5. **Scaling**: Plan for horizontal scaling of WebSocket servers






















