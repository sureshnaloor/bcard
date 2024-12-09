'use client';

import { useState } from 'react';
import { IoDownloadOutline } from 'react-icons/io5';
import ThemeSwitcher from '@/components/ThemeSwitcher';    
interface VCardFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  organization: string;
  title: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website: string;
  notes: string;
  workPhone: string;
  homePhone: string;
  mobilePhone: string;
  fax: string;
  pager: string;
  department: string;
  secretary: string;
  photo: string;
  logo: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
  github: string;
  customFields: string;

}
export default function VCardGenerator() {
  const [formData, setFormData] = useState<VCardFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    organization: '',
    title: '',
    email: '',
    workPhone: '',
    homePhone: '',
    mobilePhone: '', 
    fax: '',
    pager: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    website: '',
    notes: '',
    department: '',
    secretary: '',
    photo: '',
    logo: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
    youtube: '',
    github: '',
    customFields: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateVCard = () => {
    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${formData.lastName};${formData.firstName};${formData.middleName};;`,
      `FN:${[formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ')}`,
      `ORG:${formData.organization}`,
      `TITLE:${formData.title}`,
      `EMAIL:${formData.email}`,
      ...(formData.workPhone ? [`TEL;TYPE=WORK:${formData.workPhone}`] : []),
      ...(formData.homePhone ? [`TEL;TYPE=HOME:${formData.homePhone}`] : []),
      ...(formData.mobilePhone ? [`TEL;TYPE=CELL:${formData.mobilePhone}`] : []),
      ...(formData.fax ? [`TEL;TYPE=FAX:${formData.fax}`] : []),
      ...(formData.pager ? [`TEL;TYPE=PAGER:${formData.pager}`] : []),
      `ADR:;;${formData.address};${formData.city};${formData.state};${formData.zipCode};${formData.country}`,
      `URL:${formData.website}`,
      `NOTE:${formData.notes}`,
      ...(formData.department ? [`ORG:${formData.department}`] : []),
      ...(formData.secretary ? [`ROLE:${formData.secretary}`] : []),
      ...(formData.photo ? [`PHOTO;ENCODING=BASE64;TYPE=JPEG:${formData.photo}`] : []),
      ...(formData.logo ? [`LOGO;ENCODING=BASE64;TYPE=JPEG:${formData.logo}`] : []),
      ...(formData.linkedin ? [`X-SOCIALPROFILE;TYPE=linkedin:${formData.linkedin}`] : []),
      ...(formData.twitter ? [`X-SOCIALPROFILE;TYPE=twitter:${formData.twitter}`] : []),
      ...(formData.facebook ? [`X-SOCIALPROFILE;TYPE=facebook:${formData.facebook}`] : []),
      ...(formData.instagram ? [`X-SOCIALPROFILE;TYPE=instagram:${formData.instagram}`] : []),
      ...(formData.youtube ? [`X-SOCIALPROFILE;TYPE=youtube:${formData.youtube}`] : []),
      ...(formData.github ? [`X-SOCIALPROFILE;TYPE=github:${formData.github}`] : []),
      ...(formData.customFields ? [`${formData.customFields}`] : []),
      'END:VCARD'
    ].join('\n');

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${formData.firstName}_${formData.lastName}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await convertToBase64(file);
        const fieldName = e.target.name;
        setFormData(prev => ({
          ...prev,
          [fieldName]: base64String
        }));
      } catch (error) {
        console.error('Error converting file to base64:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
      <ThemeSwitcher />
        <h1 className="text-2xl font-bold  text-gray-800 dark:text-white">
          vCard Generator
        </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-8">
          {/* Section 1: Contact Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b pb-2">
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  Work Phone
                </label>
                <input
                  type="tel"
                  name="workPhone"
                  value={formData.workPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  Mobile Phone
                </label>
                <input
                  type="tel"
                  name="mobilePhone"
                  value={formData.mobilePhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  Home Phone
                </label>
                <input
                  type="tel"
                  name="homePhone"
                  value={formData.homePhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  Fax
                </label>
                <input
                  type="tel"
                  name="fax"
                  value={formData.fax}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  Pager
                </label>
                <input
                  type="tel"
                  name="pager"
                  value={formData.pager}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Professional Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b pb-2">
              Professional Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  Secretary
                </label>
                <input
                  type="text"
                  name="secretary"
                  value={formData.secretary}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Media */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b pb-2">
              Media
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  Photo
                </label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-200"
                />
                {formData.photo && (
                  <div className="mt-2">
                    <img 
                      src={`data:image/jpeg;base64,${formData.photo}`}
                      alt="Profile Preview"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  Logo
                </label>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-200"
                />
                {formData.logo && (
                  <div className="mt-2">
                    <img 
                      src={`data:image/jpeg;base64,${formData.logo}`}
                      alt="Logo Preview"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Social Media */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b pb-2">
              Social Media
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  Twitter
                </label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  YouTube
                </label>
                <input
                  type="url"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                  GitHub
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Additional Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium italic text-gray-800/80 dark:text-gray-200/80 mb-1">
                Custom Fields
              </label>
              <textarea
                name="customFields"
                value={formData.customFields}
                onChange={handleInputChange}
                rows={3}
                placeholder="Add any additional fields in KEY:VALUE format, one per line"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-end">
            <button
              onClick={generateVCard}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <IoDownloadOutline className="w-5 h-5" />
              Generate vCard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}