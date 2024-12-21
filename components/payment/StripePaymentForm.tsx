'use client';

import { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/config/stripe';
import { toast } from 'react-hot-toast';

interface CheckoutFormProps {
  amount: number;
  onSuccess?: () => void;
}

function CheckoutForm({ amount, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
      } else {
        toast.success('Payment successful!');
        onSuccess?.();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <PaymentElement />
      </div>
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
}

export default function StripePaymentForm({ amount }: { amount: number }) {
  const [clientSecret, setClientSecret] = useState<string>();

  useEffect(() => {
    // Create PaymentIntent as soon as the component loads
    fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error('Failed to initialize payment');
          return;
        }
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error('Failed to initialize payment');
      });
  }, [amount]);

  if (!clientSecret) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#2563eb',
          },
        },
      }}
    >
      <CheckoutForm amount={amount} />
    </Elements>
  );
} 