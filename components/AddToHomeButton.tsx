'use client'

import { useState } from 'react'
import { FaMobile } from 'react-icons/fa'

export default function AddToHomeButton({ name }: { name: string }) {
  const [showInstructions, setShowInstructions] = useState(false)

  const isIOS = () => {
    if (typeof window === 'undefined') return false
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
  }

  const handleClick = () => {
    setShowInstructions(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-4 right-4 flex items-center gap-1.5 px-3 py-2 
          text-xs font-medium text-white
          bg-gradient-to-r from-teal-400 to-cyan-400 
          hover:from-teal-500 hover:to-cyan-500
          rounded-lg shadow-lg transition-all duration-200 
          backdrop-blur-sm bg-opacity-90
          z-20"
      >
        <FaMobile className="w-3.5 h-3.5" />
        <span>Save to Mobile</span>
      </button>

      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm w-full relative">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add {name}'s Card to Home Screen
            </h3>
            {isIOS() ? (
              <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>1. Tap the share button <span className="inline-block">⎙</span></li>
                <li>2. Scroll down and tap "Add to Home Screen"</li>
                <li>3. Tap "Add" in the top right</li>
              </ol>
            ) : (
              <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>1. Open menu (three dots)</li>
                <li>2. Tap "Add to Home screen"</li>
                <li>3. Tap "Add" to confirm</li>
              </ol>
            )}
            <button
              onClick={() => setShowInstructions(false)}
              className="mt-4 w-full px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
} 