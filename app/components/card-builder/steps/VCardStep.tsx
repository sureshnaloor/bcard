'use client';

import { useState, useRef } from 'react';
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

export default function VCardStep({ data, onChange, onComplete, isValid, showForm, isEditing, hasExistingCard }: VCardStepProps) {
  const [showMore, setShowMore] = useState(false);
  const [showQR, setShowQR] = useState(!showForm);
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleChange = (field: keyof DigiVCard, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const generateVCardString = () => {
    const fullName = `${data.firstName} ${data.middleName} ${data.lastName}`.trim();
    return `BEGIN:VCARD
VERSION:3.0
FN:${fullName}
N:${data.lastName};${data.firstName};${data.middleName};;
ORG:${data.organization}
TITLE:${data.title}
EMAIL:${data.email}
TEL;TYPE=WORK:${data.workPhone}
TEL;TYPE=HOME:${data.homePhone}
TEL;TYPE=CELL:${data.mobilePhone}
${data.fax ? `TEL;TYPE=FAX:${data.fax}` : ''}
ADR:;;${data.address};${data.city};${data.state};${data.zipCode};${data.country}
${data.website ? `URL:${data.website}` : ''}
${data.notes ? `NOTE:${data.notes}` : ''}
END:VCARD`;
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
                  value={generateVCardString()} 
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
                      {/* Header */}
                      <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {`${data.firstName} ${data.lastName}`}
                        </h2>
                        <p className="text-gray-600 font-medium">{data.title}</p>
                        <p className="text-blue-600">{data.organization}</p>
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
                          value={generateVCardString()} 
                          size={56}
                          level="H"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
      )}
    </div>
  );
};