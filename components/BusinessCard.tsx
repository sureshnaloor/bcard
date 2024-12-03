import Image from "next/image";
import Link from "next/link";
import { FaUserPlus, FaLinkedin, FaLink, FaGlobe } from "react-icons/fa";
import { BusinessCard as BusinessCardType } from "../types/user";
import React from "react";
import { shortenId } from '@/utils/idConverter';
import CustomFieldDisplay, { CustomField } from './CustomFieldDisplay';

interface Props {
  card: BusinessCardType;
}

// Update the helper function to handle undefined values
const ensureAbsoluteUrl = (url: string | undefined): string => {
  if (!url) return '';
  return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
};

const getInitials = (name: string) => {
  const names = name.trim().split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name[0]?.toUpperCase() || '';
};

export default function BusinessCard({ card }: Props) {
  const initials = getInitials(card.name);

  // Debug logs
  // Debug logs for development only
  console.log('Full card data:', card);

  return (
    <main className="relative min-h-screen pb-10">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        {card.bgImageUrl ? (
          <Image
            src={card.bgImageUrl}
            alt="Background"
            fill
            className="object-cover opacity-20 brightness-75 grayscale"
            priority
          />
        ) : (
          <div className={`w-full h-full ${
            Array.isArray(card.bgColor) 
              ? `bg-gradient-to-r ${card.bgColor[0]}` 
              : ''
          }`} 
          style={!Array.isArray(card.bgColor) ? { backgroundColor: card.bgColor } : {}}
          />
        )}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-4 flex items-center justify-center min-h-screen">
        {/* Card Container with Relative Positioning */}
        <div className="relative w-full max-w-3xl mt-16 bg-white rounded-xl shadow-2xl p-6">
          {/* Logo - Positioned Absolutely Relative to Card */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="relative w-24 h-24 rounded-full border-6 border-white shadow-xl overflow-hidden">
              {card.logoUrl ? (
                <Image
                  src={card.logoUrl}
                  alt={`${card.company || 'Company'} Logo`}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center bg-gradient-to-br"
                  style={{ backgroundColor: card.logoColor }}
                >
                  <span className="text-2xl font-serif font-bold text-white drop-shadow-lg
                    bg-clip-text animate-fade-in"
                  >
                    {initials}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Card Content with Proper Spacing */}
          <div className="mt-14 text-center">
            {card.company && (
              <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-900 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                  {card.company}
                </span>
              </h1>
            )}
            
            <div className="my-2 border-t border-gray-200"></div>
            
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                {card.name}
              </span>
            </h2>
            
            {card.title && (
              <p className="text-2xl text-gray-600 mt-2 italic font-semibold">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                  {card.title}
                </span>
              </p>
            )}
            
            {card.description && (
              <>
                <div className="my-2 border-t border-gray-200"></div>
                <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  {card.description}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Social Links - Only show if at least one social link exists */}
      {(card.linkedin || card.linktree || card.website) && (
        <div className="container mx-auto px-4 max-w-3xl space-y-2 mt-2">
          {/* vCard Download Link */}
          {card._id && (
            <Link
              href={`/api/cards/${card._id}/vcard`}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <FaUserPlus className="text-xl" />
              <span className="font-semibold">Add to Contacts</span>
            </Link>
          )}

          {/* Social Links Grid */}
          <div className="grid grid-cols-3 gap-3">
            {card.linkedin && (
              <Link 
                href={ensureAbsoluteUrl(card.linkedin)}
                target="_blank"
                className="flex flex-col items-center gap-1 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <FaLinkedin className="text-2xl text-[#0077b5]" />
                <span className="text-sm font-medium text-gray-600">LinkedIn</span>
              </Link>
            )}

            {card.linktree && (
              <Link 
                href={ensureAbsoluteUrl(card.linktree)}
                target="_blank"
                className="flex flex-col items-center gap-1 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <FaLink className="text-2xl text-green-600" />
                <span className="text-sm font-medium text-gray-600">LinkTree</span>
              </Link>
            )}

            {card.website && (
              <Link 
                href={ensureAbsoluteUrl(card.website)}
                target="_blank"
                className="flex flex-col items-center gap-1 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <FaGlobe className="text-2xl text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Website</span>
              </Link>
            )}
          </div>
        </div>
      )}
      {/* Custom Fields Grid Section */}
      {card?.customFields && card.customFields.length > 0 && (
        <div className="container mx-auto px-4 max-w-3xl mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {card.customFields.map((field: CustomField, index: number) => (
              <CustomFieldDisplay 
                key={index}
                field={field} 
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
} 