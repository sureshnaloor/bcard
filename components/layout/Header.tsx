'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'
import { 
  FaTachometerAlt, 
  FaBars,
  FaTimes,
  FaUserCircle
} from 'react-icons/fa'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import AuthButtons from '@/components/AuthButtons'
import { useShopping } from '@/context/ShoppingContext'

function UserAvatar({ name }: { name: string }) {
  const { state } = useShopping();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2"
      >
        <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-xs p-1">
          {initials}
        </div>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
          <Link 
            href="/cart" 
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsDropdownOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Cart
            {state.cart.length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {state.cart.length}
              </span>
            )}
          </Link>
          <Link 
            href="/wishlist"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsDropdownOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Wishlist
            {state.wishlist.length > 0 && (
              <span className="ml-auto bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {state.wishlist.length}
              </span>
            )}
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { data: session, status } = useSession()
  const { state } = useShopping();
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
            <>
              <Link 
                href="/admin/dashboard" 
                className="flex items-center gap-2 px-4 py-2 font-bold tracking-wider bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-600 text-cyan-600 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-white"
              >
                <FaTachometerAlt className="w-4 h-4" />
                Dashboard
              </Link>
              <Link 
                href="/store" 
                className="font-medium tracking-wide text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 transition-all duration-200 ease-in-out relative group"
              >
                Store
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-200 ease-in-out"></span>
              </Link>
            </>
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
          
          {/* User Info and Cart/Wishlist Icons */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative">
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {state.cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.cart.length}
                </span>
              )}
            </Link>

            {/* Wishlist Icon */}
            <Link href="/wishlist" className="relative">
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {state.wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.wishlist.length}
                </span>
              )}
            </Link>

            {/* User Avatar */}
            {session ? (
              <UserAvatar name={session.user?.name || 'User'} />
            ) : (
              <FaUserCircle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            )}
            
            <AuthButtons />
            <ThemeSwitcher />
          </div>
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
              <>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  <FaTachometerAlt className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/store"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  Store
                </Link>
              </>
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