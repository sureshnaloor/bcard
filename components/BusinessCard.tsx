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

  return (
    <main 
      className="relative min-h-screen pb-10"
      style={{
        backgroundColor: (card.bgColor || '#f9fafb') as string,
        backgroundImage: card.bgImageUrl ? `url(${card.bgImageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Lighter overlay for background image */}
      {card.bgImageUrl && (
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      )}

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
        {/* Add to Contacts Button */}
        {card._id && (
          <Link
            href={`/api/cards/${card._id}/vcard`}
            className="flex items-center justify-center gap-2 w-full bg-blue-600/60 backdrop-blur-md hover:bg-blue-700/90 text-white py-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 mb-6"
          >
            <FaUserPlus className="text-xl" />
            <span className="font-semibold">Add to Contacts</span>
          </Link>
        )}

        {/* Profile Card - Added glassmorphism */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 hover:-translate-y-0.5">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full shadow-xl overflow-hidden">
              {card.logoUrl ? (
                <Image
                  src={card.logoUrl}
                  alt={`${card.company || 'Company'} Logo`}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  priority
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: card.logoColor }}
                >
                  <span className="text-2xl font-bold text-white">
                    {initials}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Name and Details */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-gray-800">
              {card.name}
            </h1>
            
            {card.title && (
              <p className="text-xl text-gray-600 font-medium">
                {card.title}
              </p>
            )}
            
            {card.company && (
              <p className="text-lg text-blue-600 font-semibold">
                {card.company}
              </p>
            )}
            
            {card.description && (
              <p className="text-gray-600 leading-relaxed mt-4">
                {card.description}
              </p>
            )}
          </div>
        </div>

        {/* Social Links */}
        {(card.linkedin || card.linktree || card.website) && (
          <div className="grid grid-cols-3 gap-4 mt-6">
            {card.linkedin && (
              <Link 
                href={ensureAbsoluteUrl(card.linkedin)}
                target="_blank"
                className="flex flex-col items-center gap-2 p-4 bg-white/80 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <FaLinkedin className="text-3xl text-[#0077b5]" />
                <span className="text-sm font-medium text-gray-600">LinkedIn</span>
              </Link>
            )}

            {card.linktree && (
              <Link 
                href={ensureAbsoluteUrl(card.linktree)}
                target="_blank"
                className="flex flex-col items-center gap-2 p-4 bg-white/80 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <FaLink className="text-3xl text-green-600" />
                <span className="text-sm font-medium text-gray-600">LinkTree</span>
              </Link>
            )}

            {card.website && (
              <Link 
                href={ensureAbsoluteUrl(card.website)}
                target="_blank"
                className="flex flex-col items-center gap-2 p-4 bg-white/80 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <FaGlobe className="text-3xl text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Website</span>
              </Link>
            )}
          </div>
        )}

        {/* Custom Fields */}
        {card?.customFields && card.customFields.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {card.customFields.map((field: CustomField, index: number) => (
              <CustomFieldDisplay 
                key={index}
                field={field} 
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 