# Razorpay Payment Integration

This document outlines the frontend implementation and backend requirements for the Razorpay payment gateway integration.

## Frontend Implementation

### Files Modified/Created:

1. **`src/lib/payment.ts`** - Payment service with Razorpay integration
2. **`src/components/Events/booking-confirmation.tsx`** - Updated to handle payment flow
3. **`src/components/Events/payment-success.tsx`** - New component for payment success screen
4. **`src/pages/events/index.tsx`** - Updated to handle payment callbacks

### Environment Variables Required:

Create a `.env` file in the root directory with:

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your_test_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_test_key_secret_here

# Note: In production, use live keys instead of test keys
# VITE_RAZORPAY_KEY_ID=rzp_live_your_live_key_id_here
# VITE_RAZORPAY_KEY_SECRET=your_live_key_secret_here
```

## Backend Requirements

### 1. Create Order Endpoint

**Endpoint:** `POST /api/payments/create-order`

**Request Body:**
```json
{
  "amount": 7500,
  "currency": "INR",
  "receipt": "booking_1234567890",
  "notes": {
    "booking_id": "booking_1234567890",
    "event_type": "Dinner",
    "user_id": "user_123"
  }
}
```

**Response:**
```json
{
  "id": "order_1234567890",
  "amount": 7500,
  "currency": "INR",
  "receipt": "booking_1234567890",
  "status": "created"
}
```

**Implementation:**
```javascript
// Using Razorpay Node.js SDK
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;
    
    const order = await razorpay.orders.create({
      amount: amount,
      currency: currency,
      receipt: receipt,
      notes: notes
    });
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 2. Verify Payment Endpoint

**Endpoint:** `POST /api/payments/verify`

**Request Body:**
```json
{
  "order_id": "order_1234567890",
  "payment_id": "pay_1234567890",
  "signature": "generated_signature_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "booking_id": "booking_1234567890"
}
```

**Implementation:**
```javascript
const crypto = require('crypto');

app.post('/api/payments/verify', async (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;
    
    // Verify signature
    const text = order_id + '|' + payment_id;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');
    
    if (generated_signature === signature) {
      // Payment is verified
      // Update booking status in database
      await updateBookingStatus(order_id, 'confirmed');
      
      res.json({
        success: true,
        message: 'Payment verified successfully',
        booking_id: order_id
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});
```

### 3. Database Schema Updates

**Bookings Table:**
```sql
CREATE TABLE bookings (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status ENUM('pending', 'confirmed', 'cancelled', 'failed') DEFAULT 'pending',
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  location VARCHAR(255),
  guests INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Payments Table:**
```sql
CREATE TABLE payments (
  id VARCHAR(255) PRIMARY KEY,
  booking_id VARCHAR(255) NOT NULL,
  razorpay_order_id VARCHAR(255) NOT NULL,
  razorpay_payment_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  signature VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
```

### 4. Additional Backend Functions

**Update Booking Status:**
```javascript
async function updateBookingStatus(orderId, status) {
  // Update booking status in database
  await db.query(
    'UPDATE bookings SET status = ? WHERE razorpay_order_id = ?',
    [status, orderId]
  );
}
```

**Create Booking Record:**
```javascript
async function createBooking(bookingData) {
  const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.query(
    'INSERT INTO bookings (id, user_id, event_type, amount, booking_date, booking_time, location, guests) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      bookingId,
      bookingData.user_id,
      bookingData.event_type,
      bookingData.amount,
      bookingData.date,
      bookingData.time,
      bookingData.location,
      bookingData.guests
    ]
  );
  
  return bookingId;
}
```

## Security Considerations

1. **Environment Variables:** Never commit API keys to version control
2. **Signature Verification:** Always verify payment signatures on the backend
3. **HTTPS:** Use HTTPS in production for secure communication
4. **Input Validation:** Validate all input data on the backend
5. **Error Handling:** Implement proper error handling and logging

## Testing

1. Use Razorpay test keys for development
2. Test payment flow with test cards provided by Razorpay
3. Test error scenarios (insufficient funds, network issues, etc.)
4. Test signature verification with invalid signatures

## Production Deployment

1. Replace test keys with live keys
2. Update API URLs to production endpoints
3. Implement proper logging and monitoring
4. Set up webhook endpoints for payment status updates
5. Implement retry mechanisms for failed payments 