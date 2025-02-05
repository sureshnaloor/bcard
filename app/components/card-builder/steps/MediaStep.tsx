'use client';

import { useState } from 'react';
import { MediaData } from '@/types/card-types';
import Image from 'next/image';
import { MapPinIcon, MusicalNoteIcon, PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

interface MediaStepProps {
  data: MediaData;
  onChange: (data: MediaData) => void;
  onComplete: () => void;
}

export default function MediaStep({ data, onChange, onComplete }: MediaStepProps) {
  const [uploading, setUploading] = useState(false);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      location: {
        ...data.location,
        address: e.target.value,
      },
    });
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
        <input
          type="text"
          placeholder="Enter your location"
          value={data.location?.address || ''}
          onChange={handleLocationChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
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