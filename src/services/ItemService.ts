import axios from 'axios';
import { Item, ItemStats } from '../types/Item';
import config from "../config";

const API_BASE_URL = config.api.url + '/api';

export class ItemService {
  private static readonly STORAGE_KEY = 'gallery_items';

  static async getAllItems(): Promise<Item[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/items`);
      return response.data;
    } catch (error) {
      console.error('Error loading items:', error);
      return [];
    }
  }

  static async getItemById(id: string): Promise<Item | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/items/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error loading item:', error);
      return null;
    }
  }

  static async saveItem(item: Item): Promise<void> {
    try {
      const existingItem = await this.getItemById(item.id);
      if (existingItem) {
        await axios.put(`${API_BASE_URL}/items/${item.id}`, item);
      } else {
        await axios.post(`${API_BASE_URL}/items`, item);
      }
    } catch (error) {
      console.error('Error saving item:', error);
      throw new Error('Failed to save item');
    }
  }

  static async deleteItem(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/items/${id}`);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw new Error('Failed to delete item');
    }
  }

  static async searchItems(query: string): Promise<Item[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/items/search/${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching items:', error);
      return [];
    }
  }

  static async filterItemsByStatus(status: string): Promise<Item[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/items/status/${encodeURIComponent(status)}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering items by status:', error);
      return [];
    }
  }

  static async filterItemsByCategory(category: string): Promise<Item[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/items/category/${encodeURIComponent(category)}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering items by category:', error);
      return [];
    }
  }

  static async filterItemsByArtist(artist: string): Promise<Item[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/items/artist/${encodeURIComponent(artist)}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering items by artist:', error);
      return [];
    }
  }

  static async getPublicItems(): Promise<Item[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/items/public`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public items:', error);
      return [];
    }
  }

  static async getFeaturedItems(): Promise<Item[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/items/featured`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured items:', error);
      return [];
    }
  }

  static async getItemStats(): Promise<ItemStats> {
    try {
      const response = await axios.get(`${API_BASE_URL}/items/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching item stats:', error);
      return {
        totalItems: 0,
        availableItems: 0,
        soldItems: 0,
        reservedItems: 0,
        totalValue: 0,
        averagePrice: 0,
        topCategories: [],
        topArtists: [],
        recentlyAdded: [],
      };
    }
  }

  static generateId(): string {
    return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  static async initializeSampleData(): Promise<void> {
    try {
      const response = await axios.get(`${API_BASE_URL}/items`);
      if (response.data.length === 0) {
        const sampleItems: Item[] = [
          // ... (same sample items as in the original ItemService.ts)
          // Note: You may need to adjust category_id to match an existing category ID
          {
            id: this.generateId(),
            title: 'The Starry Night',
            artist: 'Vincent van Gogh',
            medium: 'Oil on Canvas',
            dimensions: '73.7 x 92.1 cm',
            year: 1889,
            price: 85000000,
            currency: 'GBP',
            description: 'A masterpiece of Post-Impressionist art...',
            category: '1', // Replace with valid category ID from API
            style: 'Post-Impressionism',
            condition: 'Excellent',
            provenance: 'Museum of Modern Art, New York',
            location: 'Main Gallery - Feature Wall',
            status: 'Available',
            isFramed: true,
            frameDescription: 'Museum-quality conservation frame',
            acquisitionDate: '2024-01-15',
            acquisitionPrice: 80000000,
            estimatedValue: 90000000,
            insuranceValue: 100000000,
            images: ['https://...'],
            thumbnailImage: 'https://...',
            tags: ['post-impressionism', 'night scene', 'swirls', 'stars', 'village'],
            exhibitions: ['Van Gogh Retrospective 2024', 'Masters of Light'],
            publications: ['Art History Quarterly, Spring 2024'],
            isPubliclyVisible: true,
            isFeatured: true,
            isLandingPageBackground: true,
            landingPageDisplayOrder: 0,
            weight: 8.5,
            materials: ['Oil paint', 'Canvas', 'Conservation frame'],
            techniques: ['Impasto', 'Swirling brushstrokes', 'Color theory'],
            signature: 'Signed Vincent',
            certificate: true,
            notes: 'One of the most recognizable paintings in the world',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
          },
          // ... (add other sample items similarly)
        ];
        for (const item of sampleItems) {
          await this.saveItem(item);
        }
      }
    } catch (error) {
      console.error('Error initializing sample item data:', error);
    }
  }

  static async getCategories(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  static async getArtists(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/items`);
      const artists = [...new Set(response.data.map((item: Item) => item.artist))];
      // @ts-expect-error // TypeScript error: Object is possibly 'null' or 'undefined'
      return artists.sort();
    } catch (error) {
      console.error('Error fetching artists:', error);
      return [];
    }
  }

  static async getStatuses(): Promise<string[]> {
    return ['Available', 'Sold', 'Reserved', 'On Loan', 'In Restoration', 'Not for Sale'];
  }

  static async updateItemStatus(id: string, status: string): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/items/${id}`, { status });
    } catch (error) {
      console.error('Error updating item status:', error);
      throw new Error('Failed to update item status');
    }
  }

  static async toggleFeatured(id: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/items/${id}/toggle-featured`);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      throw new Error('Failed to toggle featured status');
    }
  }

  static async togglePublicVisibility(id: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/items/${id}/toggle-public-visibility`);
    } catch (error) {
      console.error('Error toggling public visibility:', error);
      throw new Error('Failed to toggle public visibility');
    }
  }

  static async getLandingPageBackgroundImages(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/items/landing-page-backgrounds`);
      return response.data;
    } catch (error) {
      console.error('Error fetching landing page background images:', error);
      return [];
    }
  }

  static async toggleLandingPageBackground(id: string): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/items/${id}/toggle-landing-page-background`);
    } catch (error) {
      console.error('Error toggling landing page background:', error);
      throw new Error('Failed to toggle landing page background');
    }
  }

  static async setLandingPageBackgroundOrder(id: string, order: number): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/items/${id}/set-landing-page-order`, { order });
    } catch (error) {
      console.error('Error setting landing page background order:', error);
      throw new Error('Failed to set landing page background order');
    }
  }

  static async getLandingPageBackgroundItems(): Promise<Item[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/items`);
      return response.data.filter((item: Item) => item.isLandingPageBackground)
        .sort((a: Item, b: Item) => (a.landingPageDisplayOrder || 0) - (b.landingPageDisplayOrder || 0));
    } catch (error) {
      console.error('Error fetching landing page background items:', error);
      return [];
    }
  }
}