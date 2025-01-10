'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <FaSun className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400" />
      ) : (
        <FaMoon className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400" />
      )}
    </button>
  )
} 