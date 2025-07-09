import axios from 'axios';
import { Event, EventAttendee, EventStats, EventStatus, EventType } from '../types/Event';
import {Item} from "../types/Item";
import config from "../config";

const API_BASE_URL = config.api.url + '/api';

export class EventService {
  static async getAllEvents(): Promise<Event[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`);
      return response.data;
    } catch (error) {
      console.error('Error loading events:', error);
      return [];
    }
  }

  static async getEventById(id: string): Promise<Event | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error loading event:', error);
      return null;
    }
  }

  static async saveEvent(eventData: any): Promise<Event> {
    try {
      console.log('EventService.saveEvent payload:', eventData); // DEBUG LOG
      const response = await axios.post(`${API_BASE_URL}/events`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error saving event:', error);
      throw new Error('Failed to save event');
    }
  }

  static async updateEvent(id: string, eventData: Partial<Event>): Promise<Event | null> {
    try {
      const response = await axios.put(`${API_BASE_URL}/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      return null;
    }
  }

  static async deleteEvent(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/events/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  }

  static async searchEvents(query: string): Promise<Event[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/search/${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching events:', error);
      return [];
    }
  }

  static async getEventsByStatus(status: EventStatus): Promise<Event[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/status/${encodeURIComponent(status)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching events by status:', error);
      return [];
    }
  }

  static async getEventsByType(type: EventType): Promise<Event[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/type/${encodeURIComponent(type)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching events by type:', error);
      return [];
    }
  }

  static async getEventsByDateRange(startDate: string, endDate: string): Promise<Event[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/date-range`, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching events by date range:', error);
      return [];
    }
  }

  static async getUpcomingEvents(limit?: number): Promise<Event[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/upcoming`, { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  }

  static async getActiveEvents(): Promise<Event[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active events:', error);
      return [];
    }
  }

  static async getAllAttendees(): Promise<EventAttendee[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/attendees`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendees:', error);
      return [];
    }
  }

  static async getAttendeesByEvent(eventId: string): Promise<EventAttendee[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${eventId}/attendees`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendees for event:', error);
      return [];
    }
  }

  static async registerAttendee(attendeeData: Omit<EventAttendee, 'id' | 'registrationDate'>): Promise<EventAttendee> {
    try {
      const response = await axios.post(`${API_BASE_URL}/events/attendees`, attendeeData);
      return response.data;
    } catch (error) {
      console.error('Error registering attendee:', error);
      throw new Error('Failed to register attendee');
    }
  }

  static async updateAttendeeStatus(attendeeId: string, status: EventAttendee['attendanceStatus']): Promise<boolean> {
    try {
      await axios.put(`${API_BASE_URL}/events/attendees/${attendeeId}/status`, { attendanceStatus: status });
      return true;
    } catch (error) {
      console.error('Error updating attendee status:', error);
      return false;
    }
  }

  static async removeAttendee(attendeeId: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/events/attendees/${attendeeId}`);
      return true;
    } catch (error) {
      console.error('Error removing attendee:', error);
      return false;
    }
  }

  static async getEventStats(): Promise<EventStats> {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event stats:', error);
      return {
        totalEvents: 0,
        activeEvents: 0,
        upcomingEvents: 0,
        completedEvents: 0,
        totalAttendees: 0,
        averageAttendance: 0,
        popularEventTypes: [],
        monthlyEventCount: [],
      };
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static async updateEventStatus(eventId: string, status: EventStatus): Promise<boolean> {
    try {
      await axios.post(`${API_BASE_URL}/events/${eventId}/status`, { status });
      return true;
    } catch (error) {
      console.error('Error updating event status:', error);
      return false;
    }
  }

  static async publishEvent(eventId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/events/${eventId}/publish`);
      return response.data;
    } catch (error) {
      console.error('Error publishing event:', error);
      return { success: false, message: 'Failed to publish event' };
    }
  }

  static async cancelEvent(eventId: string): Promise<boolean> {
    return this.updateEventStatus(eventId, 'Cancelled');
  }

  static async completeEvent(eventId: string): Promise<boolean> {
    return this.updateEventStatus(eventId, 'Completed');
  }

  static async addFeaturedItem(eventId: string, itemId: string): Promise<boolean> {
    try {
      await axios.post(`${API_BASE_URL}/events/${eventId}/featured-items`, { item_id: itemId });
      return true;
    } catch (error) {
      console.error('Error adding featured item:', error);
      return false;
    }
  }

  static async removeFeaturedItem(eventId: string, itemId: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/events/${eventId}/featured-items`, { data: { item_id: itemId } });
      return true;
    } catch (error) {
      console.error('Error removing featured item:', error);
      return false;
    }
  }

  static async setFeaturedItems(eventId: string, itemIds: string[]): Promise<boolean> {
    try {
      await axios.put(`${API_BASE_URL}/events/${eventId}`, { featuredItems: itemIds });
      return true;
    } catch (error) {
      console.error('Error setting featured items:', error);
      return false;
    }
  }

  static async canPublishEvent(eventId: string): Promise<{ canPublish: boolean; reasons: string[] }> {
    try {
      const event = await this.getEventById(eventId);
      if (!event) {
        return { canPublish: false, reasons: ['Event not found'] };
      }
      const reasons: string[] = [];
      if (!event.imageUrl) reasons.push('Event must have an image before it can be published');
      if (!event.title) reasons.push('Event must have a title');
      if (!event.description) reasons.push('Event must have a description');
      if (!event.startDate || !event.endDate) reasons.push('Event must have start and end dates');
      if (!event.location) reasons.push('Event must have a location');
      return { canPublish: reasons.length === 0, reasons };
    } catch (error) {
      console.error('Error validating event for publishing:', error);
      return { canPublish: false, reasons: ['Failed to validate event'] };
    }
  }

  static async publishEventWithValidation(eventId: string): Promise<{ success: boolean; message: string }> {
    try {
      const validation = await this.canPublishEvent(eventId);
      if (!validation.canPublish) {
        return { success: false, message: `Cannot publish event: ${validation.reasons.join(', ')}` };
      }
      return await this.publishEvent(eventId);
    } catch (error) {
      console.error('Error publishing event with validation:', error);
      return { success: false, message: 'Failed to publish event' };
    }
  }

  static async initializeSampleData(): Promise<void> {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`);
      if (response.data.length === 0) {
        // const savedShowItemsPreference = localStorage.getItem('gallery_show_items_preference');
        // const showItemsDefault = savedShowItemsPreference ? savedShowItemsPreference === 'true' : true;
        const sampleEvents: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>[] = [
          // ... (same sample events as in the original EventService.ts)
          // Note: Adjust featuredItems to valid item IDs from the API
        ];
        const savedEvents = await Promise.all(sampleEvents.map(event => this.saveEvent(event)));
        const contemporaryEvent = savedEvents.find(event => event.title === 'Contemporary Visions: New Acquisitions');
        if (contemporaryEvent) {
          const itemsResponse = await axios.get(`${API_BASE_URL}/items`);
          const featuredItemIds = itemsResponse.data
            .filter((item: Item) => ['The Starry Night', 'The Great Wave off Kanagawa', 'Girl with a Pearl Earring', 'Water Lilies'].includes(item.title))
            .map((item: Item) => item.id);
          if (featuredItemIds.length > 0) {
            await this.setFeaturedItems(contemporaryEvent.id, featuredItemIds);
          }
        }
      }
    } catch (error) {
      console.error('Error initializing sample event data:', error);
    }
  }
}