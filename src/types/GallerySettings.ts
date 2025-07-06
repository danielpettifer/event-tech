export interface GallerySettings {
  id: string;
  galleryName: string;
  primaryLocation: Location;
  secondaryLocations: Location[];
  logoUrls: LogoImage[];
  activeLogoId: string;
  socialMedia: SocialMediaLinks;
  contactInfo: ContactInfo;
  businessHours: BusinessHours[];
  // Frontend display settings
  showItemCards: boolean;
  defaultItemId?: string;
  defaultImageUrl?: string;
  activeEventId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
  isPrimary: boolean;
}

export interface LogoImage {
  id: string;
  url: string;
  name: string;
  uploadDate: string;
  isActive: boolean;
}

export interface SocialMediaLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  pinterest?: string;
  youtube?: string;
  tiktok?: string;
  website?: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  website?: string;
}

export interface BusinessHours {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  open: boolean;
  openTime?: string;
  closeTime?: string;
}

export const COUNTRIES = [
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Austria',
  'Ireland',
  'New Zealand',
  'Japan',
  'South Korea',
  'Singapore',
  'Other'
];

export const DAYS_OF_WEEK: BusinessHours['day'][] = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];
