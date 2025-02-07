'use client';

import { useState, useRef, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import * as htmlToImage from 'html-to-image';
import { DigiVCard } from '@/types/card-types';

interface VCardStepProps {
  data: DigiVCard;
  onChange: (data: DigiVCard) => void;
  onComplete: () => void;
  isValid: boolean;
  showForm: boolean;
  isEditing: boolean;
  hasExistingCard: boolean;
}

const processImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Set smaller dimensions
        const maxSize = 200; // smaller profile photo size
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Convert to JPEG with lower quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

const getImageSrc = (photoData: string) => {
  // Check if the string already includes the data URL prefix
  if (photoData.startsWith('data:image')) {
    return photoData;
  }
  // If it doesn't, add the prefix
  return `data:image/jpeg;base64,${photoData}`;
};

export default function VCardStep({ data, onChange, onComplete, isValid, showForm, isEditing, hasExistingCard }: VCardStepProps) {
  const [showMore, setShowMore] = useState(false);
  const [showQR, setShowQR] = useState(!showForm);
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const generateVCardString = () => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${data.firstName} ${data.middleName ? data.middleName + ' ' : ''}${data.lastName}`,
      `N:${data.lastName};${data.firstName};${data.middleName || ''};;`,
      `ORG:${data.organization}`,
      `TITLE:${data.title}`,
      `EMAIL:${data.email}`,
      data.mobilePhone ? `TEL;TYPE=CELL:${data.mobilePhone}` : '',
      data.workPhone ? `TEL;TYPE=WORK:${data.workPhone}` : '',
      data.homePhone ? `TEL;TYPE=HOME:${data.homePhone}` : '',
      data.fax ? `TEL;TYPE=FAX:${data.fax}` : '',
      data.website ? `URL:${data.website}` : '',
      data.address ? `ADR;TYPE=WORK:;;${data.address};${data.city};${data.state};${data.zipCode};${data.country}` : '',
      data.linkedin ? `X-SOCIALPROFILE;TYPE=linkedin:${data.linkedin}` : '',
      data.twitter ? `X-SOCIALPROFILE;TYPE=twitter:${data.twitter}` : '',
      data.facebook ? `X-SOCIALPROFILE;TYPE=facebook:${data.facebook}` : '',
      data.instagram ? `X-SOCIALPROFILE;TYPE=instagram:${data.instagram}` : '',
      data.youtube ? `X-SOCIALPROFILE;TYPE=youtube:${data.youtube}` : '',
      data.github ? `X-SOCIALPROFILE;TYPE=github:${data.github}` : '',
      data.notes ? `NOTE:${data.notes}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\n');

    return vcard;
  };

  const vCardString = useMemo(() => generateVCardString(), [data]);

  const handleChange = (field: keyof DigiVCard, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleGenerateCard = async () => {
    if (!isValid) return;

    const confirmed = window.confirm(
      'Are you sure you want to generate your digital card? Please ensure all relevant fields are filled in.'
    );

    if (confirmed) {
      setIsGenerating(true);
      try {
        await onComplete();
        setShowQR(true);
      } catch (error) {
        console.error('Error generating card:', error);
        alert('There was an error generating your card. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const downloadQRCode = () => {
    const svg = document.querySelector('.qr-code svg') as SVGElement;
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const img = new (Image as any as { new(): HTMLImageElement })();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const downloadDigitalCard = async () => {
    if (cardRef.current === null) return;

    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `${data.firstName}-${data.lastName}-digital-card.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating card image:', error);
      alert('Error generating card image. Please try again.');
    }
  };

  const downloadVCard = () => {
    const vCardString = generateVCardString();
    const blob = new Blob([vCardString], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${data.firstName}_${data.lastName}_contact.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    try {
      const dataUrl = await processImage(file);
      handleChange('photo', dataUrl);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Show title ONLY for new card creation */}
      {showForm && !hasExistingCard && !isEditing && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Create Your Digital Card</h1>
          <p className="text-sm text-gray-500 mb-8">
            Fill in your contact information to create your digital business card
          </p>
        </div>
      )}

      {showForm && (
        <>
          {/* Add Photo Upload Section at the top */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Photo</h3>
            <div className="flex items-center space-x-6">
              <div className="relative w-24 h-24">
                {data.photo ? (
                  <Image
                    src={data.photo}
                    alt="Profile photo"
                    fill
                    className="rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <label className="block">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Section */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name *</label>
                  <input
                    type="text"
                    value={data.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                  <input
                    type="text"
                    value={data.middleName}
                    onChange={(e) => handleChange('middleName', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                  <input
                    type="text"
                    value={data.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Organization *</label>
                  <input
                    type="text"
                    value={data.organization}
                    onChange={(e) => handleChange('organization', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title *</label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile Phone *</label>
                  <input
                    type="tel"
                    value={data.mobilePhone}
                    onChange={(e) => handleChange('mobilePhone', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* More Fields Toggle */}
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            {showMore ? 'Show Less Fields' : 'Show More Fields'}
            <svg
              className={`w-4 h-4 transform transition-transform ${showMore ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Additional Fields */}
          {showMore && (
            <div className="space-y-8">
              {/* Additional Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Work Phone</label>
                    <input
                      type="tel"
                      value={data.workPhone}
                      onChange={(e) => handleChange('workPhone', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Home Phone</label>
                    <input
                      type="tel"
                      value={data.homePhone}
                      onChange={(e) => handleChange('homePhone', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fax</label>
                    <input
                      type="tel"
                      value={data.fax}
                      onChange={(e) => handleChange('fax', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <input
                      type="url"
                      value={data.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Street Address</label>
                    <input
                      type="text"
                      value={data.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      value={data.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State/Province</label>
                    <input
                      type="text"
                      value={data.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ZIP/Postal Code</label>
                    <input
                      type="text"
                      value={data.zipCode}
                      onChange={(e) => handleChange('zipCode', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      value={data.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                    <input
                      type="url"
                      value={data.linkedin}
                      onChange={(e) => handleChange('linkedin', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Twitter</label>
                    <input
                      type="url"
                      value={data.twitter}
                      onChange={(e) => handleChange('twitter', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Facebook</label>
                    <input
                      type="url"
                      value={data.facebook}
                      onChange={(e) => handleChange('facebook', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Instagram</label>
                    <input
                      type="url"
                      value={data.instagram}
                      onChange={(e) => handleChange('instagram', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">YouTube</label>
                    <input
                      type="url"
                      value={data.youtube}
                      onChange={(e) => handleChange('youtube', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">GitHub</label>
                    <input
                      type="url"
                      value={data.github}
                      onChange={(e) => handleChange('github', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={data.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={handleGenerateCard}
              disabled={!isValid}
              className={`px-6 py-3 rounded-md ${
                isValid ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isEditing ? 'Update Digital Card' : 'Generate Digital Card with QR Code'}
            </button>
          </div>
        </>
      )}

      {/* QR Code and Digital Card Section - only show when not in edit mode */}
      {showQR && !showForm && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          {!isEditing && (
            <h3 className="text-xl font-semibold mb-4">Your Digital Card is Ready!</h3>
          )}
          <div className="grid md:grid-cols-2 gap-8">
            {/* QR Code - for display only */}
            <div className="text-center">
              <h4 className="text-lg font-medium mb-4">Scan QR Code</h4>
              <div className="inline-block p-4 bg-white rounded-lg shadow-md qr-code">
                <QRCodeSVG 
                  value={vCardString}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Scan this QR code with your phone to save contact
              </p>
            </div>

            {/* Digital Card Preview with Download */}
            <div className="text-center">
              <h4 className="text-lg font-medium mb-4">Digital Business Card</h4>
              <div className="relative w-full aspect-[1.75] max-w-md mx-auto" ref={cardRef}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-2xl">
                  <div className="absolute inset-0.5 bg-white/90 backdrop-blur-sm rounded-xl p-6">
                    <div className="h-full flex flex-col justify-between">
                      {/* Header with Photo */}
                      <div className="flex items-center gap-4">
                        {data.photo && (
                          <div className="relative w-16 h-16">
                            <Image
                              src={data.photo}
                              alt="Profile"
                              fill
                              className="rounded-full object-cover"
                              unoptimized
                            />
                          </div>
                        )}
                        <div>
                          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {`${data.firstName} ${data.lastName}`}
                          </h2>
                          <p className="text-gray-600 font-medium">{data.title}</p>
                          <p className="text-blue-600">{data.organization}</p>
                        </div>
                      </div>

                      {/* Contact Details */}
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <span>{data.mobilePhone}</span>
                        </div>
                        {data.email && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            <span>{data.email}</span>
                          </div>
                        )}
                        {data.website && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            <span>{data.website}</span>
                          </div>
                        )}
                      </div>

                      {/* QR Code */}
                      <div className="absolute bottom-4 right-4 w-16 h-16 bg-white rounded-lg p-1">
                        <QRCodeSVG 
                          value={vCardString}
                          size={56}
                          level="H"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={downloadVCard}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download vCard
                </button>
                <button
                  onClick={downloadDigitalCard}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 mx-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Digital Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};