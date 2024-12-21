export function StripePayment() {
  return (
    <div className="p-6 bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">
        Payment Gateway - Stripe
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Serving users from US, Canada, Europe and other supported regions
      </p>
    </div>
  );
}

export function RazorpayPayment() {
  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
        Payment Gateway - Razorpay
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Serving users from India
      </p>
    </div>
  );
}

export function PayTabsPayment() {
  return (
    <div className="p-6 bg-gradient-to-r from-teal-100 to-teal-50 dark:from-teal-900/20 dark:to-teal-800/20 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-4">
        Payment Gateway - PayTabs
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Serving users from GCC countries (Saudi Arabia, UAE, etc.)
      </p>
    </div>
  );
} 