import { ObjectId } from 'mongodb';

export interface DigiVCard {
  _id?: ObjectId;
  userId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  organization: string;
  title: string;
  email?: string;
  mobilePhone: string;
  workPhone?: string;
  homePhone?: string;
  fax?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  github?: string;
  notes?: string;
  isDefault: boolean;
  qrCodeUrl?: string;
  cardImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaData {
  location: {
    address: string;
    lat?: number;
    lng?: number;
    useCurrentLocation?: boolean;
  };
  branding: {
    logo?: string;
    logoColor?: string;
    backgroundImage?: string;
    backgroundColor?: string;
  };
  audioFiles: string[];
  images: string[];
  richText: string;
} 