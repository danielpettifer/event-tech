import axios from 'axios';
import { GallerySettings, Location, LogoImage, SocialMediaLinks, ContactInfo, BusinessHours } from '../types/GallerySettings';
import config from "../config";

const API_BASE_URL = config.api.url + '/api';

export class GallerySettingsService {
  static async getSettings(): Promise<GallerySettings | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/gallery-settings`);
      return response.data;
    } catch (error) {
      console.error('Error loading gallery settings:', error);
      return null;
    }
  }

  static async saveSettings(settings: GallerySettings): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/gallery-settings`, settings);
      window.dispatchEvent(new CustomEvent('gallerySettingsChanged', { detail: { type: 'settings', settings } }));
    } catch (error) {
      console.error('Error saving gallery settings:', error);
      throw new Error('Failed to save gallery settings');
    }
  }

  static async initializeDefaultSettings(): Promise<GallerySettings> {
    const savedShowItemsPreference = localStorage.getItem('gallery_show_items_preference');
    const showItemsDefault = savedShowItemsPreference ? savedShowItemsPreference === 'true' : true;
    const defaultSettings: GallerySettings = {
      id: 'settings_1',
      galleryName: 'Demo Gallery',
      primaryLocation: {
        id: 'loc_1',
        name: 'Main Gallery',
        addressLine1: '123 Art Street',
        addressLine2: '',
        city: 'London',
        state: '',
        postalCode: 'W1A 1AA',
        country: 'United Kingdom',
        phone: '+44 20 7946 0958',
        email: 'main@demogallery.com',
        isPrimary: true,
      },
      secondaryLocations: [],
      logoUrls: [{
        id: 'logo_1',
        url: '/BBFA_Logo_black_stacked.png',
        name: 'Default Logo',
        uploadDate: new Date().toISOString(),
        isActive: true,
      }],
      activeLogoId: 'logo_1',
      socialMedia: {
        website: 'https://demogallery.com',
        instagram: '',
        facebook: '',
        twitter: '',
        linkedin: '',
        pinterest: '',
        youtube: '',
        tiktok: '',
      },
      contactInfo: {
        email: 'info@demogallery.com',
        phone: '+44 20 7946 0958',
        website: 'https://demogallery.com',
      },
      businessHours: [
        { day: 'Monday', open: false, openTime: '10:00', closeTime: '18:00' },
        { day: 'Tuesday', open: true, openTime: '10:00', closeTime: '18:00' },
        { day: 'Wednesday', open: true, openTime: '10:00', closeTime: '18:00' },
        { day: 'Thursday', open: true, openTime: '10:00', closeTime: '18:00' },
        { day: 'Friday', open: true, openTime: '10:00', closeTime: '18:00' },
        { day: 'Saturday', open: true, openTime: '11:00', closeTime: '16:00' },
        { day: 'Sunday', open: false, openTime: '10:00', closeTime: '18:00' },
      ],
      showItemCards: showItemsDefault,
      defaultItemId: undefined,
      defaultImageUrl: undefined,
      activeEventId: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await this.saveSettings(defaultSettings);
    return defaultSettings;
  }

  static async getOrInitializeSettings(): Promise<GallerySettings> {
    const settings = await this.getSettings();
    return settings || await this.initializeDefaultSettings();
  }

  static async updateGalleryName(name: string): Promise<GallerySettings> {
    try {
      const response = await axios.put(`${API_BASE_URL}/gallery-settings/gallery-name`, { galleryName: name });
      return response.data;
    } catch (error) {
      console.error('Error updating gallery name:', error);
      throw new Error('Failed to update gallery name');
    }
  }

  static async updateContactInfo(contactInfo: Partial<ContactInfo>): Promise<GallerySettings> {
    try {
      const response = await axios.put(`${API_BASE_URL}/gallery-settings/contact-info`, { contactInfo });
      return response.data;
    } catch (error) {
      console.error('Error updating contact info:', error);
      throw new Error('Failed to update contact info');
    }
  }

  static async updatePrimaryLocation(location: Partial<Omit<Location, 'id' | 'isPrimary'>>): Promise<GallerySettings> {
    try {
      const response = await axios.put(`${API_BASE_URL}/gallery-settings/primary-location`, { primaryLocation: location });
      return response.data;
    } catch (error) {
      console.error('Error updating primary location:', error);
      throw new Error('Failed to update primary location');
    }
  }

  static async addSecondaryLocation(location: Omit<Location, 'id' | 'isPrimary'>): Promise<GallerySettings> {
    try {
      const response = await axios.post(`${API_BASE_URL}/gallery-settings/secondary-locations`, location);
      return response.data;
    } catch (error) {
      console.error('Error adding secondary location:', error);
      throw new Error('Failed to add secondary location');
    }
  }

  static async updateSecondaryLocation(locationId: string, updates: Partial<Omit<Location, 'id' | 'isPrimary'>>): Promise<GallerySettings> {
    try {
      const response = await axios.put(`${API_BASE_URL}/gallery-settings/secondary-locations/${locationId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating secondary location:', error);
      throw new Error('Failed to update secondary location');
    }
  }

  static async removeSecondaryLocation(locationId: string): Promise<GallerySettings> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/gallery-settings/secondary-locations/${locationId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing secondary location:', error);
      throw new Error('Failed to remove secondary location');
    }
  }

  static async addLogo(url: string, name: string): Promise<GallerySettings> {
    try {
      const response = await axios.post(`${API_BASE_URL}/gallery-settings/logos`, { url, name });
      window.dispatchEvent(new CustomEvent('gallerySettingsChanged', { detail: { type: 'logoAdded', logo: { id: `logo_${Date.now()}`, url, name } } }));
      return response.data;
    } catch (error) {
      console.error('Error adding logo:', error);
      throw new Error('Failed to add logo');
    }
  }

  static async setActiveLogo(logoId: string): Promise<GallerySettings> {
    try {
      const response = await axios.post(`${API_BASE_URL}/gallery-settings/logos/active`, { logo_id: logoId });
      window.dispatchEvent(new CustomEvent('gallerySettingsChanged', { detail: { type: 'logo', logoId } }));
      return response.data;
    } catch (error) {
      console.error('Error setting active logo:', error);
      throw new Error('Failed to set active logo');
    }
  }

  static async removeLogo(logoId: string): Promise<GallerySettings> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/gallery-settings/logos`, { data: { logo_id: logoId } });
      return response.data;
    } catch (error) {
      console.error('Error removing logo:', error);
      throw new Error('Failed to remove logo');
    }
  }

  static async updateSocialMedia(links: Partial<SocialMediaLinks>): Promise<GallerySettings> {
    try {
      const response = await axios.put(`${API_BASE_URL}/gallery-settings/social-media`, { socialMedia: links });
      return response.data;
    } catch (error) {
      console.error('Error updating social media:', error);
      throw new Error('Failed to update social media');
    }
  }

  static async updateBusinessHours(hours: BusinessHours[]): Promise<GallerySettings> {
    try {
      const response = await axios.put(`${API_BASE_URL}/gallery-settings/business-hours`, { businessHours: hours });
      return response.data;
    } catch (error) {
      console.error('Error updating business hours:', error);
      throw new Error('Failed to update business hours');
    }
  }

  static async updateBusinessHoursForDay(day: BusinessHours['day'], hours: Omit<BusinessHours, 'day'>): Promise<GallerySettings> {
    try {
      const settings = await this.getSettings();
      if (!settings) throw new Error('Settings not found');
      const updatedHours = settings.businessHours.map(h => h.day === day ? { ...h, ...hours } : h);
      return await this.updateBusinessHours(updatedHours);
    } catch (error) {
      console.error('Error updating business hours for day:', error);
      throw new Error('Failed to update business hours for day');
    }
  }

  static async getActiveLogo(): Promise<LogoImage | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/gallery-settings`);
      return response.data.logoUrls.find((logo: LogoImage) => logo.isActive) || null;
    } catch (error) {
      console.error('Error fetching active logo:', error);
      return null;
    }
  }

  static async getAllLogos(): Promise<LogoImage[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/gallery-settings`);
      return response.data.logoUrls || [];
    } catch (error) {
      console.error('Error fetching logos:', error);
      return [];
    }
  }

  static async getBusinessHoursForDay(day: BusinessHours['day']): Promise<BusinessHours | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/gallery-settings`);
      return response.data.businessHours.find((h: BusinessHours) => h.day === day) || null;
    } catch (error) {
      console.error('Error fetching business hours for day:', error);
      return null;
    }
  }

  static async isOpenOnDay(day: BusinessHours['day']): Promise<boolean> {
    try {
      const hours = await this.getBusinessHoursForDay(day);
      return hours?.open || false;
    } catch (error) {
      console.error('Error checking if open on day:', error);
      return false;
    }
  }

  static async getOpeningHours(day: BusinessHours['day']): Promise<{ openTime?: string; closeTime?: string } | null> {
    try {
      const hours = await this.getBusinessHoursForDay(day);
      if (!hours || !hours.open) return null;
      return { openTime: hours.openTime, closeTime: hours.closeTime };
    } catch (error) {
      console.error('Error fetching opening hours:', error);
      return null;
    }
  }

  static async exportSettings(): Promise<string> {
    try {
      const response = await axios.get(`${API_BASE_URL}/gallery-settings/export`);
      return JSON.stringify(response.data, null, 2);
    } catch (error) {
      console.error('Error exporting settings:', error);
      return '{}';
    }
  }

  static async importSettings(settingsJson: string): Promise<GallerySettings> {
    try {
      const settings = JSON.parse(settingsJson);
      const response = await axios.post(`${API_BASE_URL}/gallery-settings/import`, settings);
      return response.data;
    } catch (error) {
      console.error('Error importing settings:', error);
      throw new Error('Failed to import settings');
    }
  }

  static async resetToDefaults(): Promise<GallerySettings> {
    try {
      const response = await axios.post(`${API_BASE_URL}/gallery-settings/reset`);
      return response.data;
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw new Error('Failed to reset settings');
    }
  }

  static async updateShowItemCards(showItemCards: boolean): Promise<GallerySettings> {
    try {
      const response = await axios.put(`${API_BASE_URL}/gallery-settings/show-item-cards`, { showItemCards });
      localStorage.setItem('gallery_show_items_preference', showItemCards.toString());
      return response.data;
    } catch (error) {
      console.error('Error updating show item cards:', error);
      throw new Error('Failed to update show item cards');
    }
  }

  static async updateDefaultItem(itemId?: string): Promise<GallerySettings> {
    try {
      const response = await axios.put(`${API_BASE_URL}/gallery-settings/default-item`, { defaultItemId: itemId });
      return response.data;
    } catch (error) {
      console.error('Error updating default item:', error);
      throw new Error('Failed to update default item');
    }
  }

  static async updateDefaultImage(imageUrl?: string): Promise<GallerySettings> {
    try {
      const response = await axios.put(`${API_BASE_URL}/gallery-settings/default-image`, { defaultImageUrl: imageUrl });
      return response.data;
    } catch (error) {
      console.error('Error updating default image:', error);
      throw new Error('Failed to update default image');
    }
  }

  static async updateActiveEvent(eventId?: string): Promise<GallerySettings> {
    try {
      const response = await axios.put(`${API_BASE_URL}/gallery-settings/active-event`, { activeEventId: eventId });
      return response.data;
    } catch (error) {
      console.error('Error updating active event:', error);
      throw new Error('Failed to update active event');
    }
  }

  static async getShowItemCards(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/gallery-settings`);
      return response.data.showItemCards ?? true;
    } catch (error) {
      console.error('Error fetching show item cards:', error);
      return true;
    }
  }

  static async getDefaultItemId(): Promise<string | undefined> {
    try {
      const response = await axios.get(`${API_BASE_URL}/gallery-settings`);
      return response.data.defaultItemId;
    } catch (error) {
      console.error('Error fetching default item ID:', error);
      return undefined;
    }
  }

  static async getDefaultImageUrl(): Promise<string | undefined> {
    try {
      const response = await axios.get(`${API_BASE_URL}/gallery-settings`);
      return response.data.defaultImageUrl;
    } catch (error) {
      console.error('Error fetching default image URL:', error);
      return undefined;
    }
  }

  static async getActiveEventId(): Promise<string | undefined> {
    try {
      const response = await axios.get(`${API_BASE_URL}/gallery-settings`);
      return response.data.activeEventId;
    } catch (error) {
      console.error('Error fetching active event ID:', error);
      return undefined;
    }
  }
}