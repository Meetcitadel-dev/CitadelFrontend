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
      <div className="flex-1 px-6 pt-16">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-white text-4xl font-bold leading-tight">
            Let's book your
            <br />
            <span className="text-green-400 italic">DINNER!</span>
          </h1>
        </div>

        {/* Booking Details Card */}
        <div className="bg-gray-800/50 rounded-3xl p-6 mb-8">
          {/* Restaurant Info */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white text-xl font-bold mb-1">To be revealed</h3>
              <p className="text-white/70 text-lg">{bookingDetails.guests} guests</p>
            </div>
            <div className="w-16 h-16 rounded-xl overflow-hidden">
              <img
                src="/placeholder.svg"
                alt="Restaurant"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="mb-6">
            <h4 className="text-white/70 text-base mb-1">Date & Time</h4>
            <p className="text-white text-xl font-bold">
              {bookingDetails.date} | {bookingDetails.time}
            </p>
          </div>

          {/* Location */}
          <div className="mb-6">
            <h4 className="text-white/70 text-base mb-1">Location</h4>
            <div className="flex items-center justify-between">
              <p className="text-white text-xl font-bold">{bookingDetails.location}</p>
              <MapPin className="w-6 h-6 text-white/70" />
            </div>
          </div>

          {/* Price and Guidelines */}
          <div className="flex items-center justify-between">
            <div className="bg-green-400 text-black px-4 py-2 rounded-lg">
              <span className="text-lg font-bold">Rs {bookingDetails.price}</span>
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
      <div className="bg-black px-6 py-6 flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-2xl border-2 border-gray-600 text-white text-lg font-semibold hover:bg-gray-800/50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex-1 py-4 rounded-2xl bg-green-400 text-black text-lg font-semibold hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : "Pay amount"}
        </button>
      </div>
    </div>
  )
}
