"use client"

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import CardBuilder from '@/app/components/card-builder/CardBuilder';
import ProfileForm from '@/app/components/ProfileForm';
import { redirect } from 'next/navigation';

export default function CardBuilderPage() {
  const { data: session, status } = useSession();
  const [showProfileForm, setShowProfileForm] = useState(false);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/auth/signin');
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create Your Business Card
        </h1>
        <CardBuilder userEmail={session.user?.email || ''} onCardCreated={handleCardCreated} />
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