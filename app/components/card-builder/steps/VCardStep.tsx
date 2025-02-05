'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import { VCardData } from '@/types/card-types';

interface VCardStepProps {
  data: VCardData;
  onChange: (data: VCardData) => void;
  onComplete: () => void;
  isValid: boolean;
}

export default function VCardStep({ data, onChange, onComplete, isValid }: VCardStepProps) {
  const [showMore, setShowMore] = useState(false);

  const handleChange = (field: keyof VCardData, value: string) => {
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

  return (
    <div className="space-y-6">
      {/* Default Fields */}
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

      {/* QR Code Preview */}
      {isValid && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-medium mb-4">Your QR Code</h3>
          <div className="inline-block p-4 bg-white rounded-lg shadow-md">
            <QRCodeSVG 
              value={generateVCardString()} 
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Scan this QR code to save the contact information
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          onClick={onComplete}
          disabled={!isValid}
          className={`px-4 py-2 rounded-md ${
            isValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Media
        </button>
      </div>
    </div>
  );
} 