'use client';

import { usePaymentGateway } from '@/hooks/usePaymentGateway';
import LoadingSpinner from '@/components/LoadingSpinner';
import StripePaymentForm from '@/components/payment/StripePaymentForm';
import { countryGatewayMappings } from '@/config/payment-gateways';
import { useState, useEffect } from 'react';

export default function TestLocation() {
  // Use the actual location detection
  const { gateway: detectedGateway, loading, country } = usePaymentGateway();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
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
      {/* Location and Detection Info */}
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Payment Test Page
        </h1>
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Detected Country:</span> {country}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Detected Gateway:</span> {detectedGateway}
          </p>
          {countryInfo && (
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Local Currency:</span> {countryInfo.currency}
            </p>
          )}
        </div>
      </div>

      {/* Gateway Information */}
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Available Payment Gateways
        </h2>
        <div className="space-y-4">
          <div className="p-4 border border-green-200 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="font-semibold text-green-700 dark:text-green-400">
              Currently Active: Stripe
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Testing mode: Using Stripe for all regions temporarily
            </p>
          </div>
          <div className="p-4 border border-gray-200 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
            <h3 className="font-semibold text-gray-700 dark:text-gray-400">
              Coming Soon: RazorPay
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Will be available for India (IN)
            </p>
          </div>
          <div className="p-4 border border-gray-200 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
            <h3 className="font-semibold text-gray-700 dark:text-gray-400">
              Coming Soon: PayTabs
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Will be available for GCC countries (SA, AE, BH, KW, OM, QA)
            </p>
          </div>
        </div>
      </div>

      {/* Stripe Payment Form */}
      <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          Test Payment - $10.00 USD
        </h2>
        <StripePaymentForm amount={10} />
      </div>

      {/* Debug Information */}
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
          {JSON.stringify({ 
            detectedGateway, 
            country, 
            countryInfo,
            actualGateway: 'stripe' // Always using Stripe for now
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
} 