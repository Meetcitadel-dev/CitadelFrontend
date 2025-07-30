# Chat System Backend Requirements

## Overview
This document outlines the backend requirements for implementing a complete real-time chat system with active conversations, matches, and messaging functionality.

## 1. API Endpoints Required

### 1.1 Fetch Active Conversations
**Endpoint:** `GET /api/v1/chats/active`

**Purpose:** Get all conversations with connected users (users you have accepted connections with)

**Request:**
- Headers: `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "conversations": [
    {
      "id": "string",
      "userId": "string",
      "name": "string",
      "profileImage": "string",
      "lastMessage": "string",
      "lastMessageTime": "2024-01-15T10:30:00Z",
      "isOnline": true,
      "unreadCount": 3
    }
  ]
}
```

### 1.2 Fetch Matched Conversations
**Endpoint:** `GET /api/v1/chats/matches`

**Purpose:** Get all conversations with matched users (users you have mutual matches with)

**Request:**
- Headers: `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "conversations": [
    {
      "id": "string",
      "userId": "string",
      "name": "string",
      "profileImage": "string",
      "lastMessage": "string",
      "lastMessageTime": "2024-01-15T10:30:00Z",
      "isOnline": true,
      "unreadCount": 0
    }
  ]
}
```

### 1.3 Fetch Conversation Messages
**Endpoint:** `GET /api/v1/chats/{conversationId}/messages`

**Purpose:** Get all messages for a specific conversation

**Request:**
- Headers: `Authorization: Bearer {token}`
- URL Parameters: `{conversationId}` - the conversation ID

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "string",
      "text": "Hello!",
      "isSent": true,
      "timestamp": "2024-01-15T10:30:00Z",
      "status": "read"
    }
  ]
}
```

### 1.4 Send Message
**Endpoint:** `POST /api/v1/chats/{conversationId}/messages`

**Purpose:** Send a new message in a conversation

**Request:**
- Headers: `Authorization: Bearer {token}`
- URL Parameters: `{conversationId}` - the conversation ID
- Body:
```json
{
  "message": "Hello, how are you?"
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": "string",
    "text": "Hello, how are you?",
    "timestamp": "2024-01-15T10:30:00Z",
    "status": "sent"
  }
}
```

### 1.5 Mark Messages as Read
**Endpoint:** `POST /api/v1/chats/{conversationId}/read`

**Purpose:** Mark all messages in a conversation as read

**Request:**
- Headers: `Authorization: Bearer {token}`
- URL Parameters: `{conversationId}` - the conversation ID

**Response:**
```json
{
  "success": true
}
```

### 1.6 Get Conversation by User ID
**Endpoint:** `GET /api/v1/chats/conversation/{userId}`

**Purpose:** Get or create a conversation with a specific user

**Request:**
- Headers: `Authorization: Bearer {token}`
- URL Parameters: `{userId}` - the user ID to chat with

**Response:**
```json
{
  "success": true,
  "conversation": {
    "id": "string",
    "userId": "string",
    "name": "string",
    "profileImage": "string"
  }
}
```

## 2. Database Schema

### 2.1 Conversations Table
```sql
CREATE TABLE conversations (
  id VARCHAR PRIMARY KEY,
  user1_id VARCHAR NOT NULL,
  user2_id VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(user1_id, user2_id)
);
```

### 2.2 Messages Table
```sql
CREATE TABLE messages (
  id VARCHAR PRIMARY KEY,
  conversation_id VARCHAR NOT NULL,
  sender_id VARCHAR NOT NULL,
  text TEXT NOT NULL,
  status ENUM('sent', 'delivered', 'read') DEFAULT 'sent',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);
```

### 2.3 User Online Status Table
```sql
CREATE TABLE user_online_status (
  user_id VARCHAR PRIMARY KEY,
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 3. Real-time Features

### 3.1 WebSocket Implementation
**WebSocket Endpoint:** `ws://your-domain/ws/chat`

**Connection:**
- Connect with authentication token
- Subscribe to user-specific channels

**Events:**
```javascript
// New message received
{
  "type": "new_message",
  "data": {
    "conversationId": "string",
    "message": {
      "id": "string",
      "text": "string",
      "senderId": "string",
      "timestamp": "string"
    }
  }
}

// User online status
{
  "type": "user_status",
  "data": {
    "userId": "string",
    "isOnline": true,
    "lastSeen": "string"
  }
}

// Message status update
{
  "type": "message_status",
  "data": {
    "messageId": "string",
    "status": "delivered" | "read"
  }
}
```

## 4. Business Logic Requirements

### 4.1 Conversation Management
- Create conversations automatically when users connect
- Separate active conversations (connected users) from matches
- Handle conversation permissions (only connected users can chat)
- Auto-create conversations when users match

### 4.2 Message Handling
- Validate message content (length, content filtering)
- Handle message delivery status
- Implement message read receipts
- Support message deletion (optional)

### 4.3 Online Status
- Track user online/offline status
- Update last seen timestamp
- Broadcast status changes to connected users
- Handle connection timeouts

### 4.4 Security & Privacy
- Validate user permissions for each conversation
- Prevent access to conversations user doesn't belong to
- Rate limiting for message sending
- Content moderation (optional)

## 5. Performance Requirements

### 5.1 Message Loading
- Paginate message history (50 messages per page)
- Optimize database queries with proper indexing
- Cache recent conversations

### 5.2 Real-time Performance
- WebSocket connection management
- Efficient message broadcasting
- Handle high concurrent connections

### 5.3 Database Optimization
```sql
-- Indexes for optimal performance
CREATE INDEX idx_conversations_users ON conversations(user1_id, user2_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_user_online_status ON user_online_status(is_online, last_seen);
```

## 6. Error Handling

### 6.1 Common Error Scenarios
- User not found (404)
- Conversation not found (404)
- Unauthorized access (401)
- Rate limit exceeded (429)
- Message too long (400)
- User not connected (403)

### 6.2 Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## 7. Testing Requirements

### 7.1 Unit Tests
- Message sending/receiving
- Conversation creation
- Online status updates
- Permission validation

### 7.2 Integration Tests
- End-to-end messaging flow
- Real-time message delivery
- WebSocket connection handling
- Error scenarios

### 7.3 Load Tests
- High concurrent messaging
- WebSocket connection limits
- Database performance under load

## 8. Implementation Priority

### Phase 1 (High Priority)
1. Basic conversation endpoints
2. Message sending/receiving
3. Simple online status

### Phase 2 (Medium Priority)
1. WebSocket real-time messaging
2. Message read receipts
3. Advanced online status

### Phase 3 (Low Priority)
1. Message deletion
2. Content moderation
3. Advanced features (typing indicators, etc.)

## 9. Frontend Integration Notes

The frontend expects:
- Real-time message updates via WebSocket
- Automatic conversation creation
- Online status indicators
- Message read receipts
- Proper error handling
- Loading states for all operations

## 10. Security Considerations

- Validate all user permissions
- Sanitize message content
- Rate limit message sending
- Secure WebSocket connections
- Prevent message spoofing
- Handle user blocking functionality 