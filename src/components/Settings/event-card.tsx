import { MapPin, ChevronRight } from "lucide-react"
// import StarRating from "./star-rating"
import { useState } from "react"
import StarRating from "./star-rating"
import GuidelinesModal from "./guidelines-modal"
// import GuidelinesModal from "./guidelines-modal"

interface EventCardProps {
  eventName: string
  guestCount: number
  date: string
  time: string
  location: string
  rating: number
  status: "booked" | "completed"
  eventImage: string
}

export default function EventCard({
  eventName,
  guestCount,
  date,
  time,
  location,
  rating,
  status,
  eventImage,
}: EventCardProps) {
  const [showGuidelines, setShowGuidelines] = useState(false)

  return (
    <div className="bg-gray-800 rounded-2xl p-4 m-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-white text-lg font-medium mb-1">{eventName}</h3>
          <p className="text-gray-400 text-sm">{guestCount} guests</p>
        </div>
        <div className="w-12 h-12 rounded-lg overflow-hidden ml-4 flex-shrink-0">
          <img src={eventImage || "/placeholder.svg"} alt={eventName} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-gray-400 text-sm mb-1">Date & Time</p>
          <p className="text-white text-sm font-medium">
            {date} | {time}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-gray-400 text-sm mb-1">Location</p>
            <p className="text-white text-sm font-medium">{location}</p>
          </div>
          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-2">Tell us</p>
          <p className="text-white text-sm font-medium mb-2">Your experience</p>
          <StarRating rating={rating} />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-md">
            {status === "booked" ? "Booked" : "Completed"}
          </span>
          <button onClick={() => setShowGuidelines(true)} className="flex items-center gap-1 text-white text-sm">
            Guidelines
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <GuidelinesModal isOpen={showGuidelines} onClose={() => setShowGuidelines(false)} />
    </div>
  )
}
