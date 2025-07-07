import { GallerySettings, Location, LogoImage, SocialMediaLinks, ContactInfo, BusinessHours, DAYS_OF_WEEK } from '../types/GallerySettings';

export class GallerySettingsService {
  private static readonly STORAGE_KEY = 'gallery_settings';

  static getSettings(): GallerySettings | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading gallery settings:', error);
      return null;
    }
  }

  static saveSettings(settings: GallerySettings): void {
    try {
      settings.updatedAt = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
      
      // Dispatch a custom event to notify other components of the change
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('gallerySettingsChanged', {
          detail: { type: 'settings', settings }
        }));
      }
    } catch (error) {
      console.error('Error saving gallery settings:', error);
      throw new Error('Failed to save gallery settings');
    }
  }

  static initializeDefaultSettings(): GallerySettings {
    // Check if we have a saved showItems preference in localStorage
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
        isPrimary: true
      },
      secondaryLocations: [],
      logoUrls: [{
        id: 'logo_1',
        url: 'https://via.placeholder.com/200x100/4A90E2/FFFFFF?text=Demo+Gallery',
        name: 'Default Logo',
        uploadDate: new Date().toISOString(),
        isActive: true
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
        tiktok: ''
      },
      contactInfo: {
        email: 'info@demogallery.com',
        phone: '+44 20 7946 0958',
        website: 'https://demogallery.com'
      },
      businessHours: [
        { day: 'Monday', open: false, openTime: '10:00', closeTime: '18:00' },
        { day: 'Tuesday', open: true, openTime: '10:00', closeTime: '18:00' },
        { day: 'Wednesday', open: true, openTime: '10:00', closeTime: '18:00' },
        { day: 'Thursday', open: true, openTime: '10:00', closeTime: '18:00' },
        { day: 'Friday', open: true, openTime: '10:00', closeTime: '18:00' },
        { day: 'Saturday', open: true, openTime: '11:00', closeTime: '16:00' },
        { day: 'Sunday', open: false, openTime: '10:00', closeTime: '18:00' }
      ],
      // Frontend display settings - use the saved preference or default to true
      showItemCards: showItemsDefault,
      defaultItemId: undefined,
      defaultImageUrl: undefined,
      activeEventId: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveSettings(defaultSettings);
    return defaultSettings;
  }

  static getOrInitializeSettings(): GallerySettings {
    const settings = this.getSettings();
    return settings || this.initializeDefaultSettings();
  }

  static updateGalleryName(name: string): GallerySettings {
    const settings = this.getOrInitializeSettings();
    settings.galleryName = name;
    this.saveSettings(settings);
    return settings;
  }

  static updateContactInfo(contactInfo: Partial<ContactInfo>): GallerySettings {
    const settings = this.getOrInitializeSettings();
    settings.contactInfo = {
      ...settings.contactInfo,
      ...contactInfo
    };
    this.saveSettings(settings);
    return settings;
  }

  static updatePrimaryLocation(location: Partial<Omit<Location, 'id' | 'isPrimary'>>): GallerySettings {
    const settings = this.getOrInitializeSettings();
    settings.primaryLocation = {
      ...settings.primaryLocation,
      ...location
    };
    this.saveSettings(settings);
    return settings;
  }

  static addSecondaryLocation(location: Omit<Location, 'id' | 'isPrimary'>): GallerySettings {
    const settings = this.getOrInitializeSettings();
    const newLocation: Location = {
      ...location,
      id: `loc_${Date.now()}`,
      isPrimary: false
    };
    
    settings.secondaryLocations.push(newLocation);
    this.saveSettings(settings);
    return settings;
  }

  static updateSecondaryLocation(locationId: string, updates: Partial<Omit<Location, 'id' | 'isPrimary'>>): GallerySettings {
    const settings = this.getOrInitializeSettings();
    const locationIndex = settings.secondaryLocations.findIndex(loc => loc.id === locationId);
    
    if (locationIndex !== -1) {
      settings.secondaryLocations[locationIndex] = {
        ...settings.secondaryLocations[locationIndex],
        ...updates
      };
      this.saveSettings(settings);
    }
    
    return settings;
  }

  static removeSecondaryLocation(locationId: string): GallerySettings {
    const settings = this.getOrInitializeSettings();
    settings.secondaryLocations = settings.secondaryLocations.filter(loc => loc.id !== locationId);
    this.saveSettings(settings);
    return settings;
  }

  static addLogo(url: string, name: string): GallerySettings {
    const settings = this.getOrInitializeSettings();
    const newLogo: LogoImage = {
      id: `logo_${Date.now()}`,
      url,
      name,
      uploadDate: new Date().toISOString(),
      isActive: false
    };
    
    console.log('Adding new logo:', newLogo);
    
    settings.logoUrls.push(newLogo);
    this.saveSettings(settings);
    
    // Explicitly dispatch a logo added event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('gallerySettingsChanged', {
        detail: { type: 'logoAdded', logo: newLogo }
      }));
    }
    
    return settings;
  }

  static setActiveLogo(logoId: string): GallerySettings {
    const settings = this.getOrInitializeSettings();
    
    // Reset all logos to inactive
    settings.logoUrls.forEach(logo => {
      logo.isActive = false;
    });
    
    // Set the selected logo as active
    const selectedLogo = settings.logoUrls.find(logo => logo.id === logoId);
    if (selectedLogo) {
      selectedLogo.isActive = true;
      settings.activeLogoId = logoId;
      
      // Log the active logo for debugging
      console.log('Setting active logo:', selectedLogo);
    }
    
    this.saveSettings(settings);
    
    // Explicitly dispatch a logo change event
    if (typeof window !== 'undefined' && selectedLogo) {
      window.dispatchEvent(new CustomEvent('gallerySettingsChanged', {
        detail: { type: 'logo', logoUrl: selectedLogo.url, logoId }
      }));
    }
    
    return settings;
  }

  static removeLogo(logoId: string): GallerySettings {
    const settings = this.getOrInitializeSettings();
    
    // Don't allow removing the active logo if it's the only one
    if (settings.logoUrls.length <= 1) {
      throw new Error('Cannot remove the only logo');
    }
    
    const logoToRemove = settings.logoUrls.find(logo => logo.id === logoId);
    if (!logoToRemove) {
      throw new Error('Logo not found');
    }
    
    // If removing the active logo, set another one as active
    if (logoToRemove.isActive) {
      const remainingLogos = settings.logoUrls.filter(logo => logo.id !== logoId);
      if (remainingLogos.length > 0) {
        remainingLogos[0].isActive = true;
        settings.activeLogoId = remainingLogos[0].id;
      }
    }
    
    settings.logoUrls = settings.logoUrls.filter(logo => logo.id !== logoId);
    this.saveSettings(settings);
    return settings;
  }

  static updateSocialMedia(links: Partial<SocialMediaLinks>): GallerySettings {
    const settings = this.getOrInitializeSettings();
    settings.socialMedia = {
      ...settings.socialMedia,
      ...links
    };
    this.saveSettings(settings);
    return settings;
  }

  static updateBusinessHours(hours: BusinessHours[]): GallerySettings {
    const settings = this.getOrInitializeSettings();
    settings.businessHours = hours;
    this.saveSettings(settings);
    return settings;
  }

  static updateBusinessHoursForDay(day: BusinessHours['day'], hours: Omit<BusinessHours, 'day'>): GallerySettings {
    const settings = this.getOrInitializeSettings();
    const dayIndex = settings.businessHours.findIndex(h => h.day === day);
    
    if (dayIndex !== -1) {
      settings.businessHours[dayIndex] = {
        day,
        ...hours
      };
    } else {
      settings.businessHours.push({
        day,
        ...hours
      });
    }
    
    this.saveSettings(settings);
    return settings;
  }

  static getActiveLogo(): LogoImage | null {
    const settings = this.getSettings();
    if (!settings) return null;
    
    return settings.logoUrls.find(logo => logo.isActive) || null;
  }

  static getAllLogos(): LogoImage[] {
    const settings = this.getSettings();
    return settings?.logoUrls || [];
  }

  static getBusinessHoursForDay(day: BusinessHours['day']): BusinessHours | null {
    const settings = this.getSettings();
    if (!settings) return null;
    
    return settings.businessHours.find(h => h.day === day) || null;
  }

  static isOpenOnDay(day: BusinessHours['day']): boolean {
    const hours = this.getBusinessHoursForDay(day);
    return hours?.open || false;
  }

  static getOpeningHours(day: BusinessHours['day']): { openTime?: string; closeTime?: string } | null {
    const hours = this.getBusinessHoursForDay(day);
    if (!hours || !hours.open) return null;
    
    return {
      openTime: hours.openTime,
      closeTime: hours.closeTime
    };
  }

  static exportSettings(): string {
    const settings = this.getSettings();
    return JSON.stringify(settings, null, 2);
  }

  static importSettings(settingsJson: string): GallerySettings {
    try {
      const settings = JSON.parse(settingsJson) as GallerySettings;
      
      // Validate the imported settings structure
      if (!settings.id || !settings.galleryName || !settings.primaryLocation) {
        throw new Error('Invalid settings format');
      }
      
      // Update timestamps
      settings.updatedAt = new Date().toISOString();
      
      this.saveSettings(settings);
      return settings;
    } catch (error) {
      console.error('Error importing settings:', error);
      throw new Error('Failed to import settings: Invalid format');
    }
  }

  static resetToDefaults(): GallerySettings {
    localStorage.removeItem(this.STORAGE_KEY);
    return this.initializeDefaultSettings();
  }

  // Frontend display settings methods
  static updateShowItemCards(showItemCards: boolean): GallerySettings {
    const settings = this.getOrInitializeSettings();
    settings.showItemCards = showItemCards;
    this.saveSettings(settings);
    
    // Also save this preference to localStorage for EventService to use
    localStorage.setItem('gallery_show_items_preference', showItemCards.toString());
    
    return settings;
  }

  static updateDefaultItem(itemId?: string): GallerySettings {
    const settings = this.getOrInitializeSettings();
    settings.defaultItemId = itemId;
    this.saveSettings(settings);
    return settings;
  }

  static updateDefaultImage(imageUrl?: string): GallerySettings {
    const settings = this.getOrInitializeSettings();
    settings.defaultImageUrl = imageUrl;
    this.saveSettings(settings);
    return settings;
  }

  static updateActiveEvent(eventId?: string): GallerySettings {
    const settings = this.getOrInitializeSettings();
    settings.activeEventId = eventId;
    this.saveSettings(settings);
    return settings;
  }

  static getShowItemCards(): boolean {
    const settings = this.getSettings();
    return settings?.showItemCards ?? true;
  }

  static getDefaultItemId(): string | undefined {
    const settings = this.getSettings();
    return settings?.defaultItemId;
  }

  static getDefaultImageUrl(): string | undefined {
    const settings = this.getSettings();
    return settings?.defaultImageUrl;
  }

  static getActiveEventId(): string | undefined {
    const settings = this.getSettings();
    return settings?.activeEventId;
  }
}
