import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  CreditCard, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  ChevronRight,
  Search,
  MessageCircle,
  Bell,
  User,
  ArrowLeft
} from 'lucide-react';
import Navbar from '@/components/Common/navbar';
import { apiClient } from '@/lib/apiClient';
import { ensureValidToken } from '@/lib/utils';

interface Booking {
  bookingId: string;
  eventId: string;
  eventDate: string;
  eventTime: string;
  city: string;
  area: string;
  venue?: string;
  venueAddress?: string;
  venueDetails?: string;
  bookingStatus: 'confirmed' | 'cancelled' | 'completed';
  bookingDate: string;
  paymentAmount: number;
  paymentMethod: string;
  paymentGateway: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentId: string;
  maxAttendees: number;
  currentAttendees: number;
  bookingFee: number;
  isPast: boolean;
  groupChatId?: string;
  groupChatCreated: boolean;
}

export default function EventHistoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const navItems = [
    { icon: Search, label: 'Explore', onClick: () => navigate('/explore'), active: location.pathname === '/explore' },
    { icon: Calendar, label: 'Events', onClick: () => navigate('/events'), active: location.pathname === '/events' },
    { icon: MessageCircle, label: 'Chats', onClick: () => navigate('/chats'), active: location.pathname === '/chats' },
    { icon: Bell, label: 'Notifications', onClick: () => navigate('/notification'), active: location.pathname === '/notification' },
    { icon: User, label: 'Profile', onClick: () => navigate('/profile'), active: location.pathname === '/profile' },
  ];

  useEffect(() => {
    loadBookings();
  }, [activeTab]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const token = await ensureValidToken();
      if (!token) {
        navigate('/onboarding');
        return;
      }

      const response = await apiClient<{ success: boolean; data: { bookings: Booking[] } }>(
        `/api/v1/dinner-events/bookings/my?type=${activeTab}`,
        {
          method: 'GET',
          token
        }
      );

      if (response && response.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'failed': return 'text-red-500';
      case 'refunded': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'refunded': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate('/events')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">My Bookings</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-3 text-center font-medium transition-colors relative ${
              activeTab === 'upcoming' ? 'text-green-500' : 'text-white/60'
            }`}
          >
            Upcoming
            {activeTab === 'upcoming' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-3 text-center font-medium transition-colors relative ${
              activeTab === 'past' ? 'text-green-500' : 'text-white/60'
            }`}
          >
            Past
            {activeTab === 'past' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <p className="text-white/60 text-lg">
              {activeTab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
            </p>
            <p className="text-white/40 text-sm mt-2">
              {activeTab === 'upcoming' ? 'Book your first event to get started!' : 'Your completed events will appear here'}
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={() => navigate('/events')}
                className="mt-6 px-6 py-3 bg-green-500 text-black font-semibold rounded-full hover:bg-green-400 transition-colors"
              >
                Browse Events
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.bookingId}
                onClick={() => setSelectedBooking(booking)}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all cursor-pointer"
              >
                {/* Event Date & Time */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-green-500 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="font-semibold">{formatDate(booking.eventDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{booking.eventTime}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40" />
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-white/60 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white font-medium">{booking.city} - {booking.area}</p>
                    {booking.venue && (
                      <p className="text-white/60 text-sm">{booking.venue}</p>
                    )}
                  </div>
                </div>

                {/* Attendees */}
                <div className="flex items-center gap-2 mb-3 text-white/60 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{booking.currentAttendees} / {booking.maxAttendees} attendees</span>
                </div>

                {/* Payment Info */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-white/60" />
                    <span className="text-white/80 text-sm">₹{booking.paymentAmount}</span>
                    <span className="text-white/40 text-xs">• {booking.paymentGateway}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${getPaymentStatusColor(booking.paymentStatus)}`}>
                    {getPaymentStatusIcon(booking.paymentStatus)}
                    <span className="capitalize">{booking.paymentStatus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="relative w-full max-w-md bg-black border border-white/10 rounded-3xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6">Booking Details</h2>

            {/* Booking ID */}
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <p className="text-white/60 text-sm mb-1">Booking ID</p>
              <p className="text-green-500 font-mono text-sm">{selectedBooking.bookingId}</p>
            </div>

            {/* Event Details */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-white/80">Event Details</h3>
              
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-white/60 text-sm">Date</p>
                  <p className="text-white">{formatDate(selectedBooking.eventDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-white/60 text-sm">Time</p>
                  <p className="text-white">{selectedBooking.eventTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-white/60 text-sm">Location</p>
                  <p className="text-white">{selectedBooking.city} - {selectedBooking.area}</p>
                  {selectedBooking.venue && (
                    <p className="text-white/80 mt-1">{selectedBooking.venue}</p>
                  )}
                  {selectedBooking.venueAddress && (
                    <p className="text-white/60 text-sm mt-1">{selectedBooking.venueAddress}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-white/60 text-sm">Attendees</p>
                  <p className="text-white">{selectedBooking.currentAttendees} / {selectedBooking.maxAttendees} people</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white/80">Payment Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Amount</p>
                  <p className="text-white font-semibold">₹{selectedBooking.paymentAmount}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Status</p>
                  <div className={`flex items-center gap-1 ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                    {getPaymentStatusIcon(selectedBooking.paymentStatus)}
                    <span className="capitalize font-semibold">{selectedBooking.paymentStatus}</span>
                  </div>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Method</p>
                  <p className="text-white capitalize">{selectedBooking.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Gateway</p>
                  <p className="text-white uppercase">{selectedBooking.paymentGateway}</p>
                </div>
              </div>

              <div>
                <p className="text-white/60 text-sm mb-1">Payment ID</p>
                <p className="text-white/80 font-mono text-xs break-all">{selectedBooking.paymentId}</p>
              </div>

              <div>
                <p className="text-white/60 text-sm mb-1">Booked On</p>
                <p className="text-white">{formatDate(selectedBooking.bookingDate)}</p>
              </div>
            </div>

            {/* Important Note */}
            {selectedBooking.paymentStatus === 'pending' && (
              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <p className="text-yellow-500 font-semibold mb-1">⚠️ Payment Pending</p>
                <p className="text-white/80 text-sm">
                  Please bring ₹{selectedBooking.paymentAmount} in cash to the venue.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navbar */}
      <Navbar navItems={navItems} />
    </div>
  );
}

