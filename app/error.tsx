
'use client'; 

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Something went wrong</h1>
        <p className="mb-4 text-gray-700">
          We're sorry, but we couldn't complete your request. Our team has been notified.
        </p>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Try again
          </button>
          <Link href="/" className="px-4 py-2 font-semibold text-white bg-gray-600 rounded hover:bg-gray-700">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}