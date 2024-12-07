'use client';

import { useState } from 'react';
import { IoLocationOutline, IoCalendarOutline, IoPlayCircleOutline } from 'react-icons/io5';
import { format, differenceInDays, setYear } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

export interface CustomField {
  label: string;
  value: string;
  type: 'text' | 'date' | 'location' | 'document' | 'media' | 'richtext';
}

export interface CustomFieldDisplayProps {
  field: CustomField;
}

// Separate LocationMap component
const LocationMap = ({ 
  location,
  onClose 
}: { 
  location: string;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="p-4 flex justify-between items-center border-b">
          <h3 className="text-lg font-semibold">Location</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <div className="p-4">
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-[400px] border-0"
            allowFullScreen
          />
        </div>
        <div className="p-4 border-t">
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};

export default function CustomFieldDisplay({ field }: CustomFieldDisplayProps) {
  const [showModal, setShowModal] = useState(false);

  const renderText = () => (
    <p className="text-gray-700 dark:text-gray-300">{field.value}</p>
  );

  const renderRichText = () => (
    <div 
      className="prose prose-sm dark:prose-invert max-w-none overflow-hidden"
      dangerouslySetInnerHTML={{ 
        __html: field.value.toString()
      }} 
    />
  );

  const renderDate = () => {
    const date = new Date(field.value);
    const today = new Date();
    
    // Set both dates to the same year for comparison
    const dateThisYear = setYear(date, today.getFullYear());
    const todayDate = setYear(today, today.getFullYear());
    
    // Calculate days difference
    let daysDiff = differenceInDays(dateThisYear, todayDate);
    
    // Adjust for dates that have already passed this year
    if (daysDiff < 0) {
      // Set the date to next year for comparison
      const dateNextYear = setYear(date, today.getFullYear() + 1);
      daysDiff = differenceInDays(dateNextYear, todayDate);
    }

    const formattedDate = format(date, 'MMMM d');
    
    return (
      <div className="flex items-center space-x-2">
        <IoCalendarOutline className="text-purple-500" />
        <span className="text-gray-700 dark:text-gray-300">{formattedDate}</span>
        <span className="text-sm text-purple-600 dark:text-purple-400">
          {daysDiff === 0 ? 'today' : `in ${daysDiff} days`}
        </span>
      </div>
    );
  };

  const renderLocation = () => (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-2 text-stone-900 dark:text-white hover:text-stone-800 dark:hover:text-gray-200 transition-colors"
      >
        <IoLocationOutline className="text-xl" />
        <span>View Location</span>
      </button>

      {showModal && (
        <LocationMap
          location={field.value}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );

  const renderMedia = () => (
    <div className="relative h-48 w-full">
      {field.value.includes('youtube') ? (
        <iframe
          src={field.value.replace('watch?v=', 'embed/')}
          className="w-full h-full rounded-lg"
          allowFullScreen
        />
      ) : (
        <Image 
          src={field.value}
          alt={field.label}
          fill
          className="object-cover rounded-lg"
        />
      )}
    </div>
  );

  const renderDocument = () => (
    <Link 
      href={field.value}
      target="_blank"
      className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
    >
      View Document
    </Link>
  );

  const renderField = () => {
    switch (field.type) {
      case 'richtext':
        return renderRichText();
      case 'text':
        return renderText();
      case 'date':
        return renderDate();
      case 'location':
        return renderLocation();
      case 'media':
        return renderMedia();
      case 'document':
        return renderDocument();
      default:
        return renderText();
    }
  };

  return (
    <div className="p-4">
      <h3 className="font-bold italic text-gray-800 dark:text-gray-200 mb-2">
        {field.label}
      </h3>
      {renderField()}
    </div>
  );
} 