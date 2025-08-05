# Enhanced Adjective System Backend Requirements

## Overview
This document outlines the backend requirements for implementing the enhanced adjective matching system with gender-based adjective selection, user engagement tracking, and mutual matching functionality.

## 1. Database Schema Updates

### New Tables

#### `adjective_selections` Table
```sql
CREATE TABLE adjective_selections (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  target_user_id VARCHAR(36) NOT NULL,
  adjective VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_matched BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_selection (user_id, target_user_id)
);
```

#### `matches` Table
```sql
CREATE TABLE matches (
  id VARCHAR(36) PRIMARY KEY,
  user_id_1 VARCHAR(36) NOT NULL,
  user_id_2 VARCHAR(36) NOT NULL,
  mutual_adjective VARCHAR(50) NOT NULL,
  is_connected BOOLEAN DEFAULT FALSE,
  match_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  connection_timestamp TIMESTAMP NULL,
  ice_breaking_prompt TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id_1) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id_2) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_match (user_id_1, user_id_2)
);
```

### Updated Tables

#### `users` Table - Add Gender Field
```sql
ALTER TABLE users ADD COLUMN gender VARCHAR(10) DEFAULT 'Other';
```

#### `connections` Table - Add Match Status
```sql
ALTER TABLE connections ADD COLUMN status ENUM('not_connected', 'requested', 'connected', 'blocked', 'pending', 'matched') DEFAULT 'not_connected';
ALTER TABLE connections ADD COLUMN match_data JSON NULL;
```

## 2. API Endpoints

### 2.1 Get User Gender
**Endpoint:** `GET /api/v1/enhanced-explore/profile/gender`

**Response:**
```json
{
  "success": true,
  "gender": "Male|Female|Other",
  "message": "string"
}
```

### 2.2 Get Available Adjectives for Target User
**Endpoint:** `GET /api/v1/enhanced-explore/adjectives/available/:targetUserId`

**Response:**
```json
{
  "success": true,
  "adjectives": ["string"],
  "hasPreviousSelection": boolean,
  "previousSelection": "string",
  "message": "string"
}
```

### 2.3 Get Adjective Selections for User
**Endpoint:** `GET /api/v1/enhanced-explore/adjectives/selections/:targetUserId`

**Response:**
```json
{
  "success": true,
  "selections": [
    {
      "id": "string",
      "userId": "string",
      "targetUserId": "string",
      "adjective": "string",
      "timestamp": "ISO string",
      "isMatched": boolean
    }
  ],
  "message": "string"
}
```

