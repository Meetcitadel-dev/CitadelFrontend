import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookingConfirmationModalProps {
  onClose: () => void;
}

export default function BookingConfirmationModal({ onClose }: BookingConfirmationModalProps) {
  const navigate = useNavigate();

  const handleGoToSettings = () => {
    onClose();
    navigate('/settings');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-black border border-white/10 rounded-3xl shadow-2xl p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-green-400/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Dinner Booked!
          </h2>
          <p className="text-white/70">
            (See ticket)
          </p>
        </div>

        {/* Information */}
        <div className="bg-white/5 rounded-2xl p-6 mb-6 text-left">
          <h3 className="text-white font-semibold mb-4">What's Next?</h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold">1.</span>
              <span>Restaurant details will be shared <strong>24 hours before</strong> the event.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold">2.</span>
              <span>You'll receive a <strong>reminder notification</strong> before the dinner.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold">3.</span>
              <span>A <strong>group chat</strong> will be created 1 hour after dinner time with all attendees.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold">4.</span>
              <span>Dinner cost is <strong>not included</strong> in the booking fee.</span>
            </li>
          </ul>
        </div>

        {/* Note */}
        <div className="bg-green-400/10 border border-green-400/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-white/90">
            <strong>Note:</strong> Booking fee covers only seat reservation, not dinner cost.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleGoToSettings}
            className="w-full py-4 rounded-full bg-green-400 text-black font-semibold hover:bg-green-500 transition-all"
          >
            View My Bookings
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

