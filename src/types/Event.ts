export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  eventType: EventType;
  status: EventStatus;
  maxAttendees?: number;
  currentAttendees: number;
  ticketPrice?: number;
  isTicketed: boolean;
  featuredArtists: string[];
  featuredArtworks: string[];
  tags: string[];
  imageUrl?: string;
  contactEmail: string;
  contactPhone?: string;
  specialInstructions?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EventType = 
  | 'Exhibition'
  | 'Opening Reception'
  | 'Artist Talk'
  | 'Workshop'
  | 'Private Viewing'
  | 'Auction'
  | 'Educational Tour'
  | 'Networking Event'
  | 'Fundraiser'
  | 'Other';

export type EventStatus = 
  | 'Draft'
  | 'Published'
  | 'Active'
  | 'Completed'
  | 'Cancelled'
  | 'Postponed';

export const EVENT_TYPES: EventType[] = [
  'Exhibition',
  'Opening Reception',
  'Artist Talk',
  'Workshop',
  'Private Viewing',
  'Auction',
  'Educational Tour',
  'Networking Event',
  'Fundraiser',
  'Other'
];

export const EVENT_STATUSES: EventStatus[] = [
  'Draft',
  'Published',
  'Active',
  'Completed',
  'Cancelled',
  'Postponed'
];

export const EVENT_TAGS = [
  'Contemporary Art',
  'Classical Art',
  'Modern Art',
  'Abstract',
  'Sculpture',
  'Photography',
  'Digital Art',
  'Mixed Media',
  'Painting',
  'Installation',
  'Performance Art',
  'Street Art',
  'Ceramics',
  'Textiles',
  'Jewelry',
  'Printmaking',
  'Drawing',
  'Watercolor',
  'Oil Painting',
  'Acrylic',
  'Emerging Artists',
  'Established Artists',
  'Local Artists',
  'International Artists',
  'Group Show',
  'Solo Show',
  'Themed Exhibition',
  'Seasonal',
  'Holiday Special',
  'Educational',
  'Family Friendly',
  'Adults Only',
  'VIP Event',
  'Charity',
  'Fundraising',
  'Community Outreach'
];

export interface EventAttendee {
  id: string;
  eventId: string;
  clientId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  ticketType?: string;
  registrationDate: string;
  attendanceStatus: 'Registered' | 'Attended' | 'No Show' | 'Cancelled';
  specialRequests?: string;
}

export interface EventStats {
  totalEvents: number;
  activeEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalAttendees: number;
  averageAttendance: number;
  popularEventTypes: { type: EventType; count: number; }[];
  monthlyEventCount: { month: string; count: number; }[];
}
