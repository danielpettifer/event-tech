import { Item, ItemStats } from '../types/Item';

export class ItemService {
  private static readonly STORAGE_KEY = 'gallery_items';

  static getAllItems(): Item[] {
    const items = localStorage.getItem(this.STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  }

  static getItemById(id: string): Item | null {
    const items = this.getAllItems();
    return items.find(item => item.id === id) || null;
  }

  static saveItem(item: Item): void {
    const items = this.getAllItems();
    const existingIndex = items.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
      items[existingIndex] = { ...item, updatedAt: new Date().toISOString() };
    } else {
      items.push({ ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  static deleteItem(id: string): void {
    const items = this.getAllItems();
    const filteredItems = items.filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredItems));
  }

  static searchItems(query: string): Item[] {
    const items = this.getAllItems();
    const searchTerm = query.toLowerCase();
    
    return items.filter(item =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.artist.toLowerCase().includes(searchTerm) ||
      item.medium.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm) ||
      item.style.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      item.materials.some(material => material.toLowerCase().includes(searchTerm)) ||
      item.techniques.some(technique => technique.toLowerCase().includes(searchTerm))
    );
  }

  static filterItemsByStatus(status: string): Item[] {
    const items = this.getAllItems();
    return items.filter(item => item.status === status);
  }

  static filterItemsByCategory(category: string): Item[] {
    const items = this.getAllItems();
    return items.filter(item => item.category === category);
  }

  static filterItemsByArtist(artist: string): Item[] {
    const items = this.getAllItems();
    return items.filter(item => item.artist === artist);
  }

  static getPublicItems(): Item[] {
    const items = this.getAllItems();
    return items.filter(item => item.isPubliclyVisible);
  }

  static getFeaturedItems(): Item[] {
    const items = this.getAllItems();
    return items.filter(item => item.isFeatured && item.isPubliclyVisible);
  }

  static getItemStats(): ItemStats {
    const items = this.getAllItems();
    
    const totalItems = items.length;
    const availableItems = items.filter(item => item.status === 'Available').length;
    const soldItems = items.filter(item => item.status === 'Sold').length;
    const reservedItems = items.filter(item => item.status === 'Reserved').length;
    
    const totalValue = items.reduce((sum, item) => sum + item.estimatedValue, 0);
    const averagePrice = totalItems > 0 ? items.reduce((sum, item) => sum + item.price, 0) / totalItems : 0;
    
    // Calculate top categories
    const categoryCount: { [key: string]: number } = {};
    items.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });
    const topCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Calculate top artists
    const artistCount: { [key: string]: number } = {};
    items.forEach(item => {
      artistCount[item.artist] = (artistCount[item.artist] || 0) + 1;
    });
    const topArtists = Object.entries(artistCount)
      .map(([artist, count]) => ({ artist, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Get recently added items
    const recentlyAdded = items
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    return {
      totalItems,
      availableItems,
      soldItems,
      reservedItems,
      totalValue,
      averagePrice,
      topCategories,
      topArtists,
      recentlyAdded
    };
  }

  static generateId(): string {
    return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  static initializeSampleData(): void {
    const existingItems = this.getAllItems();
    if (existingItems.length > 0) return;

    const sampleItems: Item[] = [
      {
        id: this.generateId(),
        title: 'The Starry Night',
        artist: 'Vincent van Gogh',
        medium: 'Oil on Canvas',
        dimensions: '73.7 x 92.1 cm',
        year: 1889,
        price: 85000000,
        currency: 'GBP',
        description: 'A masterpiece of Post-Impressionist art depicting a swirling night sky over a village. Van Gogh painted this iconic work while at the Saint-Paul-de-Mausole asylum in Saint-Rémy-de-Provence.',
        category: 'Landscape',
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
        images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg'],
        thumbnailImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/640px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
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
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: this.generateId(),
        title: 'The Great Wave off Kanagawa',
        artist: 'Katsushika Hokusai',
        medium: 'Woodblock Print',
        dimensions: '25.7 x 37.9 cm',
        year: 1831,
        price: 2500000,
        currency: 'GBP',
        description: 'The most famous work from Hokusai\'s series "Thirty-six Views of Mount Fuji". This iconic ukiyo-e print depicts a giant wave threatening boats off the coast of Kanagawa.',
        category: 'Landscape',
        style: 'Ukiyo-e',
        condition: 'Very Good',
        provenance: 'Private Japanese collection',
        location: 'Asian Art Gallery - Wall A',
        status: 'Available',
        isFramed: true,
        frameDescription: 'Traditional Japanese frame with silk matting',
        acquisitionDate: '2023-08-20',
        acquisitionPrice: 2200000,
        estimatedValue: 2800000,
        insuranceValue: 3000000,
        images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/1280px-The_Great_Wave_off_Kanagawa.jpg'],
        thumbnailImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/640px-The_Great_Wave_off_Kanagawa.jpg',
        tags: ['ukiyo-e', 'wave', 'mount fuji', 'japanese art', 'woodblock'],
        exhibitions: ['Japanese Masters 2023', 'Waves and Water'],
        publications: ['Asian Art Review, Autumn 2023'],
        isPubliclyVisible: true,
        isFeatured: true,
        isLandingPageBackground: true,
        landingPageDisplayOrder: 1,
        weight: 1.2,
        materials: ['Woodblock', 'Paper', 'Natural pigments'],
        techniques: ['Woodblock printing', 'Multiple color blocks'],
        signature: 'Hokusai seal',
        certificate: true,
        notes: 'Exceptional example of Edo period printmaking',
        createdAt: '2023-08-20T14:30:00Z',
        updatedAt: '2023-08-20T14:30:00Z'
      },
      {
        id: this.generateId(),
        title: 'Girl with a Pearl Earring',
        artist: 'Johannes Vermeer',
        medium: 'Oil on Canvas',
        dimensions: '44.5 x 39 cm',
        year: 1665,
        price: 45000000,
        currency: 'GBP',
        description: 'Often called the "Mona Lisa of the North", this masterpiece of the Dutch Golden Age features a mysterious girl wearing an exotic dress and a large pearl earring.',
        category: 'Portrait',
        style: 'Dutch Golden Age',
        condition: 'Excellent',
        provenance: 'Mauritshuis, The Hague',
        location: 'Portrait Gallery - Central Wall',
        status: 'Available',
        isFramed: true,
        frameDescription: 'Period-appropriate Dutch frame',
        acquisitionDate: '2023-11-10',
        acquisitionPrice: 42000000,
        estimatedValue: 48000000,
        insuranceValue: 50000000,
        images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg'],
        thumbnailImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/400px-1665_Girl_with_a_Pearl_Earring.jpg',
        tags: ['dutch golden age', 'portrait', 'pearl', 'mysterious', 'vermeer'],
        exhibitions: ['Dutch Masters 2023', 'Portraits of Mystery'],
        publications: ['European Art Quarterly, Winter 2023'],
        isPubliclyVisible: true,
        isFeatured: true,
        isLandingPageBackground: true,
        landingPageDisplayOrder: 2,
        weight: 3.8,
        materials: ['Oil paint', 'Canvas', 'Lapis lazuli', 'Pearl'],
        techniques: ['Sfumato', 'Chiaroscuro', 'Glazing'],
        signature: 'IVMeer (monogram)',
        certificate: true,
        notes: 'One of Vermeer\'s most celebrated works',
        createdAt: '2023-11-10T09:15:00Z',
        updatedAt: '2023-11-10T09:15:00Z'
      },
      {
        id: this.generateId(),
        title: 'Water Lilies',
        artist: 'Claude Monet',
        medium: 'Oil on Canvas',
        dimensions: '200 x 425 cm',
        year: 1919,
        price: 35000000,
        currency: 'GBP',
        description: 'Part of Monet\'s famous series of approximately 250 oil paintings depicting his flower garden at Giverny. This large-scale work captures the play of light and reflection on water.',
        category: 'Landscape',
        style: 'Impressionism',
        condition: 'Excellent',
        provenance: 'Musée de l\'Orangerie, Paris',
        location: 'Impressionist Gallery - Main Wall',
        status: 'Available',
        isFramed: false,
        acquisitionDate: '2023-05-15',
        acquisitionPrice: 32000000,
        estimatedValue: 38000000,
        insuranceValue: 40000000,
        images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1919%2C_Metropolitan_Museum_of_Art.jpg/1280px-Claude_Monet_-_Water_Lilies_-_1919%2C_Metropolitan_Museum_of_Art.jpg'],
        thumbnailImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1919%2C_Metropolitan_Museum_of_Art.jpg/640px-Claude_Monet_-_Water_Lilies_-_1919%2C_Metropolitan_Museum_of_Art.jpg',
        tags: ['impressionism', 'water lilies', 'giverny', 'light', 'reflection'],
        exhibitions: ['Monet: Light and Water 2023', 'Impressionist Masters'],
        publications: ['Impressionist Art Today, Summer 2023'],
        isPubliclyVisible: true,
        isFeatured: true,
        weight: 15.2,
        materials: ['Oil paint', 'Canvas'],
        techniques: ['Plein air', 'Broken color', 'Light studies'],
        signature: 'Claude Monet 1919',
        certificate: true,
        notes: 'Exceptional example from the artist\'s late period',
        createdAt: '2023-05-15T11:20:00Z',
        updatedAt: '2023-05-15T11:20:00Z'
      },
      {
        id: this.generateId(),
        title: 'The Birth of Venus',
        artist: 'Sandro Botticelli',
        medium: 'Tempera on Canvas',
        dimensions: '172.5 x 278.9 cm',
        year: 1485,
        price: 75000000,
        currency: 'GBP',
        description: 'A masterpiece of the Italian Renaissance depicting the Roman goddess Venus emerging from the sea as a fully grown woman. The painting represents divine love and spiritual beauty.',
        category: 'Mythological',
        style: 'Renaissance',
        condition: 'Excellent',
        provenance: 'Uffizi Gallery, Florence',
        location: 'Renaissance Gallery - Feature Wall',
        status: 'Reserved',
        isFramed: true,
        frameDescription: 'Renaissance-style gilded frame',
        acquisitionDate: '2023-12-01',
        acquisitionPrice: 70000000,
        estimatedValue: 80000000,
        insuranceValue: 85000000,
        images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg'],
        thumbnailImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/640px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg',
        tags: ['renaissance', 'venus', 'mythology', 'beauty', 'botticelli'],
        exhibitions: ['Renaissance Masters 2024', 'Divine Beauty'],
        publications: ['Renaissance Art Review, Winter 2024'],
        isPubliclyVisible: true,
        isFeatured: true,
        weight: 12.8,
        materials: ['Tempera', 'Canvas', 'Gold leaf'],
        techniques: ['Tempera painting', 'Linear perspective', 'Sfumato'],
        signature: 'Sandro Botticelli',
        certificate: true,
        notes: 'Reserved for major exhibition loan',
        createdAt: '2023-12-01T16:45:00Z',
        updatedAt: '2023-12-01T16:45:00Z'
      },
      {
        id: this.generateId(),
        title: 'American Gothic',
        artist: 'Grant Wood',
        medium: 'Oil on Beaverboard',
        dimensions: '78 x 65.3 cm',
        year: 1930,
        price: 8500000,
        currency: 'GBP',
        description: 'An iconic painting of American art depicting a farmer standing beside his daughter in front of their house. The work has become a symbol of rural American values and Midwestern sensibility.',
        category: 'Portrait',
        style: 'American Regionalism',
        condition: 'Excellent',
        provenance: 'Art Institute of Chicago',
        location: 'American Art Gallery - Wall B',
        status: 'Available',
        isFramed: true,
        frameDescription: 'Simple wooden frame, period appropriate',
        acquisitionDate: '2023-07-22',
        acquisitionPrice: 8000000,
        estimatedValue: 9000000,
        insuranceValue: 9500000,
        images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/800px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg'],
        thumbnailImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/400px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg',
        tags: ['american regionalism', 'rural', 'gothic', 'farmer', 'midwest'],
        exhibitions: ['American Art 2023', 'Rural Visions'],
        publications: ['American Art Quarterly, Fall 2023'],
        isPubliclyVisible: true,
        isFeatured: false,
        weight: 4.2,
        materials: ['Oil paint', 'Beaverboard', 'Wood frame'],
        techniques: ['Detailed realism', 'Precise brushwork'],
        signature: 'Grant Wood 1930',
        certificate: true,
        notes: 'Iconic representation of American rural life',
        createdAt: '2023-07-22T13:00:00Z',
        updatedAt: '2023-07-22T13:00:00Z'
      }
    ];

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sampleItems));
  }

  static getCategories(): string[] {
    const items = this.getAllItems();
    const categories = [...new Set(items.map(item => item.category))];
    return categories.sort();
  }

  static getArtists(): string[] {
    const items = this.getAllItems();
    const artists = [...new Set(items.map(item => item.artist))];
    return artists.sort();
  }

  static getStatuses(): string[] {
    return ['Available', 'Sold', 'Reserved', 'On Loan', 'In Restoration', 'Not for Sale'];
  }

  static updateItemStatus(id: string, status: string): void {
    const item = this.getItemById(id);
    if (item) {
      item.status = status as any;
      this.saveItem(item);
    }
  }

  static toggleFeatured(id: string): void {
    const item = this.getItemById(id);
    if (item) {
      item.isFeatured = !item.isFeatured;
      this.saveItem(item);
    }
  }

  static togglePublicVisibility(id: string): void {
    const item = this.getItemById(id);
    if (item) {
      item.isPubliclyVisible = !item.isPubliclyVisible;
      this.saveItem(item);
    }
  }

  static getLandingPageBackgroundImages(): string[] {
    const items = this.getAllItems();
    const backgroundItems = items
      .filter(item => item.isLandingPageBackground)
      .sort((a, b) => (a.landingPageDisplayOrder || 0) - (b.landingPageDisplayOrder || 0));
    
    // If no items are specifically marked, fall back to featured items
    if (backgroundItems.length === 0) {
      const featuredItems = items.filter(item => item.isFeatured && item.isPubliclyVisible);
      return featuredItems.map(item => item.thumbnailImage || item.images[0] || '').filter(img => img);
    }
    
    return backgroundItems.map(item => item.thumbnailImage || item.images[0] || '').filter(img => img);
  }

  static toggleLandingPageBackground(id: string): void {
    const items = this.getAllItems();
    const item = items.find(item => item.id === id);
    
    if (item) {
      // Toggle the status
      item.isLandingPageBackground = !item.isLandingPageBackground;
      
      // If enabling, set display order to be last
      if (item.isLandingPageBackground) {
        const backgroundItems = items.filter(i => i.isLandingPageBackground && i.id !== id);
        item.landingPageDisplayOrder = backgroundItems.length;
      } else {
        // If disabling, remove display order
        delete item.landingPageDisplayOrder;
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    }
  }

  static setLandingPageBackgroundOrder(id: string, order: number): void {
    const items = this.getAllItems();
    const item = items.find(item => item.id === id);
    
    if (item && item.isLandingPageBackground) {
      item.landingPageDisplayOrder = order;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    }
  }

  static getLandingPageBackgroundItems(): Item[] {
    const items = this.getAllItems();
    return items
      .filter(item => item.isLandingPageBackground)
      .sort((a, b) => (a.landingPageDisplayOrder || 0) - (b.landingPageDisplayOrder || 0));
  }
}
