'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaUserCircle, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

interface AuthButtonsProps {
  showText?: boolean;
}

export default function AuthButtons({ showText = true }: AuthButtonsProps) {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
      >
        <FaSignOutAlt className="w-4 h-4" />
        {showText && <span>Sign Out</span>}
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
    >
      <FaSignInAlt className="w-4 h-4" />
      {showText && <span>Sign In</span>}
    </button>
  );
} 