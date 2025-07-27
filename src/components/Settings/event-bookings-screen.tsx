
import { useState } from "react"
import SettingsHeader from "./settings-header"
import EventTabs from "./event-tabs"
import EventCard from "./event-card"

interface EventBookingsScreenProps {
  onBack?: () => void
}

export default function EventBookingsScreen({ onBack }: EventBookingsScreenProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")

  const eventData = {
    eventName: "Shift Lounge",
    guestCount: 6,
    date: "02 July 2025",
    time: "8:00 PM",
    location: "HSR, Bangalore",
    rating: 4,
    status: "booked" as const,
    eventImage: "/placeholder.svg?height=48&width=48",
  }

  return (
    <div className="w-full min-h-screen bg-black">
      <SettingsHeader title="Event Bookings" onBack={onBack} />
      <div className="pt-6">
        <EventTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="pb-8">
          <EventCard {...eventData} />
          <EventCard {...eventData} />
        </div>
      </div>
    </div>
  )
}
