import Image from "next/image";
import Link from "next/link";
import { FaUserPlus, FaLinkedin, FaGlobe, FaGithub, FaTwitter } from "react-icons/fa";
import { VCardData } from "@/types/vcard";
import React from "react";
import ThemeSwitcher from './ThemeSwitcher';

interface Props {
  profile: VCardData;
}

const ensureAbsoluteUrl = (url: string | undefined): string => {
  if (!url) return '';
  return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
};

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

export default function DigitalProfileCard({ profile }: Props) {
  const initials = getInitials(profile.firstName || '', profile.lastName || '');

  return (
    <main 
      className="relative min-h-screen pb-10"
      style={{
        backgroundColor: '#EBE9E1',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
        {/* Add to Contacts Button and Theme Switcher */}
        <div className="flex gap-4 mb-6">
          {profile._id && (
            <Link
              href={`/api/profiles/${profile._id}/vcard`}
              className="flex-[3] flex items-center justify-center gap-2 bg-blue-600/60 backdrop-blur-md hover:bg-blue-700/90 text-white py-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              <FaUserPlus className="text-xl" />
              <span className="font-semibold">Add to Contacts</span>
            </Link>
          )}
          
          <div className="flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center">
            <ThemeSwitcher />
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 hover:-translate-y-0.5">
          {/* Logo/Photo */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full shadow-xl overflow-hidden">
              {profile.photo ? (
                <Image
                  src={profile.photo}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  priority
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center bg-blue-600"
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {`${profile.firstName} ${profile.lastName}`}
            </h1>
            
            {profile.title && (
              <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">
                {profile.title}
              </p>
            )}
            
            {profile.organization && (
              <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold">
                {profile.organization}
              </p>
            )}
            
            {profile.notes && (
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                {profile.notes}
              </p>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {profile.linkedin && (
            <Link 
              href={ensureAbsoluteUrl(profile.linkedin)}
              target="_blank"
              className="flex flex-col items-center gap-2 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <FaLinkedin className="text-3xl text-[#0077b5]" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn</span>
            </Link>
          )}

          {profile.website && (
            <Link 
              href={ensureAbsoluteUrl(profile.website)}
              target="_blank"
              className="flex flex-col items-center gap-2 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <FaGlobe className="text-3xl text-blue-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Website</span>
            </Link>
          )}

          {/* Add other social links similarly */}
        </div>

        {/* Contact Information */}
        <div className="mt-6 space-y-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-6">
          {profile.workEmail && (
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <span className="font-medium">Email:</span>
              <a href={`mailto:${profile.workEmail}`} className="hover:text-blue-600">
                {profile.workEmail}
              </a>
            </div>
          )}
          {profile.mobilePhone && (
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <span className="font-medium">Phone:</span>
              <a href={`tel:${profile.mobilePhone}`} className="hover:text-blue-600">
                {profile.mobilePhone}
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 