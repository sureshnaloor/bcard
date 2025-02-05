'use client';

import { useState } from 'react';
import VCardStep from './steps/VCardStep';
import MediaStep from './steps/MediaStep';
import { VCardData, MediaData } from '@/types/card-types';

interface CardBuilderProps {
  userEmail: string;
  initialData?: VCardData;
}

export default function CardBuilder({ userEmail, initialData }: CardBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [vCardData, setVCardData] = useState<VCardData>(initialData || {
    firstName: '',
    middleName: '',
    lastName: '',
    organization: '',
    title: '',
    email: userEmail,
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
  });

  const [mediaData, setMediaData] = useState<MediaData>({
    location: {
      address: '',  // Initialize with empty string
    },
    audioFiles: [],
    images: [],
    richText: '',
  });

  const isVCardValid = () => {
    return Boolean(
      vCardData.firstName &&
      vCardData.lastName &&
      vCardData.organization &&
      vCardData.title &&
      vCardData.mobilePhone
    );
  };

  const handleStepComplete = async (step: number) => {
    if (step === 1) {
      // For now, just move to next step without API call
      setCurrentStep(2);
    } else if (step === 2) {
      // Handle media step completion later
      console.log('Media step completed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Your Card</h1>
      <p className="text-sm text-gray-500 mb-4">
        Fill in your contact information to create your digital business card
      </p>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            Contact Information
          </div>
          <div className="h-px w-8 bg-gray-300" />
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            Media & Additional Info
          </div>
        </div>
      </div>

      {/* Step content */}
      {currentStep === 1 && (
        <VCardStep 
          data={vCardData}
          onChange={setVCardData}
          onComplete={() => handleStepComplete(1)}
          isValid={isVCardValid()}
        />
      )}

      {currentStep === 2 && (
        <MediaStep 
          data={mediaData}
          onChange={setMediaData}
          onComplete={() => handleStepComplete(2)}
        />
      )}
    </div>
  );
} 