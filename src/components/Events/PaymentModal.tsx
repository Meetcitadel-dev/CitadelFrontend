import { useState } from 'react';
import { X, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { getAuthToken, ensureValidToken } from '@/lib/utils';
import { apiClient } from '@/lib/apiClient';

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

export default function PaymentModal({ event, onSuccess, onClose }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'phonepe' | 'cash' | null>(null);
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!paymentMethod) return;

    setProcessing(true);
    try {
      console.log('=== Starting payment process ===');
      console.log('Payment method:', paymentMethod);
      console.log('Event ID:', event.id);
      console.log('Booking fee:', event.bookingFee);

      // Ensure we have a valid token
      const token = await ensureValidToken();
      console.log('Token obtained:', token ? 'Yes' : 'No');

      if (!token) {
        alert('❌ Session expired. Please login again.');
        setProcessing(false);
        return;
      }

      // Handle Cash payment (for testing)
      if (paymentMethod === 'cash') {
        console.log('Processing cash payment for event:', event.id);
        console.log('Token:', token ? 'Present' : 'Missing');

        try {
          // Create booking directly without payment gateway
          const bookingData = {
            eventId: event.id,
            paymentId: `CASH_${Date.now()}`,
            paymentAmount: event.bookingFee,
            paymentMethod: 'cash',
            paymentGateway: 'cash',
            paymentStatus: 'pending' // Mark as pending for cash payments
          };

          console.log('Booking data:', bookingData);

          const response = await apiClient<{ success: boolean; message?: string; data?: any }>(
            '/api/v1/dinner-events/bookings',
            {
              method: 'POST',
              token,
              body: bookingData
            }
          );

          console.log('Cash booking response:', response);

          if (response && response.success) {
            alert('✅ Booking confirmed! Payment will be collected at the venue.');
            onSuccess();
            return;
          } else {
            const errorMsg = response?.message || 'Failed to create booking';
            console.error('Booking failed:', errorMsg);
            throw new Error(errorMsg);
          }
        } catch (bookingError: any) {
          console.error('Cash booking error details:', {
            message: bookingError?.message,
            status: bookingError?.status,
            error: bookingError
          });

          // Show more specific error message
          let errorMessage = 'Failed to create cash booking';
          if (bookingError?.message) {
            errorMessage = bookingError.message;
          } else if (bookingError?.status === 401 || bookingError?.status === 403) {
            errorMessage = 'Authentication failed. Please login again.';
          } else if (bookingError?.status === 404) {
            errorMessage = 'Event not found.';
          } else if (bookingError?.status === 400) {
            errorMessage = 'Invalid booking data or event is full.';
          }

          throw new Error(errorMessage);
        }
      }

      // Create Razorpay order for online payments
      const orderResponse = await apiClient<{
        success: boolean;
        data: { orderId: string; amount: number; currency: string };
      }>('/api/v1/payments/create-order', {
        method: 'POST',
        token,
        body: {
          amount: event.bookingFee,
          currency: 'INR',
          notes: {
            eventId: event.id,
            type: 'dinner_booking'
          }
        }
      });

      if (!orderResponse.success) {
        throw new Error('Failed to create payment order');
      }

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'Citadel Dinners',
        description: `Dinner Booking - ${event.city}`,
        order_id: orderResponse.data.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await apiClient<{ success: boolean }>('/api/v1/payments/verify', {
              method: 'POST',
              token,
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }
            });

            if (verifyResponse.success) {
              // Create booking
              await apiClient('/api/v1/dinner-events/bookings', {
                method: 'POST',
                token,
                body: {
                  eventId: event.id,
                  paymentId: response.razorpay_payment_id,
                  paymentAmount: event.bookingFee,
                  paymentMethod: paymentMethod,
                  paymentGateway: 'razorpay'
                }
              });

              onSuccess();
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Error processing payment:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#1BEA7B'
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      const errorMessage = error?.message || 'Failed to initiate payment. Please try again.';
      alert(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md mx-auto bg-black border border-white/10 rounded-3xl shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="sticky top-0 right-0 float-right p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Let's book your <span className="text-green-400">DINNER!</span>
          </h2>
          <p className="text-white/70 text-sm">
            To be reminded
          </p>
        </div>

        {/* Event Details */}
        <div className="bg-white/5 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-white font-medium">
                {new Date(event.eventDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-white/70 text-sm">{event.eventTime}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">{event.city}</p>
              <p className="text-white/70 text-sm">{event.area}</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between items-center">
            <span className="text-white/70">Booking Fee</span>
            <span className="text-2xl font-bold text-green-400">₹{event.bookingFee}</span>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-green-400/10 border border-green-400/20 rounded-xl p-4 mb-6">
          <ul className="space-y-2 text-sm text-white/90">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Your seat is <strong>4 people</strong> bookings.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <span>You'll be notified <strong>24 hours</strong> before the dinner.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Dinner experience with <strong>6 new people</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <span>Restaurant details will be shared <strong>24 hours</strong> before event.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              <span><strong>Note:</strong> Booking fee covers only seat reservation, not dinner cost.</span>
            </li>
          </ul>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-3">Select Payment Method</label>
          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('razorpay')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                paymentMethod === 'razorpay'
                  ? 'bg-green-400 text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Card / UPI / Net Banking</span>
            </button>
            <button
              onClick={() => setPaymentMethod('phonepe')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                paymentMethod === 'phonepe'
                  ? 'bg-green-400 text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span className="font-medium">PhonePe</span>
            </button>
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                paymentMethod === 'cash'
                  ? 'bg-green-400 text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span className="font-medium">Cash (Pay at Venue)</span>
            </button>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={!paymentMethod || processing}
          className={`w-full py-4 rounded-full font-semibold transition-all duration-200 ${
            paymentMethod && !processing
              ? 'bg-green-400 text-black hover:bg-green-500'
              : 'bg-white/10 text-white/50 cursor-not-allowed'
          }`}
        >
          {processing
            ? 'Processing...'
            : paymentMethod === 'cash'
              ? `Confirm Booking (₹${event.bookingFee} at venue)`
              : `Pay ₹${event.bookingFee}`
          }
        </button>
      </div>
    </div>
  );
}

