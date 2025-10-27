import { CheckCircle, MapPin, Calendar, Clock, DollarSign } from 'lucide-react';

interface CashPaymentConfirmationProps {
  event: {
    id: string;
    eventDate: Date;
    eventTime: string;
    city: string;
    area: string;
    bookingFee: number;
  };
  onClose: () => void;
}

export default function CashPaymentConfirmation({ event, onClose }: CashPaymentConfirmationProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm bg-black border border-green-400/40 rounded-2xl p-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-400" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-2">Booking Confirmed!</h2>
        <p className="text-white/60 text-center mb-8">Your dinner booking is confirmed. Payment to be made in cash at the venue.</p>

        {/* Booking Details */}
        <div className="space-y-4 mb-8 bg-white/5 rounded-xl p-6 border border-white/10">
          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-white/60 text-sm">Date & Time</p>
              <p className="text-white font-semibold">
                {new Date(event.eventDate).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })} at {event.eventTime}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-white/60 text-sm">Location</p>
              <p className="text-white font-semibold">{event.area}, {event.city}</p>
            </div>
          </div>

          {/* Amount */}
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-white/60 text-sm">Booking Fee</p>
              <p className="text-white font-semibold">Rs {event.bookingFee}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex items-start gap-3 pt-4 border-t border-white/10">
            <Clock className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-white/60 text-sm">Payment Method</p>
              <p className="text-blue-400 font-semibold">💵 Cash at Venue</p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-400/10 border border-yellow-400/40 rounded-lg p-4 mb-8">
          <p className="text-yellow-400 text-sm font-semibold mb-2">Important:</p>
          <ul className="text-yellow-400/80 text-sm space-y-1">
            <li>• Restaurant details will be sent 12 hours before the event</li>
            <li>• Bring valid ID for verification</li>
            <li>• Meal cost is to be paid separately at the restaurant</li>
            <li>• Free reschedule up to 48 hours before</li>
          </ul>
        </div>

        {/* Confirmation Code */}
        <div className="bg-green-400/10 border border-green-400/40 rounded-lg p-4 mb-8">
          <p className="text-green-400/60 text-xs mb-1">Booking Reference</p>
          <p className="text-green-400 font-mono font-bold text-lg">CITADEL-{Date.now().toString().slice(-8)}</p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-green-400 text-black font-semibold rounded-full hover:bg-green-500 transition-colors shadow-lg shadow-green-400/30"
        >
          Done
        </button>
      </div>
    </div>
  );
}

