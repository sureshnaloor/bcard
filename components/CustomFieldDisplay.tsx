'use client';

import { useState, useEffect } from 'react';
import { IoLocationOutline, IoCalendarOutline, IoPlayCircleOutline } from 'react-icons/io5';
import { format, differenceInDays, setYear } from 'date-fns';
import Script from 'next/script';

export interface CustomField {
  label: string;
  value: string;
  type: 'text' | 'date' | 'location' | 'document' | 'media';
}

export interface CustomFieldDisplayProps {
  field: CustomField;
  key?: number;
}

// Create a new LocationMap component
const LocationMap = ({ 
  lat, 
  lng, 
  label, 
  currentLocation, 
  onClose 
}: { 
  lat: number; 
  lng: number; 
  label: string; 
  currentLocation: { lat: number; lng: number } | null;
  onClose: () => void;
}) => {
    function calculateDistance(lat: number, lng: number, lat1: number, lng1: number): import("react").ReactNode {
        throw new Error('Function not implemented.');
    }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-4">{label}</h3>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=marker`}
          strategy="lazyOnload"
          onLoad={() => {
            console.log('Google Maps script loaded');
            console.log('API Key:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.slice(0, 8) + '...');
            console.log('Current URL:', window.location.href);
            
            const mapElement = document.getElementById(`map-${label}`);
            if (!mapElement || !window.google) {
              console.error('Map initialization failed', {
                mapElement: !!mapElement,
                googleAvailable: !!window.google,
                apiKey: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
              });
              return;
            }

            const map = new google.maps.Map(mapElement, {
              zoom: 12,
              center: { lat, lng },
              mapTypeControl: true,
              streetViewControl: false,
              mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID,
              disableDefaultUI: false
            });

            // Marker for the field location
            const marker = new google.maps.marker.AdvancedMarkerElement({
              map,
              position: { lat, lng },
              title: label
            });

            // Add marker for current location if available
            if (currentLocation) {
              const currentMarker = new google.maps.marker.AdvancedMarkerElement({
                map,
                position: currentLocation,
                title: 'Your Location'
              });

              // Fit bounds to show both markers
              const bounds = new google.maps.LatLngBounds();
              bounds.extend({ lat, lng });
              bounds.extend(currentLocation);
              map.fitBounds(bounds);
            }
          }}
          onError={(e) => {
            console.error('Google Maps script error:', e);
            console.log('Current domain:', window.location.hostname);
            console.log('API Key present:', !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
          }}
        />
        <div 
          id={`map-${label}`} 
          className="w-full h-96 rounded-lg mb-4"
        />
        {currentLocation && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Distance from your location: {calculateDistance(
              currentLocation.lat,
              currentLocation.lng,
              lat,
              lng
            )} km
          </p>
        )}
        <div className="flex justify-between">
          <button
            onClick={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                '_blank'
              );
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Start Navigation
          </button>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CustomFieldDisplay({ field }: CustomFieldDisplayProps) {
  const [showModal, setShowModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<string>('');

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d.toFixed(2);
  };

  const renderText = () => (
    <p className="text-gray-700 dark:text-gray-300">{field.value}</p>
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

  const renderLocation = () => {
    const [lat, lng] = field.value.split(',').map(Number);

    return (
      <>
        {showModal && (
          <LocationMap
            lat={lat}
            lng={lng}
            label={field.label}
            currentLocation={currentLocation}
            onClose={() => setShowModal(false)}
          />
        )}
        
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 text-stone-800 hover:text-stone-900"
        >
          <IoLocationOutline className="text-xl" />
          <span>View Location</span>
        </button>
      </>
    );
  };

  const renderMedia = () => (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-2 text-stone-600 hover:text-purple-700"
      >
        <IoPlayCircleOutline className="text-xl" />
        <span>Play Media</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">{field.label}</h3>
            <div className="aspect-video w-full mb-4">
              {field.value.includes('youtube') ? (
                <iframe
                  src={field.value.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <video
                  src={field.value}
                  controls
                  className="w-full h-full"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return renderText();
      case 'date':
        return renderDate();
      case 'location':
        return renderLocation();
      case 'media':
        return renderMedia();
      default:
        return renderText();
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50/50 to-gray-100/60 dark:from-gray-800 dark:to-gray-900 
      rounded-xl shadow-md hover:shadow-lg py-9
      transition-all duration-300 p-4 relative overflow-hidden
      border border-gray-200/50 dark:border-gray-700/70">
      
      {/* Label with gradient background strip - changed colors */}
      {/* <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" /> */}
      
      {/* Label - updated text color */}
      <h3 className="text-xl font-black bg-gradient-to-r from-zinc-300 to-zinc-900 
        bg-clip-text text-transparent tracking-wider mb-2">
        {field.label}
      </h3>
      
      {/* Value - updated container */}
      <div className="mt-1 text-gray-700 dark:text-gray-300">
        {renderField()}
      </div>
    </div>
  );
} 