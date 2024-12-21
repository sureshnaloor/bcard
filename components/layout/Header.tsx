'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { 
  FaTachometerAlt, 
  FaBars,
  FaTimes,
  FaUserCircle
} from 'react-icons/fa'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import AuthButtons from '@/components/AuthButtons'

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-xs p-1">
      {initials}
    </div>
  )
}

export default function Header() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until we know the session status
  if (!mounted || status === 'loading') {
    return (
      <header className="bg-zinc-100 dark:bg-gray-800 shadow-sm h-16">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
          {/* Empty placeholder to maintain layout */}
        </nav>
      </header>
    )
  }

  return (
    <header className="bg-zinc-100 dark:bg-gray-800 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
          <Image
            src="/images/smartwave-logo.svg"
            alt="SmartWave Logo"
            width={150}
            height={150}
            className="w-46 h-32"
          />
          {/* <h1 className="text-xl font-bold">
            <span className="text-red-500">Smart</span>
            <span className="text-cyan-500">Wave</span>
            <span className="text-zinc-800 dark:text-white font-semibold"> Cards</span>
          </h1> */}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {session && (
            <Link 
              href="/admin/dashboard" 
              className="flex items-center gap-2 px-4 py-2 font-bold tracking-wider bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-600 text-cyan-600 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-white"
            >
              <FaTachometerAlt className="w-4 h-4" />
              Dashboard
            </Link>
          )}
          <Link 
            href="/about" 
            className="font-medium tracking-wide text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 transition-all duration-200 ease-in-out relative group"
          >
            About Us
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-200 ease-in-out"></span>
          </Link>
          <Link 
            href="/pricing" 
            className="font-medium tracking-wide text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 transition-all duration-200 ease-in-out relative group"
          >
            Pricing
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-200 ease-in-out"></span>
          </Link>
          <Link 
            href="/contact" 
            className="font-medium tracking-wide text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 transition-all duration-200 ease-in-out relative group"
          >
            Contact Us
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-200 ease-in-out"></span>
          </Link>
          
          {/* User Info */}
          <div className="flex items-center gap-3">
            {session ? (
              <UserAvatar name={session.user?.name || 'User'} />
            ) : (
              <FaUserCircle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            )}
            <AuthButtons />
          </div>
          
          <ThemeSwitcher />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          {session ? (
            <UserAvatar name={session.user?.name || 'User'} />
          ) : (
            <FaUserCircle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          )}
          <ThemeSwitcher />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2"
          >
            {isMenuOpen ? 
              <FaTimes className="w-6 h-6" /> : 
              <FaBars className="w-6 h-6" />
            }
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg md:hidden py-2">
            {session && (
              <Link
                href="/admin/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                <FaTachometerAlt className="w-4 h-4" />
                Dashboard
              </Link>
            )}
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              About Us
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              Contact Us
            </Link>
            <div className="px-4 py-2">
              <AuthButtons />
            </div>
          </div>
        )}
      </nav>
    </header>
  )
} 