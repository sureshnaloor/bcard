export interface VCardData {
  // Personal Information
  firstName: string;
  middleName: string;
  lastName: string;
  
  // Professional Information
  organization: string;
  title: string;
  department?: string;
  
  // Contact Information
  email: string;
  mobilePhone: string;
  workPhone?: string;
  homePhone?: string;
  fax?: string;
  website?: string;
  
  // Address Information
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  
  // Social Media
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  github?: string;
  
  // Additional Information
  notes?: string;
  
  // System Fields
  isDefault?: boolean;
}

export interface MediaData {
  location: {
    lat?: number;
    lng?: number;
    address?: string;
  } | null;
  audioFiles: string[];
  images: string[];
  richText: string;
} 