import { useState, useEffect } from "react"
import IndiaGate from "@/assets/unsplash_va77t8vGbJ8.png"
import MumbaiGateway from "@/assets/gateway of mumbai stylized image.png"
import BangaloreMonument from "@/assets/bangalore monument.png"
import Navbar from "@/components/Common/navbar";
import { Search, Calendar, MessageCircle, Bell, User, Settings, History } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { LocationHeader } from "@/components/Events/location-header"
import { BookingHeader } from "@/components/Events/booking-header"
import { TimeSlot } from "@/components/Events/time-slot"
import { BookButton } from "@/components/Events/book-button"
import SetupModal from "@/components/Events/DinnerSetup/SetupModal"
import PaymentModal from "@/components/Events/PaymentModal"
import BookingConfirmationModal from "@/components/Events/BookingConfirmationModal"
import { getAuthToken } from "@/lib/utils"
import { apiClient } from "@/lib/apiClient"

// City background images mapping
const cityBackgrounds: Record<string, string> = {
  'New Delhi': IndiaGate,
  'Mumbai': MumbaiGateway,
  'Bangalore': BangaloreMonument,
  'Delhi': IndiaGate, // Fallback
};

interface DinnerEvent {
  id: string;
  eventDate: Date;
  eventTime: string;
  city: string;
  area: string;
  maxAttendees: number;
  currentAttendees: number;
  availableSeats: number;
  bookingFee: number;
  status: string;
  isBooked: boolean;
  isFull: boolean;
}

export default function DinnerBooking() {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<DinnerEvent | null>(null);
  const [events, setEvents] = useState<DinnerEvent[]>([]);
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState(IndiaGate);
  
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { icon: Search, label: "Explore", onClick: () => navigate("/explore"), active: location.pathname === "/explore" },
    { icon: Calendar, label: "Events", onClick: () => navigate("/events"), active: location.pathname === "/events" },
    { icon: MessageCircle, label: "Chats", onClick: () => navigate("/chats"), active: location.pathname === "/chats" },
    { icon: Bell, label: "Notifications", onClick: () => navigate("/notification"), active: location.pathname === "/notification" },
    { icon: User, label: "Profile", onClick: () => navigate("/profile"), active: location.pathname === "/profile" },
  ];

  useEffect(() => {
    checkPreferencesAndLoadEvents();
  }, []);

  const checkPreferencesAndLoadEvents = async () => {
    try {
      const token = getAuthToken();
      
      // Check if user has completed setup
      const prefsResponse = await apiClient<{
        success: boolean;
        data: { hasCompletedSetup: boolean; preferences: any };
      }>('/api/v1/dinner-preferences', {
        method: 'GET',
        token
      });

      if (prefsResponse.success) {
        if (!prefsResponse.data.hasCompletedSetup) {
          // Show setup modal for first-time users
          setShowSetupModal(true);
          setLoading(false);
          return;
        }

        setPreferences(prefsResponse.data.preferences);

        // Update background image based on city
        const userCity = prefsResponse.data.preferences.city;
        if (userCity && cityBackgrounds[userCity]) {
          setBackgroundImage(cityBackgrounds[userCity]);
        }

        // Load events based on preferences
        await loadEvents(userCity);
      }
    } catch (error) {
      console.error('Error checking preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async (city?: string) => {
    try {
      const token = getAuthToken();
      const queryCity = city || preferences?.city || 'New Delhi';
      
      const response = await apiClient<{
        success: boolean;
        data: { events: DinnerEvent[]; totalEvents: number };
      }>(`/api/v1/dinner-events/upcoming?city=${encodeURIComponent(queryCity)}`, {
        method: 'GET',
        token
      });

      if (response.success) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleSetupComplete = async () => {
    setShowSetupModal(false);
    await checkPreferencesAndLoadEvents();
  };

  const handleEventSelect = (event: DinnerEvent) => {
    if (event.isBooked) {
      alert('You have already booked this event!');
      return;
    }
    if (event.isFull) {
      alert('This event is full!');
      return;
    }
    setSelectedEvent(event);
  };

  const handleBookSeat = () => {
    if (selectedEvent) {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setShowConfirmationModal(true);
    setSelectedEvent(null);
    // Reload events to update booking status
    loadEvents();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading events...</p>
        </div>
      </div>
    );
  }

  // Main Booking Screen
  return (
    <>
      <div className="relative bg-black min-h-screen overflow-y-auto pb-24">
        <div className="w-full mx-auto flex flex-col">
          {/* Top Section - Image Background */}
          <div
            key={backgroundImage}
            className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] animate-fadeIn"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              animation: 'fadeIn 0.8s ease-in-out'
            }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/90"></div>

            {/* Top Right Buttons */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={() => navigate('/event-history')}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="My Bookings"
              >
                <History className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Location Header Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center px-4">
              <LocationHeader
                city={preferences?.city || "New Delhi"}
                venue="Select Location"
                onChangeLocation={() => setShowSetupModal(true)}
              />
            </div>
          </div>

          {/* Bottom Section Wrapper */}
          <div className="relative -mt-32 z-20 px-4 sm:px-6 md:px-8 pb-8">
            {/* Black Background Section */}
            <div className="w-full max-w-md mx-auto bg-black rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/5">
              <BookingHeader waitingCount={events.reduce((acc, e) => acc + e.currentAttendees, 0)} />

              {/* Event Slots */}
              <div className="flex flex-col gap-4 mb-8 mt-6">
                {events.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-white/70">No upcoming events available</p>
                  </div>
                ) : (
                  events.map((event) => (
                    <TimeSlot
                      key={event.id}
                      date={new Date(event.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                      time={event.eventTime}
                      isSelected={selectedEvent?.id === event.id}
                      onSelect={() => handleEventSelect(event)}
                    />
                  ))
                )}
              </div>

              {/* Book Button */}
              <div className="flex items-center justify-center mt-6">
                <BookButton 
                  isEnabled={selectedEvent !== null} 
                  onClick={handleBookSeat} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navbar */}
        <Navbar navItems={navItems} />
      </div>

      {/* Modals */}
      {showSetupModal && (
        <SetupModal
          onComplete={handleSetupComplete}
          onClose={() => setShowSetupModal(false)}
        />
      )}

      {showPaymentModal && selectedEvent && (
        <PaymentModal
          event={selectedEvent}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {showConfirmationModal && (
        <BookingConfirmationModal
          onClose={() => setShowConfirmationModal(false)}
        />
      )}
    </>
  )
}

