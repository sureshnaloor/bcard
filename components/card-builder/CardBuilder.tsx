'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import VCardStep from './steps/VCardStep';
import { DigiVCard } from '@/types/card-types';

interface CardBuilderProps {
  userEmail?: string;
  initialData?: DigiVCard;
  onCardCreated: () => void;
}

export default function CardBuilder({ userEmail, initialData, onCardCreated }: CardBuilderProps) {
  const { data: session } = useSession();
  const email = userEmail || session?.user?.email || '';

  const [vCardData, setVCardData] = useState<DigiVCard>({
    userId: email,
    firstName: '',
    middleName: '',
    lastName: '',
    organization: '',
    title: '',
    email: '',
    mobilePhone: '',
    workPhone: '',
    homePhone: '',
    fax: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    youtube: '',
    github: '',
    notes: '',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingCard, setHasExistingCard] = useState(false);
  const [showProfileButton, setShowProfileButton] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/cards/get-vcard');
          if (response.ok) {
            const data = await response.json();
            if (data.card) {
              setVCardData(data.card);
              setShowForm(false);
              setHasExistingCard(true);
              setShowProfileButton(true);
            }
          }
        } catch (error) {
          console.error('Error fetching card:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeData();
  }, [session]);

  const handleStepComplete = async () => {
    try {
      const response = await fetch('/api/cards/save-vcard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...vCardData,
          userId: session?.user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save card');
      }

      setShowForm(false);
      setHasExistingCard(true);
      setShowProfileButton(true);
      return await response.json();
    } catch (error) {
      console.error('Error saving card:', error);
      throw error;
    }
  };

  const isVCardValid = () => {
    return Boolean(
      vCardData.firstName &&
      vCardData.lastName &&
      vCardData.organization &&
      vCardData.title &&
      vCardData.mobilePhone
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
  }
  const hasDigitalProfile = vCardData.userId === email; //for testing only

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        {!showForm && (
          <h1 className="text-[12px] sm:text-[14px] md:text-lg font-bold px-2 sm:px-4 py-1 sm:py-2 rounded-lg 
            bg-white/30 backdrop-blur-sm border border-white/20 shadow-sm sm:shadow-lg
            dark:bg-gray-800/30 dark:border-gray-700/30
            transition-all duration-300 hover:bg-white/40 dark:hover:bg-gray-800/40
            text-gray-800 dark:text-gray-200">
            Your Digital Card
          </h1>
        )}
        <div className="flex gap-4">
          {hasExistingCard && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="group inline-flex items-center gap-1 transition-all duration-300"
            >
              <div className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 
                transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                  />
                </svg>
              </div>
              <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs 
                transition-all duration-300 ease-in-out text-xs text-blue-600">
                edit card
              </span>
            </button>
          )}
          {showProfileButton && (
            <button
              onClick={() => onCardCreated()}
              className="group inline-flex items-center gap-1 transition-all duration-300"
            >
              <div className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 
                transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {hasDigitalProfile ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                    />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M12 4v16m8-8H4" 
                    />
                  )}
                </svg>
              </div>
              <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs 
                transition-all duration-300 ease-in-out text-xs text-green-600">
                {hasDigitalProfile ? 'show digital profile' : '+create digital profile'}
              </span>
            </button>
          )}
        </div>
      </div>

      <VCardStep 
        data={vCardData}
        onChange={setVCardData}
        onComplete={handleStepComplete}
        isValid={isVCardValid()}
        showForm={showForm}
        isEditing={hasExistingCard && showForm}
        hasExistingCard={hasExistingCard}
      />
    </div>
  );
}