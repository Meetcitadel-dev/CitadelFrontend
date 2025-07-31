import { apiClient } from './apiClient';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes: {
    booking_id: string;
    event_type: string;
  };
  theme: {
    color: string;
  };
  handler: (response: any) => void;
  modal: {
    ondismiss: () => void;
  };
}

export interface CreateOrderRequest {
  amount: number;
  currency: string;
  receipt: string;
  notes: {
    booking_id: string;
    event_type: string;
    user_id: string;
  };
}

export interface CreateOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentVerificationRequest {
  order_id: string;
  payment_id: string;
  signature: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  booking_id?: string;
}

// Payment service class
export class PaymentService {
  private static instance: PaymentService;
  private razorpayLoaded = false;

  private constructor() {}

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Load Razorpay script
  private loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.razorpayLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.razorpayLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Razorpay script'));
      };
      document.head.appendChild(script);
    });
  }

  // Create order on backend
  async createOrder(bookingData: {
    amount: number;
    booking_id: string;
    user_id: string;
    event_type: string;
  }): Promise<CreateOrderResponse> {
    const orderData: CreateOrderRequest = {
      amount: bookingData.amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `booking_${bookingData.booking_id}`,
      notes: {
        booking_id: bookingData.booking_id,
        event_type: bookingData.event_type,
        user_id: bookingData.user_id,
      },
    };

    return apiClient<CreateOrderResponse>('/api/payments/create-order', {
      method: 'POST',
      body: orderData,
    });
  }

  // Verify payment on backend
  async verifyPayment(paymentData: {
    order_id: string;
    payment_id: string;
    signature: string;
  }): Promise<PaymentVerificationResponse> {
    const verificationData: PaymentVerificationRequest = {
      order_id: paymentData.order_id,
      payment_id: paymentData.payment_id,
      signature: paymentData.signature,
    };

    return apiClient<PaymentVerificationResponse>('/api/payments/verify', {
      method: 'POST',
      body: verificationData,
    });
  }

  // Initialize payment
  async initializePayment(bookingData: {
    amount: number;
    booking_id: string;
    user_id: string;
    event_type: string;
    user_name?: string;
    user_email?: string;
    user_phone?: string;
  }, callbacks?: {
    onSuccess?: (verification: PaymentVerificationResponse) => void;
    onFailure?: (error: string) => void;
    onCancel?: () => void;
  }): Promise<void> {
    try {
      // Load Razorpay script
      await this.loadRazorpayScript();

      // Create order on backend
      const order = await this.createOrder(bookingData);

      // Prepare payment options
      const options: PaymentOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay key ID
        amount: order.amount,
        currency: order.currency,
        name: 'Citadel',
        description: `${bookingData.event_type} Booking`,
        order_id: order.id,
        prefill: {
          name: bookingData.user_name,
          email: bookingData.user_email,
          contact: bookingData.user_phone,
        },
        notes: {
          booking_id: bookingData.booking_id,
          event_type: bookingData.event_type,
        },
        theme: {
          color: '#22c55e', // Green color matching your app
        },
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verification = await this.verifyPayment({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (verification.success) {
              // Payment successful
              console.log('Payment successful:', verification);
              callbacks?.onSuccess?.(verification);
            } else {
              // Payment verification failed
              console.error('Payment verification failed:', verification.message);
              callbacks?.onFailure?.(verification.message);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            callbacks?.onFailure?.('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
            callbacks?.onCancel?.();
          },
        },
      };

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Failed to initialize payment. Please try again.');
    }
  }
}

// Export singleton instance
export const paymentService = PaymentService.getInstance(); 