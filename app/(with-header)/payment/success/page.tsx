'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccess() {
  const [status, setStatus] = useState<'success' | 'processing' | 'error'>('processing');
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent');
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');

    if (paymentIntent && paymentIntentClientSecret) {
      // You can verify the payment status here if needed
      setStatus('success');
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {status === 'success' && (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thank you for your payment. Your transaction has been completed successfully.
            </p>
          </>
        )}
        {status === 'processing' && (
          <p className="text-gray-600 dark:text-gray-300">Verifying payment...</p>
        )}
        {status === 'error' && (
          <p className="text-red-600">There was an error processing your payment.</p>
        )}
        <Link
          href="/test-location"
          className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Test Page
        </Link>
      </div>
    </div>
  );
} 