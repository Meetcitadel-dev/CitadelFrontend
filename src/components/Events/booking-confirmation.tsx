"use client"

import { MapPin } from "lucide-react"
import WavyPattern from "@/assets/Group 190.png";

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
}

export function BookingConfirmation({ onBack, onPayment, bookingDetails }: BookingConfirmationProps) {
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
          onClick={onPayment}
          className="flex-1 py-4 rounded-2xl bg-green-400 text-black text-lg font-semibold hover:bg-green-300 transition-colors"
        >
          Pay amount
        </button>
      </div>
    </div>
  )
}
