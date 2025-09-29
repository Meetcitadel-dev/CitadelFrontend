
import { useState } from "react"
import SettingsHeader from "./settings-header"
import EventTabs from "./event-tabs"
import EventCard from "./event-card"

interface EventBookingsScreenProps {
  onBack?: () => void
}

export default function EventBookingsScreen({ onBack }: EventBookingsScreenProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")
  const events: Array<{
    eventName: string
    guestCount: number
    date: string
    time: string
    location: string
    rating: number
    status: "booked" | "completed" | "cancelled"
    eventImage?: string
  }> = []

  return (
    <div className="w-full min-h-screen bg-black">
      <SettingsHeader title="Event Bookings" onBack={onBack} />
      <div className="pt-6">
        <EventTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="pb-8">
          {events.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-400">
              {activeTab === "upcoming" ? "No upcoming bookings." : "No past bookings."}
            </div>
          ) : (
            events.map((evt, idx) => (
              <EventCard key={idx} {...evt} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
