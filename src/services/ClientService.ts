import { Client } from '../types/Client';

const STORAGE_KEY = 'gallery_clients';

export class ClientService {
  static getAllClients(): Client[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading clients:', error);
      return [];
    }
  }

  static getClientById(id: string): Client | null {
    const clients = this.getAllClients();
    return clients.find(client => client.id === id) || null;
  }

  static saveClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
    const clients = this.getAllClients();
    const now = new Date().toISOString();
    
    const newClient: Client = {
      ...client,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    };

    clients.push(newClient);
    this.saveClients(clients);
    return newClient;
  }

  static updateClient(id: string, updates: Partial<Omit<Client, 'id' | 'createdAt'>>): Client | null {
    const clients = this.getAllClients();
    const index = clients.findIndex(client => client.id === id);
    
    if (index === -1) {
      return null;
    }

    const updatedClient: Client = {
      ...clients[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    clients[index] = updatedClient;
    this.saveClients(clients);
    return updatedClient;
  }

  static deleteClient(id: string): boolean {
    const clients = this.getAllClients();
    const filteredClients = clients.filter(client => client.id !== id);
    
    if (filteredClients.length === clients.length) {
      return false; // Client not found
    }

    this.saveClients(filteredClients);
    return true;
  }

  static searchClients(query: string): Client[] {
    const clients = this.getAllClients();
    const lowercaseQuery = query.toLowerCase();

    return clients.filter(client => 
      client.firstName.toLowerCase().includes(lowercaseQuery) ||
      client.lastName.toLowerCase().includes(lowercaseQuery) ||
      client.email.toLowerCase().includes(lowercaseQuery) ||
      client.townCity.toLowerCase().includes(lowercaseQuery) ||
      client.country.toLowerCase().includes(lowercaseQuery) ||
      client.categories.some(cat => cat.toLowerCase().includes(lowercaseQuery)) ||
      client.interests.some(interest => interest.toLowerCase().includes(lowercaseQuery)) ||
      (client.generalInformation && client.generalInformation.toLowerCase().includes(lowercaseQuery))
    );
  }

  static filterClients(filters: {
    categories?: string[];
    interests?: string[];
    countries?: string[];
    onEmailList?: boolean;
  }): Client[] {
    const clients = this.getAllClients();

    return clients.filter(client => {
      if (filters.categories && filters.categories.length > 0) {
        const hasCategory = filters.categories.some(cat => client.categories.includes(cat));
        if (!hasCategory) return false;
      }

      if (filters.interests && filters.interests.length > 0) {
        const hasInterest = filters.interests.some(interest => client.interests.includes(interest));
        if (!hasInterest) return false;
      }

      if (filters.countries && filters.countries.length > 0) {
        if (!filters.countries.includes(client.country)) return false;
      }

      if (filters.onEmailList !== undefined) {
        if (client.onEmailList !== filters.onEmailList) return false;
      }

      return true;
    });
  }

  static getClientStats() {
    const clients = this.getAllClients();
    const totalClients = clients.length;
    const emailListClients = clients.filter(client => client.onEmailList).length;
    
    // Get top categories
    const categoryCount: { [key: string]: number } = {};
    clients.forEach(client => {
      client.categories.forEach(category => {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
    });

    // Get top interests
    const interestCount: { [key: string]: number } = {};
    clients.forEach(client => {
      client.interests.forEach(interest => {
        interestCount[interest] = (interestCount[interest] || 0) + 1;
      });
    });

    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));

    const topInterests = Object.entries(interestCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([interest, count]) => ({ interest, count }));

    return {
      totalClients,
      emailListClients,
      topCategories,
      topInterests
    };
  }

  static exportClients(): string {
    const clients = this.getAllClients();
    return JSON.stringify(clients, null, 2);
  }

  static importClients(jsonData: string): { success: boolean; count: number; error?: string } {
    try {
      const importedClients: Client[] = JSON.parse(jsonData);
      
      // Validate the data structure
      if (!Array.isArray(importedClients)) {
        return { success: false, count: 0, error: 'Invalid data format' };
      }

      // Validate each client object
      for (const client of importedClients) {
        if (!this.validateClientData(client)) {
          return { success: false, count: 0, error: 'Invalid client data structure' };
        }
      }

      this.saveClients(importedClients);
      return { success: true, count: importedClients.length };
    } catch (error) {
      return { success: false, count: 0, error: 'Failed to parse JSON data' };
    }
  }

  private static saveClients(clients: Client[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    } catch (error) {
      console.error('Error saving clients:', error);
      throw new Error('Failed to save client data');
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private static validateClientData(client: any): client is Client {
    return (
      typeof client === 'object' &&
      typeof client.id === 'string' &&
      typeof client.firstName === 'string' &&
      typeof client.lastName === 'string' &&
      typeof client.email === 'string' &&
      typeof client.addressLine1 === 'string' &&
      typeof client.townCity === 'string' &&
      typeof client.countyState === 'string' &&
      typeof client.postcodeZip === 'string' &&
      typeof client.country === 'string' &&
      typeof client.onEmailList === 'boolean' &&
      typeof client.basisForProcessing === 'string' &&
      typeof client.dataProtectionDate === 'string' &&
      Array.isArray(client.categories) &&
      Array.isArray(client.interests) &&
      typeof client.createdAt === 'string' &&
      typeof client.updatedAt === 'string'
    );
  }

  // Initialize with sample data if no clients exist
  static initializeSampleData(): void {
    const existingClients = this.getAllClients();
    if (existingClients.length === 0) {
      const sampleClient: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
        firstName: 'Laurence',
        lastName: 'Rundell',
        email: 'laurencerundell@gmail.com',
        addressLine1: 'Flat 5',
        addressLine2: '57 The Drive',
        townCity: 'Brighton and Hove',
        countyState: 'Sussex',
        postcodeZip: 'BN3 3PF',
        country: 'United Kingdom',
        onEmailList: true,
        basisForProcessing: 'Details supplied through a website form or visitors\' book',
        dataProtectionDate: '2025-02-28',
        generalInformation: 'Really liked Candida Hofer, needs one for his nice big hotel',
        categories: ['Europe', 'Hotel'],
        interests: ['Candida Höfer']
      };

      this.saveClient(sampleClient);
    }
  }
}
