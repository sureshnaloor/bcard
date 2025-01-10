'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'
import { 
  FaTachometerAlt, 
  FaBars,
  FaTimes,
  FaUserCircle,
  FaInfoCircle,
  FaChevronDown,
  FaStore,
  FaDollarSign,
  FaEnvelope
} from 'react-icons/fa'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import AuthButtons from '@/components/AuthButtons'
import { useShopping } from '@/context/ShoppingContext'
import { usePathname } from 'next/navigation'

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
        <div className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] border border-gray-100 dark:border-gray-700 z-[100]">
          <Link 
            href="/profile" 
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100/90 dark:hover:bg-gray-700/90 first:rounded-t-lg"
            onClick={() => setIsDropdownOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile Settings
          </Link>

          <Link 
            href="/shipping" 
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100/90 dark:hover:bg-gray-700/90"
            onClick={() => setIsDropdownOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Shipping Address
          </Link>

          <div className="border-t border-gray-100 dark:border-gray-700/50 my-1 opacity-50"></div>

          <Link 
            href="/cart" 
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100/90 dark:hover:bg-gray-700/90"
            onClick={() => setIsDropdownOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
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
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100/90 dark:hover:bg-gray-700/90 last:rounded-b-lg"
            onClick={() => setIsDropdownOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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

function AboutDropdown({ currentPath }: { currentPath: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAboutPage = currentPath.startsWith('/about');
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium backdrop-blur-sm rounded-lg shadow-sm border transition-all duration-200 group
          ${isAboutPage 
            ? 'bg-cyan-50/90 dark:bg-cyan-900/90 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300' 
            : 'bg-white/90 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/90 hover:shadow-md'
          }`}
      >
        <FaInfoCircle className={`w-4 h-4 ${isAboutPage ? 'text-cyan-600 dark:text-cyan-400' : 'text-cyan-500 dark:text-cyan-400 group-hover:scale-110 transition-transform'}`} />
        <span>About Us</span>
        <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)] border border-gray-100 dark:border-gray-700 z-[100]">
          <Link
            href="/about/xbeyond"
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100/90 dark:hover:bg-gray-700/90 first:rounded-t-lg"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About XBeyond
          </Link>
          <Link
            href="/about/smartwave"
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100/90 dark:hover:bg-gray-700/90 last:rounded-b-lg"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            About SmartWave
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
  const pathname = usePathname();

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
        <div className="hidden md:flex items-center gap-3">
          {session && (
            <>
              <Link 
                href="/admin/dashboard" 
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium backdrop-blur-sm rounded-lg shadow-sm border transition-all duration-200 group
                  ${pathname === '/admin/dashboard' 
                    ? 'bg-cyan-50/90 dark:bg-cyan-900/90 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 cursor-default pointer-events-none' 
                    : 'bg-white/90 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/90 hover:shadow-md'
                  }`}
              >
                <FaTachometerAlt className={`w-4 h-4 ${pathname === '/admin/dashboard' ? 'text-cyan-600 dark:text-cyan-400' : 'text-cyan-500 dark:text-cyan-400 group-hover:scale-110 transition-transform'}`} />
                <span>Dashboard</span>
              </Link>
              
              <Link 
                href="/store" 
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium backdrop-blur-sm rounded-lg shadow-sm border transition-all duration-200 group
                  ${pathname === '/store' 
                    ? 'bg-cyan-50/90 dark:bg-cyan-900/90 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 cursor-default pointer-events-none' 
                    : 'bg-white/90 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/90 hover:shadow-md'
                  }`}
              >
                <FaStore className={`w-4 h-4 ${pathname === '/store' ? 'text-cyan-600 dark:text-cyan-400' : 'text-cyan-500 dark:text-cyan-400 group-hover:scale-110 transition-transform'}`} />
                <span>Store</span>
              </Link>
            </>
          )}

          <AboutDropdown currentPath={pathname} />

          <Link 
            href="/pricing" 
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium backdrop-blur-sm rounded-lg shadow-sm border transition-all duration-200 group
              ${pathname === '/pricing' 
                ? 'bg-cyan-50/90 dark:bg-cyan-900/90 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 cursor-default pointer-events-none' 
                : 'bg-white/90 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/90 hover:shadow-md'
              }`}
          >
            <FaDollarSign className={`w-4 h-4 ${pathname === '/pricing' ? 'text-cyan-600 dark:text-cyan-400' : 'text-cyan-500 dark:text-cyan-400 group-hover:scale-110 transition-transform'}`} />
            <span>Pricing</span>
          </Link>

          <Link 
            href="/contact" 
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium backdrop-blur-sm rounded-lg shadow-sm border transition-all duration-200 group
              ${pathname === '/contact' 
                ? 'bg-cyan-50/90 dark:bg-cyan-900/90 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 cursor-default pointer-events-none' 
                : 'bg-white/90 dark:bg-gray-800/90 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/90 hover:shadow-md'
              }`}
          >
            <FaEnvelope className={`w-4 h-4 ${pathname === '/contact' ? 'text-cyan-600 dark:text-cyan-400' : 'text-cyan-500 dark:text-cyan-400 group-hover:scale-110 transition-transform'}`} />
            <span>Contact</span>
          </Link>
        </div>

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
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <FaInfoCircle className="w-4 h-4" />
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