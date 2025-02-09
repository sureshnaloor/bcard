import { ObjectId } from 'mongodb';

export function parseShortId(shortId: string): string {
  // Assuming shortId is 8 characters like '67a728cf'
  return shortId;
}

export function generateShortId(objectId: string): string {
  // Ensure objectId is a valid 24-character hex string
  if (objectId.length !== 24) {
    throw new Error('Invalid ObjectId length');
  }
  
  // Take first 4 characters and last 4 characters
  return objectId.slice(0, 4) + objectId.slice(-4);
}