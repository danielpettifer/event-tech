import { Event, EventAttendee, EventStats, EventStatus, EventType } from '../types/Event';

export class EventService {
  private static readonly STORAGE_KEY = 'gallery_events';
  private static readonly ATTENDEES_STORAGE_KEY = 'gallery_event_attendees';

  // Event CRUD Operations
  static getAllEvents(): Event[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static getEventById(id: string): Event | null {
    const events = this.getAllEvents();
    return events.find(event => event.id === id) || null;
  }

  static saveEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Event {
    const events = this.getAllEvents();
    const newEvent: Event = {
      ...eventData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    events.push(newEvent);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
    return newEvent;
  }

  static updateEvent(id: string, eventData: Partial<Event>): Event | null {
    const events = this.getAllEvents();
    const index = events.findIndex(event => event.id === id);
    
    if (index === -1) return null;
    
    events[index] = {
      ...events[index],
      ...eventData,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
    return events[index];
  }

  static deleteEvent(id: string): boolean {
    const events = this.getAllEvents();
    const filteredEvents = events.filter(event => event.id !== id);
    
    if (filteredEvents.length === events.length) return false;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredEvents));
    
    // Also remove associated attendees
    const attendees = this.getAllAttendees();
    const filteredAttendees = attendees.filter(attendee => attendee.eventId !== id);
    localStorage.setItem(this.ATTENDEES_STORAGE_KEY, JSON.stringify(filteredAttendees));
    
    return true;
  }

  // Event Filtering and Search
  static searchEvents(query: string): Event[] {
    const events = this.getAllEvents();
    const searchTerm = query.toLowerCase();
    
    return events.filter(event =>
      event.title.toLowerCase().includes(searchTerm) ||
      event.description.toLowerCase().includes(searchTerm) ||
      event.location.toLowerCase().includes(searchTerm) ||
      event.eventType.toLowerCase().includes(searchTerm) ||
      event.featuredArtists.some(artist => artist.toLowerCase().includes(searchTerm)) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  static getEventsByStatus(status: EventStatus): Event[] {
    const events = this.getAllEvents();
    return events.filter(event => event.status === status);
  }

  static getEventsByType(type: EventType): Event[] {
    const events = this.getAllEvents();
    return events.filter(event => event.eventType === type);
  }

  static getEventsByDateRange(startDate: string, endDate: string): Event[] {
    const events = this.getAllEvents();
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const rangeStart = new Date(startDate);
      const rangeEnd = new Date(endDate);
      return eventStart >= rangeStart && eventStart <= rangeEnd;
    });
  }

  static getUpcomingEvents(limit?: number): Event[] {
    const events = this.getAllEvents();
    const now = new Date();
    const upcoming = events
      .filter(event => {
        const eventStart = new Date(event.startDate);
        return eventStart > now && (event.status === 'Published' || event.status === 'Active');
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    return limit ? upcoming.slice(0, limit) : upcoming;
  }

  static getActiveEvents(): Event[] {
    const events = this.getAllEvents();
    const now = new Date();
    
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return eventStart <= now && eventEnd >= now && event.status === 'Active';
    });
  }

  // Attendee Management
  static getAllAttendees(): EventAttendee[] {
    const stored = localStorage.getItem(this.ATTENDEES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static getAttendeesByEvent(eventId: string): EventAttendee[] {
    const attendees = this.getAllAttendees();
    return attendees.filter(attendee => attendee.eventId === eventId);
  }

  static registerAttendee(attendeeData: Omit<EventAttendee, 'id' | 'registrationDate'>): EventAttendee {
    const attendees = this.getAllAttendees();
    const newAttendee: EventAttendee = {
      ...attendeeData,
      id: this.generateId(),
      registrationDate: new Date().toISOString()
    };
    
    attendees.push(newAttendee);
    localStorage.setItem(this.ATTENDEES_STORAGE_KEY, JSON.stringify(attendees));
    
    // Update event attendee count
    const event = this.getEventById(attendeeData.eventId);
    if (event) {
      this.updateEvent(event.id, { currentAttendees: event.currentAttendees + 1 });
    }
    
    return newAttendee;
  }

  static updateAttendeeStatus(attendeeId: string, status: EventAttendee['attendanceStatus']): boolean {
    const attendees = this.getAllAttendees();
    const index = attendees.findIndex(attendee => attendee.id === attendeeId);
    
    if (index === -1) return false;
    
    attendees[index].attendanceStatus = status;
    localStorage.setItem(this.ATTENDEES_STORAGE_KEY, JSON.stringify(attendees));
    return true;
  }

  static removeAttendee(attendeeId: string): boolean {
    const attendees = this.getAllAttendees();
    const attendee = attendees.find(a => a.id === attendeeId);
    
    if (!attendee) return false;
    
    const filteredAttendees = attendees.filter(a => a.id !== attendeeId);
    localStorage.setItem(this.ATTENDEES_STORAGE_KEY, JSON.stringify(filteredAttendees));
    
    // Update event attendee count
    const event = this.getEventById(attendee.eventId);
    if (event && event.currentAttendees > 0) {
      this.updateEvent(event.id, { currentAttendees: event.currentAttendees - 1 });
    }
    
    return true;
  }

  // Statistics and Analytics
  static getEventStats(): EventStats {
    const events = this.getAllEvents();
    const attendees = this.getAllAttendees();
    const now = new Date();

    const activeEvents = events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return eventStart <= now && eventEnd >= now && event.status === 'Active';
    });

    const upcomingEvents = events.filter(event => {
      const eventStart = new Date(event.startDate);
      return eventStart > now && (event.status === 'Published' || event.status === 'Active');
    });

    const completedEvents = events.filter(event => event.status === 'Completed');

    // Calculate popular event types
    const typeCount: Record<EventType, number> = {} as Record<EventType, number>;
    events.forEach(event => {
      typeCount[event.eventType] = (typeCount[event.eventType] || 0) + 1;
    });

    const popularEventTypes = Object.entries(typeCount)
      .map(([type, count]) => ({ type: type as EventType, count }))
      .sort((a, b) => b.count - a.count);

    // Calculate monthly event count for the last 12 months
    const monthlyEventCount: { month: string; count: number; }[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const count = events.filter(event => 
        event.createdAt.slice(0, 7) === monthKey
      ).length;
      
      monthlyEventCount.push({ month: monthName, count });
    }

    const totalAttendees = attendees.length;
    const averageAttendance = events.length > 0 
      ? events.reduce((sum, event) => sum + event.currentAttendees, 0) / events.length 
      : 0;

    return {
      totalEvents: events.length,
      activeEvents: activeEvents.length,
      upcomingEvents: upcomingEvents.length,
      completedEvents: completedEvents.length,
      totalAttendees,
      averageAttendance: Math.round(averageAttendance * 100) / 100,
      popularEventTypes,
      monthlyEventCount
    };
  }

  // Utility Methods
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static initializeSampleData(): void {
    const existingEvents = this.getAllEvents();
    if (existingEvents.length > 0) return;

    // Check if we have a saved showItems preference in localStorage
    const savedShowItemsPreference = localStorage.getItem('gallery_show_items_preference');
    const showItemsDefault = savedShowItemsPreference ? savedShowItemsPreference === 'true' : true;

    const sampleEvents: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        title: "Contemporary Visions: New Acquisitions",
        description: "Explore our latest contemporary art acquisitions featuring works by emerging and established artists from around the world.",
        startDate: "2025-01-15",
        endDate: "2025-03-15",
        startTime: "10:00",
        endTime: "18:00",
        location: "Main Gallery - Ground Floor",
        eventType: "Exhibition",
        status: "Active",
        maxAttendees: 200,
        currentAttendees: 45,
        ticketPrice: 0,
        isTicketed: false,
        featuredArtists: ["Maria Rodriguez", "James Chen", "Aisha Patel"],
        featuredArtworks: ["Urban Dreams", "Digital Landscapes", "Abstract Emotions"],
        featuredItems: [], // Will be populated in the saveEvent method below
        showItems: showItemsDefault, // Use saved preference or default to true
        tags: ["Contemporary Art", "New Acquisitions", "Mixed Media", "International Artists"],
        contactEmail: "events@gallery.com",
        contactPhone: "+44 20 7123 4567",
        isPublic: true,
        imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&h=600&fit=crop"
        ],
        backgroundImages: [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop",
          "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=1920&h=1080&fit=crop",
          "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=1080&fit=crop",
          "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=1920&h=1080&fit=crop"
        ]
      },
      {
        title: "Opening Reception: Contemporary Visions",
        description: "Join us for the opening reception of our new exhibition featuring wine, canapés, and artist talks.",
        startDate: "2025-01-15",
        endDate: "2025-01-15",
        startTime: "18:00",
        endTime: "21:00",
        location: "Main Gallery - Ground Floor",
        eventType: "Opening Reception",
        status: "Published",
        maxAttendees: 150,
        currentAttendees: 89,
        ticketPrice: 25,
        isTicketed: true,
        featuredArtists: ["Maria Rodriguez", "James Chen"],
        featuredArtworks: [],
        featuredItems: [],
        tags: ["Opening Reception", "Wine", "Artist Talk", "Networking"],
        contactEmail: "events@gallery.com",
        contactPhone: "+44 20 7123 4567",
        specialInstructions: "Smart casual dress code. Please arrive 15 minutes early for check-in.",
        isPublic: true
      },
      {
        title: "Artist Workshop: Abstract Painting Techniques",
        description: "Learn abstract painting techniques from renowned artist Maria Rodriguez in this hands-on workshop.",
        startDate: "2025-01-25",
        endDate: "2025-01-25",
        startTime: "14:00",
        endTime: "17:00",
        location: "Education Studio - First Floor",
        eventType: "Workshop",
        status: "Published",
        maxAttendees: 20,
        currentAttendees: 16,
        ticketPrice: 75,
        isTicketed: true,
        featuredArtists: ["Maria Rodriguez"],
        featuredArtworks: [],
        featuredItems: [],
        tags: ["Workshop", "Abstract", "Painting", "Educational", "Hands-on"],
        contactEmail: "education@gallery.com",
        contactPhone: "+44 20 7123 4568",
        specialInstructions: "All materials provided. Please wear clothes you don't mind getting paint on.",
        isPublic: true
      },
      {
        title: "Private Viewing: VIP Collectors",
        description: "Exclusive private viewing for our VIP collectors and patrons.",
        startDate: "2025-02-01",
        endDate: "2025-02-01",
        startTime: "19:00",
        endTime: "22:00",
        location: "Private Viewing Room",
        eventType: "Private Viewing",
        status: "Draft",
        maxAttendees: 30,
        currentAttendees: 0,
        ticketPrice: 0,
        isTicketed: false,
        featuredArtists: [],
        featuredArtworks: [],
        featuredItems: [],
        tags: ["VIP Event", "Private", "Collectors", "Exclusive"],
        contactEmail: "vip@gallery.com",
        specialInstructions: "Invitation only. Formal dress code.",
        isPublic: false
      },
      {
        title: "Masterpieces Through Time",
        description: "A comprehensive exhibition showcasing iconic artworks from different periods, featuring Van Gogh, Hokusai, Vermeer, and other masters.",
        startDate: "2025-02-15",
        endDate: "2025-05-15",
        startTime: "10:00",
        endTime: "18:00",
        location: "Main Gallery - All Floors",
        eventType: "Exhibition",
        status: "Published",
        maxAttendees: 300,
        currentAttendees: 127,
        ticketPrice: 15,
        isTicketed: true,
        featuredArtists: ["Vincent van Gogh", "Katsushika Hokusai", "Johannes Vermeer", "Claude Monet", "Sandro Botticelli", "Grant Wood"],
        featuredArtworks: ["The Starry Night", "The Great Wave off Kanagawa", "Girl with a Pearl Earring", "Water Lilies", "The Birth of Venus", "American Gothic"],
        featuredItems: [],
        tags: ["Masterpieces", "Historical", "Multi-Period", "Featured Exhibition", "International Artists", "Classical Art"],
        contactEmail: "exhibitions@gallery.com",
        contactPhone: "+44 20 7123 4567",
        specialInstructions: "Audio guides available in multiple languages. Photography permitted without flash.",
        isPublic: true
      }
    ];

    // Save all events first
    const savedEvents = sampleEvents.map(eventData => this.saveEvent(eventData));
    
    // Now let's add featured items to the Contemporary Visions event
    // We need to do this after saving because we need the item IDs from ItemService
    import('../services/ItemService').then(module => {
      const ItemService = module.ItemService;
      
      // Initialize items if needed
      ItemService.initializeSampleData();
      
      // Get all items
      const items = ItemService.getAllItems();
      
      // Find the Contemporary Visions event
      const contemporaryEvent = savedEvents.find(event => event.title === "Contemporary Visions: New Acquisitions");
      
      if (contemporaryEvent) {
        // Get IDs of specific items
        const featuredItemIds = items
          .filter(item => 
            ["The Starry Night", "The Great Wave off Kanagawa", "Girl with a Pearl Earring", "Water Lilies"]
            .includes(item.title)
          )
          .map(item => item.id);
        
        // Update the event with featured items
        if (featuredItemIds.length > 0) {
          this.updateEvent(contemporaryEvent.id, { featuredItems: featuredItemIds });
          console.log(`Added ${featuredItemIds.length} featured items to Contemporary Visions event`);
        }
      }
    }).catch(error => {
      console.error("Error setting up featured items:", error);
    });
  }

  // Event Status Management
  static updateEventStatus(eventId: string, status: EventStatus): boolean {
    const event = this.getEventById(eventId);
    if (!event) return false;

    this.updateEvent(eventId, { status });
    return true;
  }

  static publishEvent(eventId: string): boolean {
    return this.updateEventStatus(eventId, 'Published');
  }

  static cancelEvent(eventId: string): boolean {
    return this.updateEventStatus(eventId, 'Cancelled');
  }

  static completeEvent(eventId: string): boolean {
    return this.updateEventStatus(eventId, 'Completed');
  }

  // Featured Items Management
  static addFeaturedItem(eventId: string, itemId: string): boolean {
    const event = this.getEventById(eventId);
    if (!event) return false;

    if (!event.featuredItems.includes(itemId)) {
      const updatedFeaturedItems = [...event.featuredItems, itemId];
      this.updateEvent(eventId, { featuredItems: updatedFeaturedItems });
      return true;
    }
    return false;
  }

  static removeFeaturedItem(eventId: string, itemId: string): boolean {
    const event = this.getEventById(eventId);
    if (!event) return false;

    const updatedFeaturedItems = event.featuredItems.filter(id => id !== itemId);
    this.updateEvent(eventId, { featuredItems: updatedFeaturedItems });
    return true;
  }

  static setFeaturedItems(eventId: string, itemIds: string[]): boolean {
    const event = this.getEventById(eventId);
    if (!event) return false;

    this.updateEvent(eventId, { featuredItems: itemIds });
    return true;
  }

  // Event Publishing Validation
  static canPublishEvent(eventId: string): { canPublish: boolean; reasons: string[] } {
    const event = this.getEventById(eventId);
    if (!event) return { canPublish: false, reasons: ['Event not found'] };

    const reasons: string[] = [];

    // Check if event has an image
    if (!event.imageUrl || event.imageUrl.trim() === '') {
      reasons.push('Event must have an image before it can be published');
    }

    // Check if event has basic required information
    if (!event.title || event.title.trim() === '') {
      reasons.push('Event must have a title');
    }

    if (!event.description || event.description.trim() === '') {
      reasons.push('Event must have a description');
    }

    if (!event.startDate || !event.endDate) {
      reasons.push('Event must have start and end dates');
    }

    if (!event.location || event.location.trim() === '') {
      reasons.push('Event must have a location');
    }

    return {
      canPublish: reasons.length === 0,
      reasons
    };
  }

  static publishEventWithValidation(eventId: string): { success: boolean; message: string } {
    const validation = this.canPublishEvent(eventId);
    
    if (!validation.canPublish) {
      return {
        success: false,
        message: `Cannot publish event: ${validation.reasons.join(', ')}`
      };
    }

    const success = this.publishEvent(eventId);
    return {
      success,
      message: success ? 'Event published successfully' : 'Failed to publish event'
    };
  }
}
