'use client';

import { usePaymentGateway } from '@/hooks/usePaymentGateway';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  StripePayment, 
  RazorpayPayment, 
  PayTabsPayment 
} from '@/components/payment/PaymentGateways';
import { countryGatewayMappings } from '@/config/payment-gateways';
import { useState, useEffect } from 'react';

export default function TestLocation() {
  const { gateway, loading, country } = usePaymentGateway();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    // Collect browser information
    const browserInfo = {
      language: navigator.language,
      languages: navigator.languages,
      userAgent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    setDebugInfo(browserInfo);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const countryInfo = countryGatewayMappings.find(m => m.country === country);

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      {/* Location Info */}
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Location Test Page
        </h1>
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Detected Country:</span> {country}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Selected Gateway:</span> {gateway}
          </p>
          {countryInfo && (
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Currency:</span> {countryInfo.currency}
            </p>
          )}
        </div>
      </div>

      {/* Payment Gateway Display */}
      <div className="mt-8">
        {gateway === 'stripe' && <StripePayment />}
        {gateway === 'razorpay' && <RazorpayPayment />}
        {gateway === 'paytabs' && <PayTabsPayment />}
      </div>

      {/* Enhanced Debug Info */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
          Debug Information
        </h3>
        <div className="space-y-2">
          <p className="text-xs text-gray-600 dark:text-gray-300">
            <strong>Browser Language:</strong> {debugInfo.language}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            <strong>All Languages:</strong> {debugInfo.languages?.join(', ')}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            <strong>Timezone:</strong> {debugInfo.timezone}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            <strong>User Agent:</strong> {debugInfo.userAgent}
          </p>
        </div>
        <pre className="mt-4 text-xs text-gray-600 dark:text-gray-300 overflow-auto">
          {JSON.stringify({ gateway, country, countryInfo }, null, 2)}
        </pre>
      </div>
    </div>
  );
} 