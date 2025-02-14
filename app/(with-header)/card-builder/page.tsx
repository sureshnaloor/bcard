"use client"

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import CardBuilder from '@/components/card-builder/CardBuilder';
import ProfileForm from '@/components/ProfileForm';
import { useRouter } from 'next/navigation';

export default function CardBuilderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showProfileForm, setShowProfileForm] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const handleCardCreated = () => {
    const wantProfile = window.confirm('Would you like to create a digital profile for this card?');
    if (wantProfile) {
      setShowProfileForm(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-24 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl w-full">
        <h1 className="text-xl font-bold text-gray-800 mb-6 text-center px-4 py-2 rounded-lg 
          bg-white/30 backdrop-blur-sm border border-white/20 shadow-lg
          dark:bg-gray-800/30 dark:border-gray-700/30
          transition-all duration-300 hover:bg-white/40 dark:hover:bg-gray-800/40">
          Business Card
        </h1>
        <CardBuilder userEmail={session?.user?.email || ''} onCardCreated={handleCardCreated} />
      </div>

      {/* Profile Form Modal */}
      {showProfileForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Create Digital Profile</h2>
              <button 
                onClick={() => setShowProfileForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <ProfileForm />
          </div>
        </div>
      )}
    </div>
  );
}