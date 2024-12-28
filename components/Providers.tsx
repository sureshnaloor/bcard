'use client';

import { SessionProvider } from 'next-auth/react';
import { ShoppingProvider } from '@/context/ShoppingContext';

export default function Providers({ 
  children,
  session 
}: { 
  children: React.ReactNode;
  session: any;
}) {
  return (
    <SessionProvider session={session}>
      <ShoppingProvider>
        {children}
      </ShoppingProvider>
    </SessionProvider>
  );
} 