'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FileUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept: string;
  existingFiles?: string[];
  previewType?: 'image' | 'file';
}

export default function FileUploadField({
  label,
  value,
  onChange,
  accept,
  existingFiles = [],
  previewType = 'image'
}: FileUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectExisting = (fileUrl: string) => {
    onChange(fileUrl);
    setSelectedPreview(fileUrl);
    setShowGallery(false);
  };

  return (
    <div className="relative space-y-2">
      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
        {label}
      </label>
      
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          type="button"
          onClick={() => setShowGallery(!showGallery)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            showGallery 
              ? 'bg-teal-600 text-white' 
              : 'bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-100'
          }`}
        >
          {showGallery ? 'Close Gallery' : 'Choose Existing'}
        </button>
        
        <div className="relative">
          <input
            type="file"
            onChange={handleFileUpload}
            accept={accept}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <button
            type="button"
            className="px-3 py-1 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700"
          >
            Upload New
          </button>
        </div>
      </div>

      {isUploading && (
        <div className="text-sm text-teal-600 animate-pulse">
          Uploading...
        </div>
      )}

      {/* Current Selection Preview */}
      {value && (
        <div className="mt-2 p-2 border border-teal-200 dark:border-teal-800 rounded-md">
          <p className="text-sm font-medium mb-2">Current Selection:</p>
          {previewType === 'image' ? (
            <div className="relative h-32 w-32">
              <Image
                src={value}
                alt="Selected preview"
                fill
                className="object-contain rounded-md"
              />
            </div>
          ) : (
            <div className="text-sm text-teal-600">
              Selected: {value.split('/').pop()}
            </div>
          )}
        </div>
      )}

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Select {label}</h3>
              <button
                onClick={() => setShowGallery(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {existingFiles.map((fileUrl, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectExisting(fileUrl)}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    value === fileUrl 
                      ? 'border-teal-500 shadow-lg' 
                      : 'border-transparent hover:border-teal-300'
                  }`}
                >
                  {previewType === 'image' ? (
                    <div className="relative h-32 w-full">
                      <Image
                        src={fileUrl}
                        alt={`Gallery item ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-center">
                      {fileUrl.split('/').pop()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 