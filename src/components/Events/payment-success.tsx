"use client"

import { CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PaymentSuccessProps {
  bookingDetails: {
    guests: number
    date: string
    time: string
    location: string
    price: number
  }
  onClose: () => void
}

export function PaymentSuccess({ bookingDetails }: PaymentSuccessProps) {
  const navigate = useNavigate();

  const handleViewBookings = () => {
    navigate("/settings"); // Navigate to settings/bookings page
  };

  const handleExploreMore = () => {
    navigate("/explore"); // Navigate to explore page
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Content */}
      <div className="flex-1 px-6 pt-16">
        {/* Success Icon and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-400" />
          </div>
          <h1 className="text-white text-4xl font-bold leading-tight mb-2">
            Payment
            <br />
            <span className="text-green-400">Successful!</span>
          </h1>
          <p className="text-white/70 text-lg">
            Your dinner booking has been confirmed
          </p>
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
                loading="lazy"
                decoding="async"
                fetchPriority="low"
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
            <p className="text-white text-xl font-bold">{bookingDetails.location}</p>
          </div>

          {/* Amount Paid */}
          <div className="flex items-center justify-between">
            <div className="bg-green-400 text-black px-4 py-2 rounded-lg">
              <span className="text-lg font-bold">Rs {bookingDetails.price}</span>
            </div>
            <span className="text-green-400 text-sm font-medium">PAID</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-900/20 rounded-2xl p-4 mb-8">
          <h4 className="text-white font-semibold mb-2">What's next?</h4>
          <ul className="text-white/70 text-sm space-y-1">
            <li>• You'll receive a confirmation email</li>
            <li>• Restaurant details will be revealed 24 hours before</li>
            <li>• Check your bookings in the Settings tab</li>
          </ul>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="bg-black px-6 py-6 flex gap-4">
        <button
          onClick={handleViewBookings}
          className="flex-1 py-4 rounded-2xl border-2 border-gray-600 text-white text-lg font-semibold hover:bg-gray-800/50 transition-colors"
        >
          View Bookings
        </button>
        <button
          onClick={handleExploreMore}
          className="flex-1 py-4 rounded-2xl bg-green-400 text-black text-lg font-semibold hover:bg-green-300 transition-colors"
        >
          Explore More
        </button>
      </div>
    </div>
  )
} 