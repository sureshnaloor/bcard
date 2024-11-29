'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FileUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string, content?: string) => void;
  accept: string;
  existingFiles?: string[];
  previewType: 'image' | 'file';
  uploadOnly?: boolean;
  hideUpload?: boolean;
}

export default function FileUploadField({
  label,
  value,
  onChange,
  accept,
  existingFiles = [],
  previewType,
  uploadOnly = false,
  hideUpload = false
}: FileUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (accept === '.vcf') {
      const content = await file.text();
      onChange(file.name, content);
    } else {
      onChange(file.name);
    }
  };

  const handleSelectExisting = (fileUrl: string) => {
    onChange(fileUrl);
    setSelectedPreview(fileUrl);
    setShowGallery(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
        {label}
      </label>

      {!uploadOnly && existingFiles.length > 0 && (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-teal-200 dark:border-gray-600 
            bg-teal-100 dark:bg-gray-700 
            text-gray-900 dark:text-white 
            shadow-sm focus:border-teal-500 focus:ring-teal-500"
        >
          <option value="">Select existing</option>
          {existingFiles.map((file) => (
            <option key={file} value={file}>
              {file.split('/').pop()}
            </option>
          ))}
        </select>
      )}

      {!hideUpload && (accept === '.vcf' || !uploadOnly) && (
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 dark:text-gray-100
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-teal-50 dark:file:bg-gray-700 file:text-teal-700 dark:file:text-white
            hover:file:bg-teal-100 dark:hover:file:bg-gray-600"
        />
      )}

      {previewType === 'image' && value && (
        <div className="mt-2">
          <img
            src={value}
            alt={`Selected ${label}`}
            className="h-20 w-20 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
} 