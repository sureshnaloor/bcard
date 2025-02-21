export interface VCardData {
  // Name components
  lastName?: string
  firstName?: string
  middleName?: string
  namePrefix?: string
  nameSuffix?: string
  
  // Organization
  organization?: string
  title?: string
  role?: string
  
  // Contact
  workEmail?: string
  personalEmail?: string
  mobilePhone?: string
  workPhone?: string
  homePhone?: string
  fax?: string
  
  // Address components
  workStreet?: string
  workCity?: string
  workState?: string
  workPostalCode?: string
  workCountry?: string
  
  homeStreet?: string
  homeCity?: string
  homeState?: string
  homePostalCode?: string
  homeCountry?: string
  
  // Online
  website?: string
  linkedin?: string
  twitter?: string
  facebook?: string
  instagram?: string
  youtube?: string
  github?: string
  
  // Additional
  birthday?: string
  notes?: string
  
  // Media (stored as URLs or Base64)
  photoUrl?: string
  logoUrl?: string
} 