'use client';

import { useState, useEffect } from 'react';
import { IoLocationOutline, IoCalendarOutline, IoPlayCircleOutline } from 'react-icons/io5';
import { format, differenceInDays, setYear } from 'date-fns';

interface CustomField {
  label: string;
  value: string;
  type: 'text' | 'date' | 'location' | 'document' | 'media';
}

interface CustomFieldDisplayProps {
  field: CustomField;
}

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

    useEffect(() => {
      if (showModal && window.google) {
        const mapElement = document.getElementById(`map-${field.label}`);
        if (!mapElement) return;

        const map = new google.maps.Map(mapElement, {
          zoom: 12,
          center: { lat, lng },
          mapTypeControl: true,
          streetViewControl: false,
        });

        // Marker for the field location
        new google.maps.Marker({
          position: { lat, lng },
          map,
          title: field.label,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }
        });

        // Add marker for current location if available
        if (currentLocation) {
          new google.maps.Marker({
            position: currentLocation,
            map,
            title: 'Your Location',
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }
          });

          // Fit bounds to show both markers
          const bounds = new google.maps.LatLngBounds();
          bounds.extend({ lat, lng });
          bounds.extend(currentLocation);
          map.fitBounds(bounds);
        }
      }
    }, [showModal, currentLocation]);

    useEffect(() => {
      if (showModal && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const currentLat = position.coords.latitude;
          const currentLng = position.coords.longitude;
          setCurrentLocation({ lat: currentLat, lng: currentLng });
          const dist = calculateDistance(currentLat, currentLng, lat, lng);
          setDistance(`${dist} km`);
        });
      }
    }, [showModal]);

    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
        >
          <IoLocationOutline className="text-xl" />
          <span>View Location</span>
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold mb-4">{field.label}</h3>
              <div 
                id={`map-${field.label}`} 
                className="w-full h-96 rounded-lg mb-4"
              />
              {distance && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Distance from your location: {distance}
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
                  onClick={() => setShowModal(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderMedia = () => (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 
      rounded-xl shadow-md hover:shadow-lg 
      transition-all duration-300 p-4 relative overflow-hidden
      border border-gray-200/50 dark:border-gray-700/50">
      
      {/* Label with gradient background strip - changed colors */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
      
      {/* Label - updated text color */}
      <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 
        bg-clip-text text-transparent mb-2">
        {field.label}
      </h3>
      
      {/* Value - updated container */}
      <div className="mt-1 text-gray-700 dark:text-gray-300">
        {renderField()}
      </div>
    </div>
  );
} 