### 2.4 Enhanced Adjective Selection
**Endpoint:** `POST /api/v1/enhanced-explore/adjectives/select`

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
  "matched": boolean,
  "matchData": {
    "id": "string",
    "userId1": "string",
    "userId2": "string",
    "mutualAdjective": "string",
    "matchTimestamp": "ISO string"
  },
  "message": "string"
}
```

**Note:** This endpoint should handle both new selections and updates to previous selections. If a user has already selected an adjective for a target user, the new selection should replace the old one and trigger match detection with the updated selection.

### 2.5 Get Match State
**Endpoint:** `GET /api/v1/enhanced-explore/matches/state/:targetUserId`

**Response:**
```json
{
  "success": true,
  "matchState": {
    "id": "string",
    "userId1": "string",
    "userId2": "string",
    "mutualAdjective": "string",
    "isConnected": boolean,
    "matchTimestamp": "ISO string",
    "connectionTimestamp": "ISO string",
    "iceBreakingPrompt": "string"
  },
  "message": "string"
}
```

### 2.6 Connect After Match
**Endpoint:** `POST /api/v1/enhanced-explore/matches/connect`

**Request Body:**
```json
{
  "targetUserId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "connectionState": {
    "id": "string",
    "userId1": "string",
    "userId2": "string",
    "status": "connected",
    "createdAt": "ISO string",
    "updatedAt": "ISO string"
  },
  "message": "string"
}
```

### 2.7 Get Ice-Breaking Prompt
**Endpoint:** `GET /api/v1/enhanced-explore/matches/ice-breaking/:targetUserId`

**Response:**
```json
{
  "success": true,
  "prompt": "string",
  "message": "string"
}
```

### 2.8 Send Connection Request (Case 3) - ✅ COMPLETED
**Endpoint:** `POST /api/v1/enhanced-chats/connection-request`

**Request Body:**
```json
{
  "targetUserId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "string"
}
```

### 2.9 Dismiss Match Prompt - ✅ COMPLETED
**Endpoint:** `POST /api/v1/enhanced-chats/dismiss`

**Request Body:**
```json
{
  "targetUserId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "string"
}
```

### 2.10 Move Chat to Active Section - ✅ COMPLETED
**Endpoint:** `POST /api/v1/enhanced-chats/move-to-active`

**Request Body:**
```json
{
  "targetUserId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "string"
}
```

### 2.11 Check Chat History - ✅ COMPLETED
**Endpoint:** `GET /api/v1/enhanced-chats/chat-history/:targetUserId`

**Response:**
```json
{
  "success": true,
  "hasChatHistory": boolean,
  "message": "string"
}
```

### 2.12 Enhanced Matches Endpoint - ✅ COMPLETED
**Endpoint:** `GET /api/v1/enhanced-chats/matches`

**Response:**
```json
{
  "success": true,
  "conversations": [
    {
      "id": "string",
      "userId": "string",
      "name": "string",
      "lastMessage": "string",
      "lastMessageTime": "string",
      "unreadCount": number,
      "caseType": "CASE_1|CASE_2|CASE_3",
      "isConnected": boolean,
      "hasChatHistory": boolean,
      "matchData": {
        "mutualAdjective": "string",
        "iceBreakingPrompt": "string"
      }
    }
  ],
  "message": "string"
}
```

## 3. Business Logic Implementation

### 3.1 Adjective Selection Logic
1. **Gender-based adjective filtering:**
   - Same gender: Show gender-specific + neutral adjectives
   - Different gender: Show only neutral adjectives
   - Unknown gender: Show only neutral adjectives

2. **User engagement tracking:**
   - Store all adjective selections in `adjective_selections` table
   - Allow users to update their previous selections (latest selection takes precedence)
   - Track which adjectives have been shown to users
   - Ensure users can't select adjectives for profiles they've already interacted with

3. **Adjective display generation:**
   - If user has previous selection: Show 1 selected + 3 random adjectives
   - If no previous selection: Show 4 random adjectives
   - Ensure no duplicates in the 4-adjective display
   - Allow users to change their selection (new selection replaces old one)

### 3.2 Match Detection Logic
1. **Real-time match checking:**
   - When user selects adjective, check if target user has selected same adjective
   - If match found, create entry in `matches` table
   - Generate ice-breaking prompt based on mutual adjective

2. **Match notification:**
   - Send real-time notification to both users
   - Update connection status to 'matched'
   - Add match to both users' matches list

### 3.3 Connection Flow
1. **Pre-connection state:**
   - Matched users can see each other in "Matches" tab
   - Chat is disabled until connection is established
   - Show ice-breaking prompt and connect button

2. **Connection process:**
   - User clicks "Connect" button
   - Update match status to connected
   - Enable chat functionality
   - Send system message about connection

### 3.4 Enhanced Chat Matching Logic - ✅ COMPLETED

#### Case 1: Already Connected + Already Chatting + Match - ✅ IMPLEMENTED
- **Behavior:** Chat appears in both Active AND Matches sections
- **Matches Section:** Shows prompt with cross button (no connect button)
- **Active Section:** Shows normal chat (no prompt)
- **Action:** Clicking cross removes prompt, chat stays in both sections
- **Backend Logic:** ✅ Check if users are connected AND have chat history

#### Case 2: Already Connected + Never Chatted + Match - ✅ IMPLEMENTED
- **Behavior:** Chat appears ONLY in Matches section
- **UI:** Shows prompt with cross button (no connect button)
- **Menu:** Three dots menu has "Move to Active" option
- **Action:** Moving to Active is user-specific (only moves for that user)
- **Backend Logic:** ✅ Check if users are connected but NO chat history

#### Case 3: Never Connected + Match - ✅ IMPLEMENTED
- **Behavior:** Chat appears ONLY in Matches section
- **UI:** Shows prompt with "Connect to Chat" button
- **Action:** Clicking connect sends connection request to notifications
- **After Connection:** Prompt changes to cross button
- **Move Option:** Can then move to Active section
- **Backend Logic:** ✅ Check if users are NOT connected

## 4. Data Models

### AdjectiveSelection Model
```javascript
{
  id: String,
  userId: String,
  targetUserId: String,
  adjective: String,
  timestamp: Date,
  isMatched: Boolean
}
```

### Match Model
```javascript
{
  id: String,
  userId1: String,
  userId2: String,
  mutualAdjective: String,
  isConnected: Boolean,
  matchTimestamp: Date,
  connectionTimestamp: Date,
  iceBreakingPrompt: String
}
```

## 5. Security Considerations

1. **Input validation:**
   - Validate adjective selection against allowed adjectives
   - Ensure user can only select adjectives for profiles they can see
   - Prevent duplicate selections

2. **Rate limiting:**
   - Limit adjective selections per user per time period
   - Prevent spam selections

3. **Data privacy:**
   - Ensure match data is only visible to matched users
   - Protect user gender information

## 6. Performance Considerations

1. **Database indexing:**
   - Index on `adjective_selections(user_id, target_user_id)`
   - Index on `matches(user_id_1, user_id_2)`
   - Index on `users(gender)` for filtering

2. **Caching:**
   - Cache user gender information
   - Cache adjective selections for quick lookup
   - Cache match states

3. **Query optimization:**
   - Use efficient joins for match detection
   - Implement pagination for large datasets

## 7. Testing Requirements

1. **Unit tests:**
   - Adjective selection logic
   - Match detection algorithm
   - Gender-based filtering

2. **Integration tests:**
   - End-to-end match flow
   - Connection process
   - Real-time notifications

3. **Performance tests:**
   - Large dataset handling
   - Concurrent user scenarios

## 8. Migration Strategy

1. **Phase 1: Database updates**
   - Add new tables and columns
   - Migrate existing data

2. **Phase 2: API implementation**
   - Implement new endpoints
   - Update existing endpoints

3. **Phase 3: Frontend integration**
   - Deploy frontend changes
   - A/B testing with new system

4. **Phase 4: Full rollout**
   - Enable new system for all users
   - Monitor performance and user feedback 