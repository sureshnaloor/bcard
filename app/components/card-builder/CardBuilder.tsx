'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import VCardStep from './steps/VCardStep';
import { DigiVCard } from '@/types/card-types';

interface CardBuilderProps {
  initialData?: DigiVCard;
}

export default function CardBuilder({ initialData }: CardBuilderProps) {
  const { data: session } = useSession();
  const [vCardData, setVCardData] = useState<DigiVCard>({
    userId: '',
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
          email: session?.user?.email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save card');
      }

      setShowForm(false);
      setHasExistingCard(true);
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        {!showForm && (
          <h1 className="text-2xl font-bold">Your Digital Card</h1>
        )}
        {hasExistingCard && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Card
          </button>
        )}
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