'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa'

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md ${
          theme === 'light' 
            ? 'bg-blue-100 text-blue-800' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        aria-label="Light Mode"
      >
        <FaSun className="w-5 h-5" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md ${
          theme === 'dark' 
            ? 'bg-blue-100 text-blue-800' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        aria-label="Dark Mode"
      >
        <FaMoon className="w-5 h-5" />
      </button>

      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md ${
          theme === 'system' 
            ? 'bg-blue-100 text-blue-800' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        aria-label="System Theme"
      >
        <FaDesktop className="w-5 h-5" />
      </button>
    </div>
  )
} 