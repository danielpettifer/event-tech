export interface Item {
  id: string;
  title: string;
  artist: string;
  medium: string;
  dimensions: string;
  year: number;
  price: number;
  currency: string;
  description: string;
  category: string;
  style: string;
  condition: string;
  provenance: string;
  location: string;
  status: 'Available' | 'Sold' | 'Reserved' | 'On Loan' | 'In Restoration' | 'Not for Sale';
  isFramed: boolean;
  frameDescription?: string;
  acquisitionDate: string;
  acquisitionPrice?: number;
  estimatedValue: number;
  insuranceValue: number;
  images: string[];
  thumbnailImage: string;
  tags: string[];
  exhibitions: string[];
  publications: string[];
  isPubliclyVisible: boolean;
  isFeatured: boolean;
  isLandingPageBackground?: boolean;
  landingPageDisplayOrder?: number;
  weight?: number;
  materials: string[];
  techniques: string[];
  edition?: string;
  signature: string;
  certificate: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemStats {
  totalItems: number;
  availableItems: number;
  soldItems: number;
  reservedItems: number;
  totalValue: number;
  averagePrice: number;
  topCategories: { category: string; count: number; }[];
  topArtists: { artist: string; count: number; }[];
  recentlyAdded: Item[];
}
