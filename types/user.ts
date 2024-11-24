import { ObjectId } from "mongodb";

export interface BusinessCard {
  _id?: string | ObjectId;
  userId?: string;
  name: string;
  title?: string;
  company?: string;
  description?: string;
  linkedin?: string;
  linktree?: string;
  website?: string;
  logoUrl?: string;
  bgImageUrl?: string;
} 