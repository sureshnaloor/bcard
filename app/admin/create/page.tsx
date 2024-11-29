'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

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
    vcardUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/cards', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (data.shortId) {
      router.push(`/card/${data.shortId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-teal-50 dark:bg-gray-900 min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">Create Business Card</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-teal-200 dark:border-gray-600 
                bg-teal-100 dark:bg-gray-700 
                text-gray-900 dark:text-white 
                shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="mt-1 block w-full rounded-md border-teal-200 dark:border-gray-600 
                bg-teal-100 dark:bg-gray-700 
                text-gray-900 dark:text-white 
                shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="mt-1 block w-full rounded-md border-teal-200 dark:border-gray-600 
                bg-teal-100 dark:bg-gray-700 
                text-gray-900 dark:text-white 
                shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">LinkedIn</label>
            <input
              type="text"
              value={formData.linkedin}
              onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
              className="mt-1 block w-full rounded-md border-teal-200 dark:border-gray-600 
                bg-teal-100 dark:bg-gray-700 
                text-gray-900 dark:text-white 
                shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Website</label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
              className="mt-1 block w-full rounded-md border-teal-200 dark:border-gray-600 
                bg-teal-100 dark:bg-gray-700 
                text-gray-900 dark:text-white 
                shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Linktree</label>
            <input
              type="text"
              value={formData.linktree}
              onChange={(e) => setFormData({...formData, linktree: e.target.value})}
              className="mt-1 block w-full rounded-md border-teal-200 dark:border-gray-600 
                bg-teal-100 dark:bg-gray-700 
                text-gray-900 dark:text-white 
                shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="mt-1 block w-full rounded-md border-teal-200 dark:border-gray-600 
                bg-teal-100 dark:bg-gray-700 
                text-gray-900 dark:text-white 
                shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Logo URL</label>
              <input
                type="text"
                value={formData.logoUrl}
                onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                className="mt-1 block w-full rounded-md border-teal-200 dark:border-gray-600 
                  bg-teal-100 dark:bg-gray-700 
                  text-gray-900 dark:text-white 
                  shadow-sm focus:border-teal-500 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Background Image URL</label>
              <input
                type="text"
                value={formData.bgImageUrl}
                onChange={(e) => setFormData({...formData, bgImageUrl: e.target.value})}
                className="mt-1 block w-full rounded-md border-teal-200 dark:border-gray-600 
                  bg-teal-100 dark:bg-gray-700 
                  text-gray-900 dark:text-white 
                  shadow-sm focus:border-teal-500 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">vCard URL</label>
              <input
                type="text"
                value={formData.vcardUrl}
                onChange={(e) => setFormData({...formData, vcardUrl: e.target.value})}
                className="mt-1 block w-full rounded-md border-teal-200 dark:border-gray-600 
                  bg-teal-100 dark:bg-gray-700 
                  text-gray-900 dark:text-white 
                  shadow-sm focus:border-teal-500 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 
              transition-colors focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Create Card
          </button>
        </div>
      </form>
    </div>
  );
} 