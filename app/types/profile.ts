export interface Profile {
  _id?: string;
  email: string;
  name: string;
  position: string;
  companyName: string;
  linkedinUrl: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    landmark?: string;
  };
  birthday?: Date;
  anniversary?: Date;
  richContent: string;
  youtubeUrl?: string;
  updatedAt: Date;
} 