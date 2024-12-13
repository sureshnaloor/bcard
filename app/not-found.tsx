import Link from 'next/link'
import { FaHome, FaExclamationTriangle } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8">
        <div className="flex justify-center mb-8">
          <FaExclamationTriangle className="text-6xl text-yellow-500 animate-bounce" />
        </div>
        <h1 className="text-9xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaHome className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
} 