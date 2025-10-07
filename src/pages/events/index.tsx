
import { useState } from "react"
import IndiaGate from "@/assets/unsplash_va77t8vGbJ8.png"
import Navbar from "@/components/Common/navbar";
import { Search, Calendar, MessageCircle, Bell, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { CitySelection } from "@/components/Events/city-selection"
import { AreaSelection } from "@/components/Events/area-selection"
import { PreferencesDisplay } from "@/components/Events/preferences-display"
import { EditPreferences } from "@/components/Events/edit-preferences"
import { AdditionalPreferences } from "@/components/Events/additional-preferences"
import { BookingConfirmation } from "@/components/Events/booking-confirmation"
import { PaymentSuccess } from "@/components/Events/payment-success"
import { LocationHeader } from "@/components/Events/location-header"
import { BookingHeader } from "@/components/Events/booking-header"
import { TimeSlot } from "@/components/Events/time-slot"
import { BookButton } from "@/components/Events/book-button"
import ScaledCanvas from "@/components/Onboarding/ScaledCanvas"


interface TimeSlotData {
  id: string
  date: string
  time: string
}

function getUpcomingWednesdays(count: number = 3): TimeSlotData[] {
  const results: TimeSlotData[] = []
  const today = new Date()
  const todayDay = today.getDay() // 0=Sun, 1=Mon, ..., 3=Wed
  const targetDay = 3 // Wednesday
  let daysUntilNext = (targetDay - todayDay + 7) % 7
  if (daysUntilNext === 0) {
    daysUntilNext = 7 // if today is Wednesday, start from next Wednesday
  }

  for (let i = 0; i < count; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + daysUntilNext + i * 7)
    const formatted = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
    results.push({ id: String(i + 1), date: formatted, time: '8:00 PM' })
  }
  return results
}

const timeSlots: TimeSlotData[] = getUpcomingWednesdays(3)

type Screen =
  | "booking"
  | "city-selection"
  | "area-selection"
  | "preferences"
  | "edit-preferences"
  | "additional-preferences"
  | "booking-confirmation"
  | "payment-success"

