"use client"

import { MapPin } from "lucide-react"
import { useState } from "react"
import WavyPattern from "@/assets/Group 190.png";
import { paymentService } from "@/lib/payment";

interface BookingConfirmationProps {
  onBack: () => void
  onPayment: () => void
  bookingDetails: {
    guests: number
    date: string
    time: string
    location: string
    price: number
  }
  onPaymentSuccess?: () => void
  onPaymentFailure?: (error: string) => void
  onPaymentCancel?: () => void
}

export function BookingConfirmation({ 
  onBack, 
  onPayment, 
  bookingDetails, 
  onPaymentSuccess, 
  onPaymentFailure, 
  onPaymentCancel 
}: BookingConfirmationProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Generate a unique booking ID
      const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Mock user data - in real app, get from user context/state
      const userData = {
        user_id: "user_123", // Replace with actual user ID
        user_name: "John Doe", // Replace with actual user name
        user_email: "john@example.com", // Replace with actual user email
        user_phone: "9876543210", // Replace with actual user phone
      };

      await paymentService.initializePayment({
        amount: bookingDetails.price,
        booking_id: bookingId,
        user_id: userData.user_id,
        event_type: "Dinner",
        user_name: userData.user_name,
        user_email: userData.user_email,
        user_phone: userData.user_phone,
      }, {
        onSuccess: (verification) => {
          console.log('Payment successful:', verification);
          onPaymentSuccess?.();
        },
        onFailure: (error) => {
          console.error('Payment failed:', error);
          onPaymentFailure?.(error);
        },
        onCancel: () => {
          console.log('Payment cancelled');
          onPaymentCancel?.();
        }
      });

      // Call the original onPayment callback for any additional logic
      onPayment();
    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('Failed to initialize payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Content */}
      <div className="flex-1 px-6" style={{ paddingTop: '35px' }}>
        {/* Title */}
        <div className="text-center" style={{ marginBottom: '28px' }}>
          <p 
            style={{
              display: '-webkit-box',
              width: '315px',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
              color: '#FFFFFF',
              textAlign: 'center',
              textOverflow: 'ellipsis',
              fontFamily: '"Roboto Serif"',
              fontSize: '28px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: 'normal',
              margin: '0 auto'
            }}
          >
            Let's book your
            <br />
            <span 
              style={{
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                color: '#1BEA7B',
                textOverflow: 'ellipsis',
                fontFamily: '"Roboto Serif"',
                fontSize: '28px',
                fontStyle: 'italic',
                fontWeight: 700,
                lineHeight: 'normal'
              }}
            >
              DINNER!
            </span>
          </p>
        </div>

        {/* Booking Details Card */}
        <div 
          style={{
            width: '345px',
            height: '273px',
            flexShrink: 0,
            borderRadius: '15px',
            background: '#111',
            paddingTop: '16px',
            paddingLeft: '24px',
            paddingRight: '24px',
            // paddingBottom: '24px',
            marginBottom: '32px',
            margin: '0 auto'
          }}
        >
          {/* Restaurant Info */}
          <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
            <div>
              <p 
                style={{
                  color: '#FFF',
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '135%',
                  marginBottom: '2px'
                }}
              >
                To be revealed
              </p>
              <p 
                style={{
                  color: '#FFF',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '135%',
                  opacity: 0.7
                }}
              >
                {bookingDetails.guests} guests
              </p>
            </div>
            <div 
              style={{
                width: '45px',
                height: '45px',
                flexShrink: 0,
                aspectRatio: '1/1',
                borderRadius: '8px',
                background: 'url(<path-to-image>) lightgray 50% / cover no-repeat',
                overflow: 'hidden'
              }}
            >
              <img
                src="/placeholder.svg"
                alt="Restaurant"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>

          {/* Date & Time */}
          <div style={{ marginBottom: '20px' }}>
            <p 
              style={{
                color: '#FFF',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '135%',
                opacity: 0.7,
                marginBottom: '2px'
              }}
            >
              Date & Time
            </p>
            <p 
              style={{
                color: '#FFF',
                fontFamily: 'Inter',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '135%'
              }}
            >
              {bookingDetails.date} | {bookingDetails.time}
            </p>
          </div>

          {/* Location */}
          <div className="mb-6">
            <p 
              style={{
                color: '#FFF',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '135%',
                opacity: 0.7,
                marginBottom: '2px'
              }}
            >
              Location
            </p>
            <div className="flex items-center justify-between">
              <p 
                style={{
                  color: '#FFF',
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '135%'
                }}
              >
                {bookingDetails.location}
              </p>
              <MapPin className="w-6 h-6 text-white/70" />
            </div>
          </div>

          {/* Price and Guidelines */}
          <div className="flex items-center justify-between">
            <div 
              style={{
                display: 'inline-flex',
                minHeight: '28px',
                padding: '8px 14px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4px',
                borderRadius: '6px',
                border: '0.5px solid #133422',
                background: '#133422'
              }}
            >
              <span 
                style={{
                  color: '#1BEA7B',
                  textAlign: 'center',
                  fontFamily: 'Inter',
                  fontSize: '15px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '135%' // 20.25px
                }}
              >
                Rs {bookingDetails.price}
              </span>
            </div>
            <button className="text-white text-lg font-medium">
              Guidelines <span className="text-xl">›</span>
            </button>
          </div>
        </div>
      </div>

      {/* Wavy Pattern */}
      <div className="relative h-32 overflow-hidden">
        <img src={WavyPattern} alt="Wavy pattern" className="object-cover object-top w-full h-full absolute inset-0" />
      </div>

      {/* Bottom Buttons */}
      <div className="bg-black px-6 flex gap-4" style={{ paddingTop: '24px', paddingBottom: '16px' }}>
        <button
          onClick={onBack}
          className="hover:bg-gray-800/50 transition-colors"
          style={{
            display: 'flex',
            width: '173px',
            height: '50px',
            padding: '14.5px 16px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
            borderRadius: '48px',
            background: '#111111',
            border: 'none',
            color: '#FFFFFF',
            fontFamily: 'Inter',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: '135%',
            cursor: 'pointer'
          }}
        >
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            display: 'flex',
            width: '173px',
            height: '50px',
            padding: '14.5px 16px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
            borderRadius: '48px',
            background: '#1BEA7B',
            border: 'none',
            color: '#040404',
            fontFamily: 'Inter',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: '135%',
            cursor: 'pointer'
          }}
        >
          {isProcessing ? "Processing..." : "Pay amount"}
        </button>
      </div>
    </div>
  )
}
