'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoAddCircleOutline, IoCloseCircleOutline } from 'react-icons/io5';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import FileUploadField from '@/components/FileUploadField';
import ColorPaletteSelector from '@/components/ColorPaletteSelector';

interface CustomField {
  label: string;
  value: string;
  type: 'text' | 'date' | 'location' | 'document' | 'media';
}

export default function EditCard({ params }: { params: { userid: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customFields, setCustomFields] = useState<CustomField[]>([
    { label: '', value: '', type: 'text' }
  ]);
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
    logoColor: '',
    bgColor: '',
  });
  const [logoColor, setLogoColor] = useState<string>('');
  const [bgColor, setBgColor] = useState<string | string[]>('');

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

  useEffect(() => {
    const fetchCard = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/cards/user/${params.userid}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch card: ${response.statusText}`);
        }
        
        const cardData = await response.json();
        
        setFormData({
          userId: cardData.userId || '',
          name: cardData.name || '',
          title: cardData.title || '',
          company: cardData.company || '',
          description: cardData.description || '',
          linkedin: cardData.linkedin || '',
          linktree: cardData.linktree || '',
          website: cardData.website || '',
          logoUrl: cardData.logoUrl || '',
          bgImageUrl: cardData.bgImageUrl || '',
          vCardFileName: cardData.vCardFileName || '',
          vCardContent: cardData.vCardContent || '',
          logoColor: cardData.logoColor || '',
          bgColor: cardData.bgColor || '',
        });

        if (cardData.customFields && cardData.customFields.length > 0) {
          setCustomFields(cardData.customFields);
        }

      } catch (err) {
        console.error('Error fetching card:', err);
        setError(err instanceof Error ? err.message : 'Failed to load card');
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [params.userid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/cards/user/${params.userid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          customFields: customFields.filter(field => field.label && field.value)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update card');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Error updating card:', err);
      setError(err instanceof Error ? err.message : 'Failed to update card');
    }
  };

  // Custom fields handlers
  const handleCustomFieldChange = (index: number, field: 'label' | 'value', value: string) => {
    setCustomFields(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { label: '', value: '', type: 'text' }]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(prev => prev.filter((_, i) => i !== index));
  };

  const renderFieldInput = (field: CustomField, index: number) => {
    const baseClassName = "w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700";

    switch (field.type) {
      case 'date':
        return (
          <input
            type="date"
            value={field.value}
            onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
            className={baseClassName}
          />
        );
      case 'location':
        return (
          <input
            type="text"
            value={field.value}
            onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
            placeholder="Latitude, Longitude"
            className={baseClassName}
          />
        );
      case 'document':
      case 'media':
        return (
          <input
            type="url"
            value={field.value}
            onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
            placeholder={`Enter ${field.type} URL`}
            className={baseClassName}
          />
        );
      default:
        return (
          <input
            type="text"
            value={field.value}
            onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
            placeholder="Enter value"
            className={baseClassName}
          />
        );
    }
  };

  const handleColorSelect = (color: string | string[], type: 'logo' | 'bg', e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (type === 'logo') {
      setLogoColor(color as string);
      setFormData(prev => ({ ...prev, logoUrl: '', logoColor: color as string }));
    } else {
      setBgColor(color as string);
      setFormData(prev => ({ ...prev, bgImageUrl: '', bgColor: color as string }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={() => router.push('/admin/dashboard')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <>
    <ThemeSwitcher />
    <div className="max-w-4xl mx-auto p-6">
      
      <h1 className="text-2xl font-bold mb-6">Edit Business Card</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Linktree</label>
            <input
              type="url"
              name="linktree"
              value={formData.linktree}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
          />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-300">Logo</h3>
              
              <FileUploadField
                label="Logo Image"
                value={formData.logoUrl || ''}
                onChange={(url) => setFormData({...formData, logoUrl: url})}
                accept="image/*"
                existingFiles={existingLogos}
                previewType="image"
              />

              <div className="mt-4">
                <ColorPaletteSelector
                  onSelect={(colors: string | string[]) => handleColorSelect(colors, 'logo')}
                  type="solid"
                  label="Or choose a color for logo"
                  currentColor={formData.logoColor}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-300">Background</h3>
              
              <FileUploadField
                label="Background Image"
                value={formData.bgImageUrl || ''}
                onChange={(url) => setFormData({...formData, bgImageUrl: url})}
                accept="image/*"
                existingFiles={existingBackgrounds}
                previewType="image"
              />

              <div className="mt-4">
                <ColorPaletteSelector
                  onSelect={(colors) => handleColorSelect(colors, 'bg')}
                  type="solid"
                  label="Or choose a background color"
                  currentColor={formData.bgColor}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-300">vCard</h3>
              
              <FileUploadField
                label="vCard File"
                value={formData.vCardFileName}
                onChange={(fileName, content) => setFormData({
                  ...formData, 
                  vCardFileName: fileName,
                  vCardContent: content || ''
                })}
                accept=".vcf"
                existingFiles={existingVCards}
                previewType="file"
                uploadOnly={true}
              />
            </div>
          </div>
        </div>

        {/* Custom Fields Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Custom Fields
            </h3>
            <button
              type="button"
              onClick={addCustomField}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
            >
              <IoAddCircleOutline className="w-5 h-5" />
              Add Field
            </button>
          </div>

          {customFields.map((field, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Label"
                  value={field.label}
                  onChange={(e) => handleCustomFieldChange(index, 'label', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                />
              </div>
              
              <div className="flex-1">
                <select
                  value={field.type}
                  onChange={(e) => {
                    const newFields = [...customFields];
                    newFields[index] = {
                      ...newFields[index],
                      type: e.target.value as CustomField['type'],
                      value: '' // Reset value when type changes
                    };
                    setCustomFields(newFields);
                  }}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                >
                  <option value="text">Text</option>
                  <option value="date">Date</option>
                  <option value="location">Location</option>
                  <option value="document">Document</option>
                  <option value="media">Media</option>
                </select>
              </div>

              <div className="flex-1">
                {renderFieldInput(field, index)}
              </div>

              <button
                type="button"
                onClick={() => removeCustomField(index)}
                className="text-red-500 hover:text-red-600"
              >
                <IoCloseCircleOutline className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
    </>
  );
}