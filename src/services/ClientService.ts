import axios from 'axios';
import { Client } from '../types/Client';
import config from "../config";

const API_BASE_URL = config.api.url + '/api';

export class ClientService {
  static async getAllClients(): Promise<Client[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients`);
      return response.data;
    } catch (error) {
      console.error('Error loading clients:', error);
      return [];
    }
  }

  static async getClientById(id: string): Promise<Client | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error loading client:', error);
      return null;
    }
  }

  static async saveClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    try {
      const response = await axios.post(`${API_BASE_URL}/clients`, client);
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw new Error('Failed to save client');
    }
  }

  static async updateClient(id: string, updates: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<Client | null> {
    try {
      const response = await axios.put(`${API_BASE_URL}/clients/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating client:', error);
      return null;
    }
  }

  static async deleteClient(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/clients/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      return false;
    }
  }

  static async searchClients(query: string): Promise<Client[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients/search/${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching clients:', error);
      return [];
    }
  }

  static async filterClients(filters: {
    categories?: string[];
    interests?: string[];
    countries?: string[];
    onEmailList?: boolean;
  }): Promise<Client[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients/filter`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error filtering clients:', error);
      return [];
    }
  }

  static async getClientStats(): Promise<{
    totalClients: number;
    emailListClients: number;
    topCategories: { category: string; count: number }[];
    topInterests: { interest: string; count: number }[];
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching client stats:', error);
      return {
        totalClients: 0,
        emailListClients: 0,
        topCategories: [],
        topInterests: [],
      };
    }
  }

  static async exportClients(): Promise<string> {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients/export`);
      return JSON.stringify(response.data, null, 2);
    } catch (error) {
      console.error('Error exporting clients:', error);
      return '[]';
    }
  }

  static async importClients(jsonData: string): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      const data = JSON.parse(jsonData);
      const response = await axios.post(`${API_BASE_URL}/clients/import`, { data });
      return response.data;
    } catch (error) {
      console.error('Error importing clients:', error);
      return { success: false, count: 0, error: 'Failed to import clients' };
    }
  }

  static async initializeSampleData(): Promise<void> {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients`);
      if (response.data.length === 0) {
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
          interests: ['Candida Höfer'],
        };
        await this.saveClient(sampleClient);
      }
    } catch (error) {
      console.error('Error initializing sample client data:', error);
    }
  }
}