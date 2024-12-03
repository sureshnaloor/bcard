import { ObjectId } from "mongodb";

export interface BusinessCard {
  _id: string;
  userId: string;
  name: string;
  title: string;
  company: string;
  description: string;
  linkedin?: string;
  linktree?: string;
  website?: string;
  logoUrl?: string;
  bgImageUrl?: string;
  vCardContent?: string;
  vCardFileName?: string;
  customFields?: Array<{
    label: string;
    value: string;
    type: 'text' | 'date' | 'location' | 'document' | 'media';
  }>;
  logoColor?: string;
  bgColor?: string | string[];
} 