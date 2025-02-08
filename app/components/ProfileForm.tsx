import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import DatePicker from 'react-datepicker';
import type { SubmitHandler } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import LocationPicker from './LocationPicker';
import RichTextEditor from './RichTextEditor';

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
  birthday: Date;
  anniversary: Date;
  richContent: string;
  youtubeUrl: string;
}

export default function ProfileForm() {
  const [location, setLocation] = useState({ lat: 0, lng: 0, address: '' });
  
  const { register, handleSubmit, setValue, watch } = useForm<ProfileFormData>();

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      setValue('richContent', editor.getHTML());
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const response = await fetch('/api/cards/save-vcard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save');
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  const handleLocationSelect = (loc: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setLocation(loc);
  };

  const handleLocationSave = (savedLocation: {
    lat: number;
    lng: number;
    address: string;
    landmark?: string;
  }) => {
    setValue('location', savedLocation);
  };

  return (
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
            onLocationSelect={handleLocationSelect}
            onLocationSave={handleLocationSave}
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
  );
} 