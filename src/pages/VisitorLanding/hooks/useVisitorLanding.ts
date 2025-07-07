import { useState, useEffect } from 'react';
import { ItemService } from '../../../services/ItemService';
import { GallerySettingsService } from '../../../services/GallerySettingsService';
import { EventService } from '../../../services/EventService';
import { Item } from '../../../types/Item';
import { Event } from '../../../types/Event';
import { LogoImage } from '../../../types/GallerySettings';
import { VisitorFormData } from '../types';
import { useItemModal } from './useItemModal';
import { useAdminLogin } from './useAdminLogin';

export const useVisitorLanding = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [showItemCards, setShowItemCards] = useState(true);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [galleryLogo, setGalleryLogo] = useState<LogoImage | null>(null);
  const [galleryName, setGalleryName] = useState<string>('');
  const [visitorForm, setVisitorForm] = useState<VisitorFormData>({
    name: '',
    email: '',
    message: '',
    interest: ''
  });
  
  // Use custom hooks
  const itemModal = useItemModal();
  const adminLogin = useAdminLogin(setToastMessage, setShowToast);

  // Load all data that can be called when needed
  const loadData = () => {
    // Initialize sample data if needed
    ItemService.initializeSampleData();
    EventService.initializeSampleData();
    
    // Load gallery settings - this is the global preference
    const showCards = GallerySettingsService.getShowItemCards();
    setShowItemCards(showCards);
    
    // Load gallery logo and name
    const activeLogo = GallerySettingsService.getActiveLogo();
    setGalleryLogo(activeLogo);
    
    const settings = GallerySettingsService.getOrInitializeSettings();
    setGalleryName(settings.galleryName);
    
    console.log('Show items carousel:', showCards);
  };

  // Initial data loading
  useEffect(() => {
    // Load all data when component mounts
    loadData();
    
    // Add event listener for focus to reload data when user returns to this page
    window.addEventListener('focus', loadData);
    
    // Add a storage event listener to detect changes to localStorage
    // This will allow the component to update when settings are changed in another tab/window
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'gallery_settings' || event.key === 'gallery_show_items_preference') {
        console.log('Settings changed in another window, reloading data');
        loadData();
      }
    };
    
    // Add a custom event listener for same-tab changes
    const handleCustomStorageChange = (event: CustomEvent) => {
      console.log('Settings changed in same tab, reloading data');
      loadData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('gallerySettingsChanged', handleCustomStorageChange as EventListener);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('focus', loadData);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('gallerySettingsChanged', handleCustomStorageChange as EventListener);
    };
  }, []);

  // Load active event and items
  useEffect(() => {
    // Load active event and items
    const activeEventId = GallerySettingsService.getActiveEventId();
    let currentEvent: Event | null = null;
    let currentItems: Item[] = [];
    
    if (activeEventId) {
      currentEvent = EventService.getEventById(activeEventId);
    } else {
      // If no active event is set in settings, get the first active event
      const activeEvents = EventService.getActiveEvents();
      if (activeEvents.length > 0) {
        currentEvent = activeEvents[0];
        // Update the gallery settings with the active event ID
        GallerySettingsService.updateActiveEvent(currentEvent.id);
      }
    }
    
    setActiveEvent(currentEvent);
    
    if (currentEvent) {
      // First check the global setting - if it's false, don't show items regardless
      if (!showItemCards) {
        currentItems = [];
        setItems([]);
        // Global setting takes precedence
        setShowItemCards(false);
      }
      // Then check if event-specific showItems is explicitly set to false
      else if (currentEvent.showItems === false) {
        // If showItems is false, don't show items regardless of whether there are featured items
        currentItems = [];
        setItems([]);
        setShowItemCards(false);
      } else if (currentEvent.featuredItems && currentEvent.featuredItems.length > 0) {
        // If global and event settings allow showing items, and there are featured items, show them
        const featuredItems = currentEvent.featuredItems
          .map(itemId => ItemService.getItemById(itemId))
          .filter(item => item !== null) as Item[];
        currentItems = featuredItems;
        setItems(featuredItems);
        setShowItemCards(true);
      } else {
        // No featured items - will show event default image instead
        currentItems = [];
        setItems([]);
      }
    } else {
      // No active event, show all public items
      const publicItems = ItemService.getPublicItems();
      currentItems = publicItems;
      setItems(publicItems);
    }
    
    // Load background images - use event default image if no carousel items
    let bgImages = ItemService.getLandingPageBackgroundImages();
    
    // If there's an active event with no featured items but has an image, use that as background
    if (activeEventId && currentEvent && currentItems.length === 0 && currentEvent.imageUrl) {
      bgImages = [currentEvent.imageUrl];
    }
    
    setBackgroundImages(bgImages);
  }, [showItemCards]);

  // Item click handler
  const handleItemClick = (item: Item) => {
    itemModal.openModal(item);
  };

  // Visitor form change handler
  const handleVisitorFormChange = (field: keyof VisitorFormData, value: string) => {
    setVisitorForm(prev => ({ ...prev, [field]: value }));
  };

  // Visitor submit handler
  const handleVisitorSubmit = () => {
    // Handle visitor form submission - store in localStorage
    const submissions = JSON.parse(localStorage.getItem('visitor_submissions') || '[]');
    const newSubmission = {
      id: Date.now().toString(),
      ...visitorForm,
      submittedAt: new Date().toISOString()
    };
    submissions.push(newSubmission);
    localStorage.setItem('visitor_submissions', JSON.stringify(submissions));
    
    setToastMessage('Thank you for your message!');
    setShowToast(true);
    // Reset form
    setVisitorForm({ name: '', email: '', message: '', interest: '' });
  };


  return {
    // State
    showToast,
    toastMessage,
    items,
    backgroundImages,
    showItemCards,
    activeEvent,
    galleryLogo,
    galleryName,
    visitorForm,
    
    // Item Modal
    selectedItem: itemModal.selectedItem,
    isItemModalOpen: itemModal.isOpen,
    handleItemClick,
    setIsItemModalOpen: (isOpen: boolean) => {
      if (isOpen) {
        // This shouldn't be called directly, use handleItemClick instead
        console.warn('setIsItemModalOpen(true) called directly. Use handleItemClick(item) instead.');
      } else {
        itemModal.closeModal();
      }
    },
    formatPrice: itemModal.formatPrice,
    
    // Admin Modal
    isAdminModalOpen: adminLogin.isOpen,
    adminForm: adminLogin.adminForm,
    handleAdminLogin: adminLogin.openModal,
    handleAdminFormChange: adminLogin.handleFormChange,
    handleAdminSubmit: adminLogin.handleSubmit,
    setIsAdminModalOpen: (isOpen: boolean) => {
      if (isOpen) {
        adminLogin.openModal();
      } else {
        adminLogin.closeModal();
      }
    },
    
    // Visitor Form
    handleVisitorFormChange,
    handleVisitorSubmit,
    
    // Toast
    setShowToast,
  };
};
