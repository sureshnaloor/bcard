'use client'

import { useState } from 'react'
import { FaPlus, FaMobile } from 'react-icons/fa'

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
        className="fixed bottom-4 right-4 flex items-center gap-1.5 px-3 py-2 bg-cyan-600 text-white text-sm rounded-lg shadow-lg hover:bg-cyan-700 transition-colors z-20"
      >
        <FaMobile className="w-4 h-4" />
        <FaPlus className="w-2.5 h-2.5" />
        <span>Add to Home</span>
      </button>

      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm w-full relative">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
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