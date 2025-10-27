import { useState, useEffect } from "react"
import IndiaGate from "@/assets/unsplash_va77t8vGbJ8.png"
import MumbaiGateway from "@/assets/gateway of mumbai stylized image.png"
import BangaloreMonument from "@/assets/bangalore monument.png"
import { Settings, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [setupMode, setSetupMode] = useState<'full' | 'location-only'>('full');

  const navigate = useNavigate();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

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

    // If mode is 'full' and there's a selected event, proceed to payment
    if (setupMode === 'full' && selectedEvent) {
      setShowPaymentModal(true);
    }
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
      // Always show full setup flow when booking
      setSetupMode('full');
      setShowSetupModal(true);
    }
  };

  const handleChangeLocation = () => {
    // Show only location setup (city + area)
    setSetupMode('location-only');
    setShowSetupModal(true);
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
      <div className="relative bg-black min-h-screen flex flex-col">
        {/* City Image Card with View Bookings Button */}
        <div className="relative w-full h-80">
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70"></div>

            {/* Centered Content Container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-6">
              {/* View Bookings Button */}
              <button
                onClick={() => navigate('/event-history')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/40 text-white text-sm bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                View Bookings
              </button>

              {/* City Name */}
              <h2 className="text-white text-4xl font-bold text-center" style={{ fontFamily: 'serif' }}>
                {preferences?.city || "Bangalore"}
              </h2>

              {/* Change Location */}
              <button
                onClick={handleChangeLocation}
                className="flex items-center gap-1 text-white/90 text-sm hover:text-white transition-colors"
              >
                <span className="underline">Change location</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Black Card Section */}
        <div className="flex-1 px-4 pt-6 pb-24">
          <div className="bg-black rounded-3xl p-6 border border-white/10">
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-white text-xl mb-1">
                Book your next <span className="text-[#1BEA7B] font-bold italic" style={{ fontFamily: 'serif' }}>DINNER</span>
              </h3>
              <p className="text-white/70 text-sm">
                {events.reduce((acc, e) => acc + e.currentAttendees, 0)} people are waiting for you
              </p>
            </div>

            {/* Event Slots */}
            <div className="flex flex-col gap-3 mb-6">
              {events.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-white/70">No upcoming events available</p>
                </div>
              ) : (
                events.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleEventSelect(event)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedEvent?.id === event.id
                        ? 'bg-white/10 border-2 border-white'
                        : 'bg-white/5 border border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold text-base mb-1">
                          {new Date(event.eventDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-white/70 text-sm">{event.eventTime}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedEvent?.id === event.id ? 'border-white bg-white' : 'border-white/50'
                      }`}>
                        {selectedEvent?.id === event.id && (
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Book Button */}
            <button
              onClick={handleBookSeat}
              disabled={!selectedEvent}
              className={`w-full py-4 rounded-full text-white font-semibold transition-all ${
                selectedEvent
                  ? 'bg-[#1BEA7B] hover:bg-[#17d16f]'
                  : 'bg-white/20 cursor-not-allowed'
              }`}
            >
              Book my seat
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 px-6 py-3">
          <div className="flex items-center justify-around max-w-md mx-auto">
            <button
              onClick={() => navigate('/events')}
              className="flex flex-col items-center gap-1"
            >
              <svg className="w-6 h-6 text-[#1BEA7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
              </svg>
              <span className="text-[#1BEA7B] text-xs font-medium">Events</span>
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="flex flex-col items-center gap-1"
            >
              <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="text-white/60 text-xs">Explore</span>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex flex-col items-center gap-1"
            >
              <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" strokeWidth="2"/>
              </svg>
              <span className="text-white/60 text-xs">Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showSetupModal && (
        <SetupModal
          mode={setupMode}
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

