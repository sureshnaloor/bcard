import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import DatePicker from 'react-datepicker';
import type { SubmitHandler } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import LocationPicker from './LocationPicker';
import RichTextEditor from './RichTextEditor';
import { useSession } from 'next-auth/react';
import GoogleMapsProvider from './GoogleMapsProvider';

interface ProfileFormData {
  name: string;
  position: string;
  companyName: string;
  linkedinUrl: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  birthday?: Date | null;
  anniversary?: Date | null;
  richContent: string;
  youtubeUrl: string;
}

export default function ProfileForm() {
  const { register, handleSubmit, setValue, watch } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      position: '',
      companyName: '',
      linkedinUrl: '',
      description: '',
      location: { lat: 0, lng: 0, address: '' },
      birthday: null,
      anniversary: null,
      richContent: '',
      youtubeUrl: ''
    }
  });

  const session = useSession();

  const onSubmit = async (data: ProfileFormData) => {
    try {
      console.log('Submitting data:', data); // Debug log
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          email: session?.data?.user?.email,
          linkedinUrl: data.linkedinUrl // Ensure linkedinUrl is included
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save profile');
      }
      
      const result = await response.json();
      console.log('Save result:', result); // Debug log
      
      // Show success message
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  // Use the form's watch function to debug field values
  useEffect(() => {
    const subscription = watch((value, { name, type }) => 
      console.log('Field changed:', name, value)
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <GoogleMapsProvider>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Basic Text Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <input
              {...register('position')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              {...register('companyName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
            <input
              {...register('linkedinUrl')}
              type="url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Special Input Fields */}
        <div className="space-y-6">
          {/* Location Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <LocationPicker 
              onLocationSelect={(location) => setValue('location', location)}
              onLocationSave={(location) => setValue('location', location)}
            />
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Birthday</label>
              <DatePicker
                selected={watch('birthday')}
                onChange={(date: Date | null) => date && setValue('birthday', date)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Anniversary</label>
              <DatePicker
                selected={watch('anniversary')}
                onChange={(date: Date | null) => date && setValue('anniversary', date)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Rich Content</label>
            <RichTextEditor
              onChange={(content) => setValue('richContent', content)}
            />
          </div>

          {/* YouTube URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">YouTube URL</label>
            <input
              {...register('youtubeUrl')}
              type="url"
              placeholder="https://youtube.com/..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save Profile
        </button>
      </form>
    </GoogleMapsProvider>
  );
} 