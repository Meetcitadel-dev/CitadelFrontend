# Login Backend Requirements

## Overview
This document outlines the backend requirements for implementing user login functionality in the Citadel application. The login flow allows existing users to authenticate using their university email and OTP verification.

## API Endpoints

### 1. Check User Exists
**Endpoint:** `POST /api/v1/auth/check-user`

**Purpose:** Verify if a user with the given email exists in the database before proceeding with login.

**Request Body:**
```json
{
  "email": "user@university.edu"
}
```

**Response:**
```json
{
  "success": true,
  "exists": true,
  "message": "User found"
}
```

**Error Response:**
```json
{
  "success": false,
  "exists": false,
  "message": "No account found with this email"
}
```

**Requirements:**
- Validate email format (must be .edu or .org domain)
- Check if user exists in the database
- Return appropriate success/error messages
- Rate limiting to prevent abuse

### 2. Send OTP for Login
**Endpoint:** `POST /api/v1/auth/send-otp`

**Purpose:** Send OTP to user's email for authentication (reuses existing endpoint).

**Request Body:**
```json
{
  "email": "user@university.edu"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

**Requirements:**
- Validate email format
- Generate 4-digit OTP
- Send OTP via email
- Store OTP with expiration (5 minutes)
- Rate limiting (max 3 attempts per email per 10 minutes)

### 3. Verify OTP for Login
**Endpoint:** `POST /api/v1/auth/verify-otp`

**Purpose:** Verify OTP and authenticate user (reuses existing endpoint).

**Request Body:**
```json
{
  "email": "user@university.edu",
  "otp": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "user": {
    "id": 123,
    "email": "user@university.edu",
    "isProfileComplete": true
  }
}
```

**Requirements:**
- Validate OTP format (4 digits)
- Check OTP expiration
- Verify OTP matches stored value
- Generate JWT access and refresh tokens
- Return user information
- Clear used OTP from database

## Database Requirements

### User Table
Ensure the existing user table supports:
- Email verification status
- Profile completion status
- Account status (active/inactive)

### OTP Table
Create or extend existing OTP table:
```sql
CREATE TABLE otp_codes (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp_code VARCHAR(4) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Requirements

### 1. Rate Limiting
- **Check User:** Max 10 requests per IP per minute
- **Send OTP:** Max 3 requests per email per 10 minutes
- **Verify OTP:** Max 5 attempts per email per 15 minutes

### 2. Input Validation
- Email format validation (.edu or .org domains only)
- OTP format validation (4 digits)
- SQL injection prevention
- XSS prevention

### 3. Token Security
- JWT tokens with appropriate expiration
- Secure token storage
- Token refresh mechanism
- Token revocation on logout

### 4. Error Handling
- Generic error messages for security
- Proper HTTP status codes
- Logging for security monitoring

## Business Logic

### 1. User Flow
1. User enters university email
2. System checks if user exists
3. If user exists, send OTP
4. User enters OTP
5. System verifies OTP
6. If valid, generate tokens and redirect to explore page

### 2. Error Scenarios
- **Email not found:** Prompt user to sign up instead
- **Invalid OTP:** Allow retry with rate limiting
- **Expired OTP:** Prompt to request new OTP
- **Account inactive:** Prevent login with appropriate message

### 3. Success Flow
- Generate JWT tokens
- Return user profile information
- Redirect to explore page with all previous data intact

## Integration Requirements

### 1. Frontend Integration
- Handle login flow state management
- Store authentication tokens
- Redirect to appropriate pages
- Handle error states and user feedback

### 2. Email Service
- Reliable email delivery
- Email template for OTP
- Fallback mechanisms for email failures

### 3. Monitoring
- Track login success/failure rates
- Monitor OTP delivery rates
- Alert on unusual activity patterns

## Testing Requirements

### 1. Unit Tests
- Email validation
- OTP generation and verification
- Token generation and validation
- Rate limiting logic

### 2. Integration Tests
- Complete login flow
- Error handling scenarios
- Rate limiting enforcement
- Database operations

### 3. Security Tests
- SQL injection attempts
- Rate limiting bypass attempts
- Token manipulation attempts
- Email enumeration prevention

## Performance Requirements

### 1. Response Times
- Check user: < 200ms
- Send OTP: < 500ms
- Verify OTP: < 300ms

### 2. Scalability
- Support concurrent login attempts
- Efficient database queries
- Caching for frequently accessed data

### 3. Reliability
- 99.9% uptime
- Graceful error handling
- Automatic retry mechanisms

## Deployment Considerations

### 1. Environment Variables
- Database connection strings
- JWT secret keys
- Email service credentials
- Rate limiting configuration

### 2. Monitoring
- Application performance monitoring
- Error tracking and alerting
- User activity analytics
- Security event logging

### 3. Backup and Recovery
- Database backup strategies
- Token revocation procedures
- Disaster recovery plans

## Future Enhancements

### 1. Additional Authentication Methods
- Social login integration
- Two-factor authentication
- Biometric authentication

### 2. Enhanced Security
- Device fingerprinting
- Location-based authentication
- Behavioral analysis

### 3. User Experience
- Remember me functionality
- Auto-login for trusted devices
- Seamless session management 