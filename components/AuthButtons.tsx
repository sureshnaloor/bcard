'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';

export default function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
      >
        <FaUserCircle className="w-4 h-4" />
        Sign Out
      </button>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <FaUserCircle className="w-4 h-4" />
      Sign In
    </Link>
  );
} 