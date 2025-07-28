# Backend Requirements for Edit Profile Functionality

## Overview
The edit profile functionality allows users to update their profile information while keeping the email field non-editable. This document outlines all the backend changes required to support this feature.

## 1. Database Schema Updates

### User Profile Table
Add the following new fields to the user profile table:

```sql
ALTER TABLE users ADD COLUMN about_me TEXT;
ALTER TABLE users ADD COLUMN sports VARCHAR(255);
ALTER TABLE users ADD COLUMN movies VARCHAR(255);
ALTER TABLE users ADD COLUMN tv_shows VARCHAR(255);
ALTER TABLE users ADD COLUMN teams VARCHAR(255);
ALTER TABLE users ADD COLUMN portfolio_link VARCHAR(500);
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
```

## 2. API Endpoints

### Update Profile Endpoint
**Endpoint:** `PUT /api/v1/profile/update`

**Request Body:**
```json
{
  "name": "string",
  "gender": "string",
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
  "dateOfBirth": "YYYY-MM-DD"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
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
    "dateOfBirth": "YYYY-MM-DD",
    "skills": ["string"],
    "aboutMe": "string",
    "sports": "string",
    "movies": "string",
    "tvShows": "string",
    "teams": "string",
    "portfolioLink": "string",
    "phoneNumber": "string",
    "friends": ["string"],
    "isProfileComplete": true,
    "isEmailVerified": true,
    "images": [
      {
        "id": 1,
        "cloudfrontUrl": "string",
        "originalName": "string",
        "mimeType": "string",
        "fileSize": 12345,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get Profile Endpoint Update
**Endpoint:** `GET /api/v1/profile/me`

Update the existing endpoint to include the new fields in the response:

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
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
    "dateOfBirth": "YYYY-MM-DD",
    "skills": ["string"],
    "aboutMe": "string",
    "sports": "string",
    "movies": "string",
    "tvShows": "string",
    "teams": "string",
    "portfolioLink": "string",
    "phoneNumber": "string",
    "friends": ["string"],
    "isProfileComplete": true,
    "isEmailVerified": true,
    "images": [
      {
        "id": 1,
        "cloudfrontUrl": "string",
        "originalName": "string",
        "mimeType": "string",
        "fileSize": 12345,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

## 3. Backend Implementation Details

### Validation Rules
- **name**: Required, max 100 characters
- **gender**: Optional, must be one of: "Male", "Female", "Other"
- **degree**: Optional, max 100 characters
- **year**: Optional, max 10 characters
- **skills**: Optional, array of strings, max 10 items
- **aboutMe**: Optional, max 140 characters
- **sports**: Optional, max 255 characters
- **movies**: Optional, max 255 characters
- **tvShows**: Optional, max 255 characters
- **teams**: Optional, max 255 characters
- **portfolioLink**: Optional, must be valid URL format
- **phoneNumber**: Optional, must be valid phone number format
- **dateOfBirth**: Optional, must be valid date format (YYYY-MM-DD)

### Security Considerations
1. **Email Field Protection**: The email field should never be updatable through this endpoint
2. **Authentication**: Require valid JWT token
3. **Authorization**: Users can only update their own profile
4. **Input Sanitization**: Sanitize all input fields to prevent XSS attacks
5. **Rate Limiting**: Implement rate limiting to prevent abuse

### Error Handling
Return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (trying to update another user's profile)
- `500`: Internal Server Error

### Example Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": ["Name is required"],
    "aboutMe": ["About me cannot exceed 140 characters"]
  }
}
```

## 4. Database Migration Script

```sql
-- Migration script for adding new profile fields
BEGIN;

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN about_me TEXT,
ADD COLUMN sports VARCHAR(255),
ADD COLUMN movies VARCHAR(255),
ADD COLUMN tv_shows VARCHAR(255),
ADD COLUMN teams VARCHAR(255),
ADD COLUMN portfolio_link VARCHAR(500),
ADD COLUMN phone_number VARCHAR(20);

-- Create indexes for better query performance
CREATE INDEX idx_users_about_me ON users(about_me);
CREATE INDEX idx_users_sports ON users(sports);
CREATE INDEX idx_users_movies ON users(movies);
CREATE INDEX idx_users_tv_shows ON users(tv_shows);
CREATE INDEX idx_users_teams ON users(teams);

COMMIT;
```

## 5. Testing Requirements

### Unit Tests
- Test validation for each field
- Test email field protection
- Test authentication and authorization
- Test error handling

### Integration Tests
- Test complete profile update flow
- Test partial profile updates
- Test with invalid data
- Test with missing authentication

### API Tests
- Test all HTTP status codes
- Test response format consistency
- Test rate limiting
- Test concurrent requests

## 6. Frontend Integration Notes

The frontend is already prepared to handle:
- Loading existing profile data
- Displaying form fields with current values
- Making email field non-editable
- Submitting updates to the new API endpoint
- Handling success/error responses
- Navigation back to profile page after successful update

## 7. Deployment Checklist

- [ ] Run database migration
- [ ] Deploy backend code with new endpoint
- [ ] Update API documentation
- [ ] Test in staging environment
- [ ] Monitor for any issues
- [ ] Deploy to production

## 8. Monitoring and Analytics

Consider adding:
- Profile update success/failure metrics
- Most commonly updated fields
- User engagement with edit profile feature
- Error rate monitoring 