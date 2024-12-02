'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import FileUploadField from '@/components/FileUploadField';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { IoAddCircleOutline, IoCloseCircleOutline } from 'react-icons/io5';

// Define field types
type FieldType = 'text' | 'date' | 'location' | 'document' | 'media';

interface CustomField {
  label: string;
  value: string;
  type: FieldType;
}

export default function CreateCard() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userId: '', 
    name: '',
    title: '',
    company: '',
    description: '',
    linkedin: '',
    linktree: '',
    website: '',
    logoUrl: '',
    bgImageUrl: '',
    vCardFileName: '',
    vCardContent: '',
  });
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [showMap, setShowMap] = useState<{ [key: number]: boolean }>({});
  const mapRefs = useRef<{ [key: number]: google.maps.Map | null }>({});
  const markerRefs = useRef<{ [key: number]: google.maps.Marker | null }>({});

  const existingLogos = [
    '/logos/babulogo.png',
    '/logos/jallogo.jpg',
  ];
  
  const existingBackgrounds = [
    '/backgrounds/businesscard.png',
    '/backgrounds/businesscardbg.jpg',
    '/backgrounds/id-card.png',
  ];
  
  const existingVCards = [
    '/vcards/sureshnaloor.vcf',
  ];

  const addCustomField = () => {
    setCustomFields([...customFields, { label: '', value: '', type: 'text' }]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  // Helper function to validate field value based on type
  const validateFieldValue = (type: FieldType, value: string): boolean => {
    switch (type) {
      case 'date':
        return !isNaN(Date.parse(value));
      case 'location':
        // Basic coordinate validation (lat,lng)
        const coords = value.split(',').map(Number);
        return coords.length === 2 && coords.every(n => !isNaN(n));
      case 'document':
      case 'media':
        // Basic URL validation
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      default:
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create the request body with custom fields
    const requestBody = {
      ...formData,
      customFields: customFields.filter(field => field.label && field.value) // Only include fields that have both label and value
    };

    console.log('Submitting data:', requestBody); // Debug log

    const response = await fetch('/api/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log('Response:', data); // Debug log

    if (data.shortId) {
      router.push(`/card/${data.shortId}`);
    }
  };

  const inputClassName = "mt-1 block w-full rounded-md border-teal-200 dark:border-gray-600 \
    bg-teal-100 dark:bg-gray-700 \
    text-gray-900 dark:text-white \
    shadow-sm focus:border-teal-500 focus:ring-teal-500 \
    py-2 px-4";

  const labelClassName = "block text-xs italic font-medium text-gray-600 dark:text-gray-400";

  // Add useEffect to handle map initialization
  useEffect(() => {
    customFields.forEach((field, index) => {
      if (showMap[index] && !mapRefs.current[index]) {
        const container = document.getElementById(`map-${index}`);
        if (container) {
          initMap(container, index);
        }
      }
    });
  }, [showMap, customFields]); // Add dependencies

  const handleMapClick = (index: number, event: google.maps.MapMouseEvent) => {
    const lat = event.latLng?.lat();
    const lng = event.latLng?.lng();
    if (lat && lng) {
      const newFields = [...customFields];
      newFields[index].value = `${lat},${lng}`;
      setCustomFields(newFields);

      // Update marker
      if (markerRefs.current[index]) {
        markerRefs.current[index]?.setPosition(event.latLng!);
      } else {
        markerRefs.current[index] = new google.maps.Marker({
          position: event.latLng!,
          map: mapRefs.current[index],
        });
      }
    }
  };

  const initMap = (container: HTMLElement, index: number) => {
    if (!window.google) {
      console.error('Google Maps not loaded');
      return;
    }

    const defaultLocation = { lat: 0, lng: 0 };
    const map = new google.maps.Map(container, {
      zoom: 2,
      center: defaultLocation,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });
    mapRefs.current[index] = map;

    map.addListener('click', (e) => handleMapClick(index, e));

    // If there's an existing value, show it on the map
    const field = customFields[index];
    if (field.value) {
      const [lat, lng] = field.value.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        const position = { lat, lng };
        map.setCenter(position);
        map.setZoom(15);
        markerRefs.current[index] = new google.maps.Marker({
          position,
          map,
        });
      }
    }
  };

  // Render input based on field type
  const renderFieldInput = (field: CustomField, index: number) => {
    const baseClassName = "mt-1 block w-full rounded-md border-blue-200 dark:border-blue-600 \
      bg-white dark:bg-gray-700 \
      text-gray-900 dark:text-white \
      shadow-sm focus:border-blue-500 focus:ring-blue-500 \
      py-2 px-4";

    switch (field.type) {
      case 'date':
        return (
          <input
            type="date"
            value={field.value}
            onChange={(e) => {
              const newFields = [...customFields];
              newFields[index].value = e.target.value;
              setCustomFields(newFields);
            }}
            className={baseClassName}
          />
        );
      case 'location':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={field.value}
              onChange={(e) => {
                const newFields = [...customFields];
                newFields[index].value = e.target.value;
                setCustomFields(newFields);
              }}
              placeholder="Latitude, Longitude"
              className={baseClassName}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                      const newFields = [...customFields];
                      newFields[index].value = `${position.coords.latitude},${position.coords.longitude}`;
                      setCustomFields(newFields);
                    });
                  }
                }}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Get Current Location
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMap(prev => ({
                    ...prev,
                    [index]: !prev[index]
                  }));
                }}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {showMap[index] ? 'Hide Map' : 'Choose on Map'}
              </button>
            </div>
            {showMap[index] && (
              <div 
                id={`map-${index}`}
                className="w-full h-64 rounded-lg shadow-md mt-2"
              />
            )}
          </div>
        );
      case 'document':
      case 'media':
        return (
          <input
            type="url"
            value={field.value}
            onChange={(e) => {
              const newFields = [...customFields];
              newFields[index].value = e.target.value;
              setCustomFields(newFields);
            }}
            placeholder={`Enter ${field.type} URL`}
            className={baseClassName}
          />
        );
      default:
        return (
          <input
            type="text"
            value={field.value}
            onChange={(e) => {
              const newFields = [...customFields];
              newFields[index].value = e.target.value;
              setCustomFields(newFields);
            }}
            placeholder="Enter value"
            className={baseClassName}
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-teal-50 dark:bg-gray-900 min-h-screen">
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">Create Business Card</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className={labelClassName}>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={inputClassName}
              required
            />
          </div>

          <div>
            <label className={labelClassName}>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className={inputClassName}
              required
            />
          </div>

          <div>
            <label className={labelClassName}>Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className={inputClassName}
              required
            />
          </div>

          <div>
            <label className={labelClassName}>LinkedIn</label>
            <input
              type="text"
              value={formData.linkedin}
              onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
              className={inputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>Website</label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
              className={inputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>Linktree</label>
            <input
              type="text"
              value={formData.linktree}
              onChange={(e) => setFormData({...formData, linktree: e.target.value})}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClassName}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className={`${inputClassName} py-3`}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FileUploadField
              label="Logo"
              value={formData.logoUrl}
              onChange={(url) => setFormData({...formData, logoUrl: url})}
              accept="image/*"
              existingFiles={existingLogos}
              previewType="image"
              uploadOnly={false}
            />

            <FileUploadField
              label="Background Image"
              value={formData.bgImageUrl}
              onChange={(url) => setFormData({...formData, bgImageUrl: url})}
              accept="image/*"
              existingFiles={existingBackgrounds}
              previewType="image"
              uploadOnly={false}
            />

            <FileUploadField
              label="vCard File"
              value={formData.vCardFileName}
              onChange={(fileName, content) => setFormData({
                ...formData, 
                vCardFileName: fileName,
                vCardContent: content || ''
              })}
              accept=".vcf"
              previewType="file"
              uploadOnly={true}
            />
          </div>

          <div className="space-y-4 mt-8">
            <div className="border border-blue-200/50 dark:border-blue-700/50 rounded-lg p-6 bg-blue-50/50 dark:bg-blue-900/20">
              <div className="flex items-center justify-between border-b border-blue-200 dark:border-blue-700 py-4 mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Other Optional Fields
                </h2>
                <button
                  type="button"
                  onClick={addCustomField}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium 
                    rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white
                    hover:from-blue-600 hover:to-indigo-600 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    shadow-md hover:shadow-lg"
                >
                  <IoAddCircleOutline className="h-5 w-5 mr-2" />
                  Add
                </button>
              </div>

              {customFields.map((field, index) => (
                <div key={index} className="flex gap-4 items-start mb-4">
                  <div className="flex-1">
                    <label className={labelClassName}>Field Label</label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => {
                        const newFields = [...customFields];
                        newFields[index].label = e.target.value;
                        setCustomFields(newFields);
                      }}
                      className={inputClassName}
                      placeholder="Enter field label"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className={labelClassName}>Field Type</label>
                    <select
                      value={field.type}
                      onChange={(e) => {
                        const newFields = [...customFields];
                        newFields[index].type = e.target.value as FieldType;
                        newFields[index].value = ''; // Reset value when type changes
                        setCustomFields(newFields);
                      }}
                      className={inputClassName}
                    >
                      <option value="text">Text</option>
                      <option value="date">Date</option>
                      <option value="location">Location</option>
                      <option value="document">Document</option>
                      <option value="media">Media</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className={labelClassName}>Field Value</label>
                    {renderFieldInput(field, index)}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCustomField(index)}
                    className="mt-6 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Remove field"
                  >
                    <IoCloseCircleOutline className="h-6 w-6" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white 
              py-3 px-4 rounded-md 
              hover:from-teal-600 hover:to-cyan-600 
              transition-all duration-200
              shadow-md hover:shadow-lg
              focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Create Card
          </button>
        </div>
      </form>
    </div>
  );
} 