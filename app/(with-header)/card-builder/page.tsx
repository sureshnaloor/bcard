"use client"

import { useSession } from 'next-auth/react';
import CardBuilder from '@/app/components/card-builder/CardBuilder';
import { redirect } from 'next/navigation';

export default function CardBuilderPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-24 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create Your Business Card
        </h1>
        <CardBuilder userEmail={session.user?.email || ''} />
      </div>
    </div>
  );
} 