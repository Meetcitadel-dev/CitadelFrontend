import { useState } from 'react';
import { X, MapPin, ChevronRight } from 'lucide-react';
import { ensureValidToken } from '@/lib/utils';
import { apiClient } from '@/lib/apiClient';

// Helper function to parse JWT token
function parseJwt(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

interface PaymentModalProps {
  event: {
    id: string;
    eventDate: Date;
    eventTime: string;
    city: string;
    area: string;
    bookingFee: number;
  };
  onSuccess: () => void;
  onClose: () => void;
}

interface GuidelinesModalProps {
  onClose: () => void;
}

// Guidelines Modal Component
function GuidelinesModal({ onClose }: GuidelinesModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm bg-black border border-white/20 rounded-2xl p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold text-white mb-6">Guidelines</h2>

        {/* Guidelines List */}
        <ol className="space-y-4 text-white/90 text-sm">
          <li className="flex gap-3">
            <span className="font-semibold">1.</span>
            <span>
              Find your ticket in <span className="text-blue-400">settings → event bookings</span>.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold">2.</span>
            <span>
              Restaurant name will be available <span className="text-blue-400">12 hours before</span> the dinner.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold">3.</span>
            <span>
              This price <span className="text-blue-400">includes</span> one time Citadel dinner experience with like-minded people.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold">4.</span>
            <span>
              The <span className="text-blue-400">meal cost is to be paid</span> at the restaurant.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold">5.</span>
            <span>
              Free <span className="text-blue-400">reschedule up to 48 hours</span> before the dinner.
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}

export default function PaymentModal({ event, onSuccess, onClose }: PaymentModalProps) {
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [processing, setProcessing] = useState(false);



  const handlePayment = async () => {
    setProcessing(true);
    try {
      console.log('=== Starting Direct Booking ===');

      // Validate event data
      if (!event.id || !event.eventDate || !event.eventTime || !event.city || !event.area || !event.bookingFee) {
        console.error('❌ Missing event data');
        alert('❌ Event information is incomplete. Please try again.');
        setProcessing(false);
        return;
      }

      // Ensure we have a valid token
      const token = await ensureValidToken();
      console.log('Token obtained:', token ? 'Yes' : 'No');

      if (!token) {
        alert('❌ Session expired. Please login again.');
        setProcessing(false);
        return;
      }

      // Get user ID from token
      const tokenData = parseJwt(token);
      console.log('Token Data:', tokenData);

      if (!tokenData) {
        alert('❌ Invalid token. Please login again.');
        setProcessing(false);
        return;
      }

      const userId = tokenData.id || tokenData.userId || tokenData.sub;

      if (!userId) {
        console.error('User ID not found in token:', tokenData);
        alert('❌ User information not found. Please login again.');
        setProcessing(false);
        return;
      }

      console.log('User ID:', userId);

      // Prepare booking date
      const bookingDate = new Date(event.eventDate).toISOString().split('T')[0];
      const location = `${event.area}, ${event.city}`;

      console.log('Creating direct booking...');

      // Create direct booking (no payment gateway)
      const bookingResponse = await apiClient<{
        success: boolean;
        data: { bookingId: string };
      }>('/api/v1/payments/create-cash-payment', {
        method: 'POST',
        token,
        body: {
          userId: userId,
          eventId: event.id,
          eventType: 'Dinner',
          amount: event.bookingFee,
          currency: 'INR',
          bookingDate: bookingDate,
          bookingTime: event.eventTime,
          location: location,
          guests: 1
        }
      });

      console.log('Booking Response:', bookingResponse);

      if (!bookingResponse.success) {
        throw new Error('Failed to create booking');
      }

      console.log('✅ Booking successful!');

      // Close payment modal and show confirmation
      setProcessing(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error creating booking:', error);
      console.error('Error details:', {
        message: error?.message,
        status: error?.status,
        response: error?.response,
        stack: error?.stack
      });

      let errorMessage = 'Failed to create booking. Please try again.';

      // Try to extract more detailed error message
      if (error?.message) {
        try {
          const errorObj = JSON.parse(error.message);
          errorMessage = errorObj.message || errorObj.error || errorMessage;
        } catch {
          errorMessage = error.message;
        }
      }

      alert(`❌ ${errorMessage}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      {/* Guidelines Modal */}
      {showGuidelines && <GuidelinesModal onClose={() => setShowGuidelines(false)} />}

      {/* Main Payment Modal - Full Screen */}
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 pt-12 pb-8">
          {/* Header */}
          <h1 className="text-4xl font-bold text-white leading-tight mb-1">
            Let's book your
          </h1>
          <h1 className="text-4xl font-bold text-green-400 mb-12 leading-tight">
            DINNER!
          </h1>

          {/* Card Container */}
          <div className="bg-black border border-white/10 rounded-3xl p-8 space-y-8">
            {/* To be revealed section */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/60 text-sm mb-2">To be revealed</p>
                <p className="text-white text-lg font-semibold">6 guests</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-3xl">🍽️</span>
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <p className="text-white/60 text-sm mb-2">Date & Time</p>
              <p className="text-white text-lg font-semibold">
                {new Date(event.eventDate).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })} | {event.eventTime}
              </p>
            </div>

            {/* Location */}
            <div>
              <p className="text-white/60 text-sm mb-2">Location</p>
              <div className="flex items-center justify-between">
                <p className="text-white text-lg font-semibold">{event.area}, {event.city}</p>
                <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                  <MapPin className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Price and Guidelines */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="px-4 py-2 bg-green-400/10 border border-green-400/40 rounded-lg">
                <p className="text-green-400 font-bold text-lg">Rs 299</p>
              </div>
              <button
                onClick={() => setShowGuidelines(true)}
                className="flex items-center gap-2 text-white hover:text-green-400 transition-colors"
              >
                <span className="font-semibold">Guidelines</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Wavy Green Bottom Section - Fixed */}
        <div className="relative mt-auto">
          {/* Wavy SVG Background */}
          <svg
            className="w-full"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            style={{ height: '200px' }}
          >
            {/* Wave 1 */}
            <path
              fill="#22c55e"
              fillOpacity="0.2"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,112C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
            {/* Wave 2 */}
            <path
              fill="#22c55e"
              fillOpacity="0.4"
              d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,192C960,203,1056,181,1152,165.3C1248,149,1344,149,1392,149.3L1440,149L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
            {/* Wave 3 */}
            <path
              fill="#22c55e"
              fillOpacity="0.6"
              d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,181.3C672,181,768,203,864,213.3C960,224,1056,224,1152,213.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
            {/* Wave 4 - Solid */}
            <path
              fill="#22c55e"
              d="M0,224L48,229.3C96,235,192,245,288,240C384,235,480,213,576,213.3C672,213,768,235,864,240C960,245,1056,235,1152,224C1248,213,1344,192,1392,181.3L1440,171L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>

          {/* Buttons - Positioned over waves */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-colors text-lg"
            >
              Back
            </button>

            {/* Pay Amount Button */}
            <button
              onClick={handlePayment}
              disabled={processing}
              className={`flex-1 py-4 rounded-full font-semibold text-lg transition-all ${
                processing
                  ? 'bg-green-400/50 text-black/50 cursor-not-allowed'
                  : 'bg-green-400 text-black hover:bg-green-500 shadow-lg shadow-green-400/30'
              }`}
            >
              {processing ? 'Processing...' : 'Pay amount'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

