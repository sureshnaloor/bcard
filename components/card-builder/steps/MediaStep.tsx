'use client';

import { useState, useEffect } from 'react';
import { MediaData } from '@/types/card-types';
import Image from 'next/image';
import { MapPinIcon, MusicalNoteIcon, PhotoIcon, DocumentTextIcon, SwatchIcon } from '@heroicons/react/24/outline';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

interface MediaStepProps {
  data: MediaData;
  onChange: (data: MediaData) => void;
  onComplete: () => void;
}

const defaultCenter = { lat: 0, lng: 0 };

export default function MediaStep({ data, onChange, onComplete }: MediaStepProps) {
  const [uploading, setUploading] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Handle current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Get address from coordinates using Google Geocoding API
          try {
            const response = await fetch(
              `/api/geocode?lat=${lat}&lng=${lng}`
            );
            const data = await response.json();
            if (data.address) {
              onChange({
                ...data,
                location: {
                  address: data.address,
                  lat,
                  lng,
                  useCurrentLocation: true
                }
              });
              setMapCenter({ lat, lng });
            }
          } catch (error) {
            console.error('Error getting address:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // Handle map click
  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;
    
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    try {
      const response = await fetch(
        `/api/geocode?lat=${lat}&lng=${lng}`
      );
      const data = await response.json();
      if (data.address) {
        onChange({
          ...data,
          location: {
            address: data.address,
            lat,
            lng,
            useCurrentLocation: false
          }
        });
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };

  // Handle file uploads
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'background' | 'image' | 'audio') => {
    if (!e.target.files?.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      const response = await fetch(`/api/upload/${type}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        
        if (type === 'logo') {
          onChange({
            ...data,
            branding: { ...data.branding, logo: url }
          });
        } else if (type === 'background') {
          onChange({
            ...data,
            branding: { ...data.branding, backgroundImage: url }
          });
        } else if (type === 'image') {
          onChange({
            ...data,
            images: [...data.images, url]
          });
        } else if (type === 'audio') {
          onChange({
            ...data,
            audioFiles: [...data.audioFiles, url]
          });
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        onChange({
          ...data,
          images: [...data.images, url],
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      const response = await fetch('/api/upload/audio', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        onChange({
          ...data,
          audioFiles: [...data.audioFiles, url],
        });
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...data.images];
    newImages.splice(index, 1);
    onChange({ ...data, images: newImages });
  };

  const removeAudio = (index: number) => {
    const newAudioFiles = [...data.audioFiles];
    newAudioFiles.splice(index, 1);
    onChange({ ...data, audioFiles: newAudioFiles });
  };

  return (
    <div className="space-y-8">
      {/* Location Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
          <MapPinIcon className="w-5 h-5" />
          Location
        </h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter your location"
              value={data.location.address}
              onChange={(e) => onChange({
                ...data,
                location: { ...data.location, address: e.target.value }
              })}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={getCurrentLocation}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Use Current Location
            </button>
          </div>
          
          <div className="h-64 w-full rounded-lg overflow-hidden">
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
              <GoogleMap
                center={mapCenter}
                zoom={15}
                onClick={handleMapClick}
                mapContainerStyle={{ width: '100%', height: '100%' }}
              >
                {data.location.lat && data.location.lng && (
                  <Marker
                    position={{ lat: data.location.lat, lng: data.location.lng }}
                  />
                )}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </div>

      {/* Branding Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
          <SwatchIcon className="w-5 h-5" />
          Branding
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
            <div className="flex items-center gap-4">
              {data.branding.logo && (
                <Image
                  src={data.branding.logo}
                  alt="Logo"
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'logo')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <input
              type="color"
              value={data.branding.logoColor || '#000000'}
              onChange={(e) => onChange({
                ...data,
                branding: { ...data.branding, logoColor: e.target.value }
              })}
              className="mt-2"
            />
          </div>

          {/* Background */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
            <div className="flex items-center gap-4">
              {data.branding.backgroundImage && (
                <Image
                  src={data.branding.backgroundImage}
                  alt="Background"
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'background')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <input
              type="color"
              value={data.branding.backgroundColor || '#ffffff'}
              onChange={(e) => onChange({
                ...data,
                branding: { ...data.branding, backgroundColor: e.target.value }
              })}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
          <PhotoIcon className="w-5 h-5" />
          Images
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {data.images.map((image, index) => (
            <div key={index} className="relative group">
              <Image
                src={image}
                alt={`Uploaded image ${index + 1}`}
                width={200}
                height={200}
                className="rounded-lg object-cover w-full h-48"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <label className="block">
          <span className="sr-only">Choose images</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </label>
      </div>

      {/* Audio Files Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
          <MusicalNoteIcon className="w-5 h-5" />
          Audio Files
        </h3>
        <div className="space-y-2 mb-4">
          {data.audioFiles.map((audio, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <audio controls src={audio} className="w-full max-w-md" />
              <button
                onClick={() => removeAudio(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <label className="block">
          <span className="sr-only">Choose audio files</span>
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </label>
      </div>

      {/* Rich Text Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
          <DocumentTextIcon className="w-5 h-5" />
          Additional Information
        </h3>
        <textarea
          value={data.richText}
          onChange={(e) => onChange({ ...data, richText: e.target.value })}
          rows={6}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Add any additional information about yourself or your business..."
        />
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onComplete}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save and Complete
        </button>
      </div>
    </div>
  );
} 