export default function DinnerBooking() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [currentScreen, setCurrentScreen] = useState<Screen>("booking")
  const [selectedCity, setSelectedCity] = useState({ id: "delhi", name: "New Delhi" })
  const [selectedArea, setSelectedArea] = useState({ id: "chanakyapuri", name: "Chanakyapuri" })
  const [userPreferences, setUserPreferences] = useState({
    languages: ["English"],
    budget: "$",
    vegetarianOnly: false,
  })
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { icon: Search, label: "Explore", onClick: () => navigate("/explore"), active: location.pathname === "/explore" },
    { icon: Calendar, label: "Events", onClick: () => navigate("/events"), active: location.pathname === "/events" },
    { icon: MessageCircle, label: "Chats", onClick: () => navigate("/chats"), active: location.pathname === "/chats" },
    { icon: Bell, label: "Notifications", onClick: () => navigate("/notification"), active: location.pathname === "/notification" },
    { icon: User, label: "Profile", onClick: () => navigate("/profile"), active: location.pathname === "/profile" },
  ];

  // Dynamic booking details based on selected values
  const getBookingDetails = () => {
    const selectedTimeSlot = timeSlots.find(slot => slot.id === selectedSlot)
    const selectedBudget = parseInt(userPreferences.budget) || 500
    const bookingFee = Math.round(selectedBudget * 0.15) // 15% of selected budget
    
    return {
      guests: 6,
      date: selectedTimeSlot?.date || "02 July 2025",
      time: selectedTimeSlot?.time || "8:00 PM",
      location: `${selectedArea.name}, ${selectedCity.name}`,
      price: bookingFee,
    }
  }

  const bookingDetails = getBookingDetails()

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId)
  }

  const handleBookSeat = () => {
    if (selectedSlot) {
      setCurrentScreen("city-selection")
    }
  }

  const handleCitySelect = (cityId: string) => {
    // Map city ID to name
    const cityNames: { [key: string]: string } = {
      "delhi": "New Delhi",
      "bangalore": "Bangalore", 
      "mumbai": "Mumbai"
    }
    setSelectedCity({ id: cityId, name: cityNames[cityId] || cityId })
    setCurrentScreen("area-selection")
  }

  const handleAreaSelect = (areaId: string) => {
    // Map area ID to name
    const areaNames: { [key: string]: string } = {
      "dwarka": "Dwarka",
      "chanakyapuri": "Chanakyapuri",
      "gurgaon": "Gurgaon",
      "vasant-kunj": "Vasant Kunj",
      "faridabad": "Faridabad",
      "hauz-khas": "Hauz Khas"
    }
    setSelectedArea({ id: areaId, name: areaNames[areaId] || areaId })
    setCurrentScreen("preferences")
  }

  const handleCloseSelection = () => {
    setCurrentScreen("booking")
  }

  const handleCloseToMain = () => {
    setCurrentScreen("booking")
  }

  const handleBackToCity = () => {
    setCurrentScreen("city-selection")
  }

  const handleEditPreferences = () => {
    setCurrentScreen("edit-preferences")
  }

  const handleSavePreferences = (preferences: any) => {
    setUserPreferences(preferences)
    setCurrentScreen("additional-preferences")
  }

  const handleAdditionalPreferences = (additionalPrefs: any) => {
    setUserPreferences((prev: any) => ({ ...prev, ...additionalPrefs }))
    setCurrentScreen("booking-confirmation")
  }

  const handlePreferencesContinue = () => {
    setCurrentScreen("booking-confirmation")
  }

  const handleBackToArea = () => {
    setCurrentScreen("area-selection")
  }

  const handleBackToPreferences = () => {
    setCurrentScreen("preferences")
  }

  const handleBackToEditPreferences = () => {
    setCurrentScreen("edit-preferences")
  }


  const handlePayment = () => {
    // Payment will be handled by the BookingConfirmation component
    console.log("Payment initiated...")
  }

  const handlePaymentSuccess = () => {
    setCurrentScreen("payment-success")
  }

  const handlePaymentFailure = (error: string) => {
    alert(`Payment failed: ${error}`)
  }

  const handlePaymentCancel = () => {
    console.log("Payment cancelled by user")
  }

  // City Selection Screen
  if (currentScreen === "city-selection") {
    return <CitySelection onClose={handleCloseSelection} onCitySelect={handleCitySelect} />
  }

  // Area Selection Screen
  if (currentScreen === "area-selection") {
    return (
      <AreaSelection
        onBack={handleBackToCity}
        onClose={handleCloseSelection}
        onAreaSelect={handleAreaSelect}
        cityName={selectedCity.name}
      />
    )
  }

  // Preferences Display Screen
  if (currentScreen === "preferences") {
    return (
      <PreferencesDisplay
        onBack={handleBackToArea}
        onEditPreferences={handleEditPreferences}
        onContinue={handlePreferencesContinue}
        onClose={handleCloseToMain}
      />
    )
  }

  // Edit Preferences Screen
  if (currentScreen === "edit-preferences") {
    return <EditPreferences onBack={handleBackToPreferences} onSave={handleSavePreferences} onClose={handleCloseToMain} />
  }

  // Additional Preferences Screen
  if (currentScreen === "additional-preferences") {
    return <AdditionalPreferences onBack={handleBackToEditPreferences} onContinue={handleAdditionalPreferences} onClose={handleCloseToMain} />
  }

  // Booking Confirmation Screen
  if (currentScreen === "booking-confirmation") {
    return (
      <BookingConfirmation
        onBack={handleBackToPreferences}
        onPayment={handlePayment}
        onClose={handleCloseToMain}
        bookingDetails={bookingDetails}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
        onPaymentCancel={handlePaymentCancel}
      />
    )
  }

  // Payment Success Screen
  if (currentScreen === "payment-success") {
    return (
      <PaymentSuccess
        bookingDetails={bookingDetails}
        onClose={() => setCurrentScreen("booking")}
      />
    )
  }

  // Main Booking Screen
  return (
    <div className="relative bg-black h-screen overflow-hidden">
    <ScaledCanvas>
      <div className="w-[390px] h-[844px] flex flex-col relative">
      {/* Top Section - Image Background - fixed 330px height */}
      <div 
        className="relative overflow-hidden" 
        style={{ 
          height: '330px',
          background: `url(${IndiaGate}) lightgray -29px -40px / 115.013% 100.192% no-repeat`
        }}
      >
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Location Header Content */}
        <div className="relative z-10 h-full flex flex-col">
          <LocationHeader city="New Delhi" venue="Select Location" />
        </div>
      </div>

      {/* Bottom Section Wrapper */}
      <div 
        style={{ 
          position: 'absolute',
          top: '260px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 15
        }}
      >
        {/* Black Background Section - positioned 260px from top, 473px height */}
        <div 
          style={{
            width: '393px',
            height: '473px',
            flexShrink: 0,
            borderRadius: '15px',
            background: '#000000',
            padding: '24px 24px 0px',
            position: 'relative'
          }}
        >
          <BookingHeader waitingCount={5} />

          {/* Time Slots */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {timeSlots.map((slot) => (
              <TimeSlot
                key={slot.id}
                date={slot.date}
                time={slot.time}
                isSelected={selectedSlot === slot.id}
                onSelect={() => handleSlotSelect(slot.id)}
              />
            ))}
          </div>

          {/* Book Button - positioned 16px from navbar, centered */}
          <div 
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '24px',
              right: '24px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <BookButton isEnabled={selectedSlot !== null} onClick={handleBookSeat} />
          </div>
        </div>
      </div>

      </div>
    </ScaledCanvas>
    {/* Navbar outside scaler to keep consistent icon size */}
    <Navbar navItems={navItems} />
    </div>
  )
}
