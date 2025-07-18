import React, {useState, useEffect} from 'react';
import {
  IonContent,
  IonPage,
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonSearchbar,
  IonFab,
  IonFabButton
} from '@ionic/react';
import {
  business,
  person,
  people,
  images,
  calendar,
  settings,
  logOut,
  statsChart,
  mail,
  home,
  add,
  checkmark,
  close,
  trash,
  star,
  cloudUpload
} from 'ionicons/icons';
import {useHistory} from 'react-router-dom';
import {ClientService} from '../services/ClientService';
import {Client} from '../types/Client';
import ClientForm from '../components/ClientForm';
import {EventService} from '../services/EventService';
import {Event} from '../types/Event';
import EventForm from '../components/EventForm';
import {ItemService} from '../services/ItemService';
import {Item} from '../types/Item';
import ItemForm from '../components/ItemForm';
import {GallerySettingsService} from '../services/GallerySettingsService';
import './AdminDashboard.css';

// Dummy data
const dummyStats = {
  totalVisitors: 156,
  totalClients: 23,
  activeEvents: 2,
  totalItems: 45
};

const dummyRecentVisitors = [
  {id: 1, name: 'John Smith', email: 'john@example.com', visitDate: '2025-01-07', interest: 'Abstract Art'},
  {id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', visitDate: '2025-01-06', interest: 'Landscapes'},
  {id: 3, name: 'Mike Brown', email: 'mike@example.com', visitDate: '2025-01-06', interest: 'Sculptures'}
];

const AdminDashboard: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [userEmail, setUserEmail] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientStats, setClientStats] = useState<{
    totalClients: number;
    emailListClients: number;
    topCategories: { category: string; count: number; }[];
    topInterests: { interest: string; count: number; }[];
  }>({
    totalClients: 0,
    emailListClients: 0,
    topCategories: [],
    topInterests: []
  });

  // Event management state
  const [events, setEvents] = useState<Event[]>([]);
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventStats, setEventStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0
  });

  // Item management state
  const [items, setItems] = useState<Item[]>([]);
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [itemStats, setItemStats] = useState({
    totalItems: 0,
    availableItems: 0,
    soldItems: 0,
    reservedItems: 0,
    totalValue: 0,
    averagePrice: 0
  });

  // Active event state
  const [activeEventId, setActiveEventId] = useState<string | undefined>(undefined);

  // Gallery settings state
  const [galleryName, setGalleryName] = useState('Demo Gallery');
  const [galleryLogo, setGalleryLogo] = useState<string | null>(null);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [tempEventChanges, setTempEventChanges] = useState<Partial<Event>>({});

  const history = useHistory();

  useEffect(() => {
    // Check authentication
    // const isAuthenticated = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');

    // Temporarily disable authentication check for testing
    // if (!isAuthenticated) {
    //   history.push('/admin/login');
    //   return;
    // }

    if (email) {
      setUserEmail(email);
    } else {
      // Set default email for testing
      setUserEmail('admin@gallery.com');
    }

    // Initialize sample data and load clients, events, and items
    ClientService.initializeSampleData();
    EventService.initializeSampleData();
    ItemService.initializeSampleData();
    loadClients();
    loadClientStats();
    loadEvents();
    loadEventStats();
    loadItems();
    loadItemStats();
    loadActiveEvent();
    loadGallerySettings();

    // Add a storage event listener to detect changes to localStorage
    // This will allow the component to update when settings are changed in another tab/window
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'gallery_settings') {
        console.log('Settings changed in another window, reloading gallery settings');
        loadGallerySettings();
      }
    };

    // Add a custom event listener for same-tab changes
    const handleCustomStorageChange = () => {
      console.log('Settings changed in same tab, reloading gallery settings');
      loadGallerySettings();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('gallerySettingsChanged', handleCustomStorageChange as EventListener);

    // Clean up event listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('gallerySettingsChanged', handleCustomStorageChange as EventListener);
    };
  }, [history]);

  const loadGallerySettings = async () => {
    const settings = await GallerySettingsService.getOrInitializeSettings();
    setGalleryName(settings.galleryName);

    const activeLogo = await GallerySettingsService.getActiveLogo();
    if (activeLogo) {
      setGalleryLogo(activeLogo.url);
    }
  };

  const loadClients = async () => {
    const allClients = await ClientService.getAllClients();
    setClients(allClients);
  };

  const loadClientStats = async () => {
    const stats = await ClientService.getClientStats();
    setClientStats(stats);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const searchResults = await ClientService.searchClients(query);
      setClients(searchResults);
    } else {
      loadClients();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    history.push('/');
  };

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsClientFormOpen(true);
  };

  const handleClientFormSave = () => {
    loadClients();
    loadClientStats();
  };

  const handleClientFormClose = () => {
    setIsClientFormOpen(false);
    setSelectedClient(null);
  };

  // Event management functions
  const loadEvents = async () => {
    const allEvents = await EventService.getAllEvents();
    setEvents(allEvents);
  };

  const loadEventStats = async () => {
    const stats = await EventService.getEventStats();
    setEventStats({
      totalEvents: stats.totalEvents,
      activeEvents: stats.activeEvents,
      upcomingEvents: stats.upcomingEvents,
      completedEvents: stats.completedEvents
    });
  };

  const handleEventSearch = async (query: string) => {
    setEventSearchQuery(query);
    if (query.trim()) {
      const searchResults = await EventService.searchEvents(query);
      setEvents(searchResults);
    } else {
      loadEvents();
    }
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsEventFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    handleStartEdit(event);
  };

  const handleEventFormSave = () => {
    loadEvents();
    loadEventStats();
  };

  const handleEventFormClose = () => {
    setIsEventFormOpen(false);
    setSelectedEvent(null);
  };

  // Item management functions
  const loadItems = async () => {
    const allItems = await ItemService.getAllItems();
    setItems(allItems);
  };

  const loadItemStats = async () => {
    const stats = await ItemService.getItemStats();
    setItemStats({
      totalItems: stats.totalItems,
      availableItems: stats.availableItems,
      soldItems: stats.soldItems,
      reservedItems: stats.reservedItems,
      totalValue: stats.totalValue,
      averagePrice: stats.averagePrice
    });
  };

  const handleItemSearch = async (query: string) => {
    setItemSearchQuery(query);
    if (query.trim()) {
      const searchResults = await ItemService.searchItems(query);
      setItems(searchResults);
    } else {
      loadItems();
    }
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsItemFormOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setIsItemFormOpen(true);
  };

  const handleItemFormSave = () => {
    loadItems();
    loadItemStats();
  };

  const handleItemFormClose = () => {
    setIsItemFormOpen(false);
    setSelectedItem(null);
  };

  // Active event management
  const handleSetActiveEvent = async (eventId: string) => {
    await GallerySettingsService.updateActiveEvent(eventId);
    setActiveEventId(eventId);
  };

  const loadActiveEvent = async () => {
    const activeId = await GallerySettingsService.getActiveEventId();
    setActiveEventId(activeId);
  };

  // Edit mode functions
  const handleStartEdit = (event: Event) => {
    setIsEditMode(true);
    setEditingEvent(event);
    setTempEventChanges({
      imageUrl: event.imageUrl,
      backgroundImages: event.backgroundImages || []
    });
  };

  const handleSaveEdit = () => {
    if (editingEvent && Object.keys(tempEventChanges).length > 0) {
      const updatedEvent = {...editingEvent, ...tempEventChanges};
      EventService.updateEvent(editingEvent.id, updatedEvent)
        .then(() => {
          // Update the selected event and events list
          setSelectedEvent(updatedEvent);
          loadEvents();

          // If showItems was changed, save the preference to localStorage
          if (tempEventChanges.showItems !== undefined &&
            tempEventChanges.showItems !== editingEvent.showItems &&
            editingEvent.id === activeEventId) {
            localStorage.setItem('gallery_show_items_preference', tempEventChanges.showItems.toString());
          }
        })
        .catch((error) => {
          console.error('Error updating event:', error);
        });
    }

    setIsEditMode(false);
    setEditingEvent(null);
    setTempEventChanges({});
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingEvent(null);
    setTempEventChanges({});
  };

  const handleSetBackgroundImage = (imageUrl: string) => {
    if (isEditMode) {
      setTempEventChanges(prev => ({
        ...prev,
        imageUrl
      }));
    }
  };

  const handleAddBackgroundImage = (imageUrl: string) => {
    if (isEditMode) {
      const currentImages = tempEventChanges.backgroundImages || editingEvent?.backgroundImages || [];
      const updatedImages = [...currentImages, imageUrl];

      setTempEventChanges(prev => ({
        ...prev,
        backgroundImages: updatedImages,
        // If no background image is set, make this the background
        imageUrl: prev.imageUrl || imageUrl
      }));
    }
  };

  const handleRemoveBackgroundImage = (imageUrl: string) => {
    if (isEditMode) {
      const currentImages = tempEventChanges.backgroundImages || editingEvent?.backgroundImages || [];
      const updatedImages = currentImages.filter(img => img !== imageUrl);

      setTempEventChanges(prev => ({
        ...prev,
        backgroundImages: updatedImages,
        // If we removed the background image, set a new one or clear it
        imageUrl: prev.imageUrl === imageUrl ? (updatedImages.length > 0 ? updatedImages[0] : '') : prev.imageUrl
      }));
    }
  };

  const menuItems = [
    {id: 'dashboard', label: 'Dashboard', icon: statsChart},
    {id: 'events', label: 'Events', icon: calendar},
    {id: 'clients', label: 'Clients', icon: people},
    {id: 'items', label: 'Items', icon: images},
    {id: 'settings', label: 'Settings', icon: settings}
  ];

  const renderDashboard = () => (
    <div className="dashboard-content">
      <IonGrid>
        <IonRow>
          <IonCol size="12" sizeMd="6" sizeLg="3">
            <IonCard className="stat-card">
              <IonCardContent>
                <div className="stat-item">
                  <IonIcon icon={people} className="stat-icon"/>
                  <div>
                    <h2>{dummyStats.totalVisitors}</h2>
                    <p>Total Visitors</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol size="12" sizeMd="6" sizeLg="3">
            <IonCard className="stat-card">
              <IonCardContent>
                <div className="stat-item">
                  <IonIcon icon={person} className="stat-icon"/>
                  <div>
                    <h2>{dummyStats.totalClients}</h2>
                    <p>Total Clients</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol size="12" sizeMd="6" sizeLg="3">
            <IonCard className="stat-card">
              <IonCardContent>
                <div className="stat-item">
                  <IonIcon icon={calendar} className="stat-icon"/>
                  <div>
                    <h2>{dummyStats.activeEvents}</h2>
                    <p>Active Events</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol size="12" sizeMd="6" sizeLg="3">
            <IonCard className="stat-card">
              <IonCardContent>
                <div className="stat-item">
                  <IonIcon icon={images} className="stat-icon"/>
                  <div>
                    <h2>{dummyStats.totalItems}</h2>
                    <p>Total Items</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol size="12">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Recent Visitors</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  {dummyRecentVisitors.map((visitor) => (
                    <IonItem key={visitor.id}>
                      <IonAvatar slot="start">
                        <div className="avatar-placeholder">
                          {visitor.name.charAt(0)}
                        </div>
                      </IonAvatar>
                      <IonLabel>
                        <h3>{visitor.name}</h3>
                        <p>{visitor.email}</p>
                        <p>Interested in: {visitor.interest}</p>
                      </IonLabel>
                      <IonBadge slot="end">{visitor.visitDate}</IonBadge>
                    </IonItem>
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );

  const renderContent = () => {
    switch (selectedSection) {
      case 'dashboard':
        return renderDashboard();
      case 'events':
        return (
          <div className="section-content events-management">
            <div className="events-layout">
              {/* Left Column - Event List */}
              <div className="events-sidebar">
                <div className="events-sidebar-header">
                  <h3>Events</h3>
                  <IonButton fill="clear" size="small" onClick={handleAddEvent}>
                    <IonIcon icon={add}/>
                  </IonButton>
                </div>

                <IonSearchbar
                  value={eventSearchQuery}
                  onIonInput={(e) => handleEventSearch(e.detail.value!)}
                  placeholder="Search events..."
                  className="events-sidebar-search"
                />

                <div className="events-sidebar-list">
                  {events.length === 0 ? (
                    <div className="no-events">
                      <p>No events found.</p>
                    </div>
                  ) : (
                    events.map((event) => (
                      <div
                        key={event.id}
                        className={`event-sidebar-item ${selectedEvent?.id === event.id ? 'selected' : ''}`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="event-sidebar-header">
                          <h4>{event.title}</h4>
                          <IonBadge
                            color={
                              event.status === 'Active' ? 'success' :
                                event.status === 'Published' ? 'primary' :
                                  event.status === 'Draft' ? 'medium' :
                                    event.status === 'Completed' ? 'dark' :
                                      'warning'
                            }
                          >
                            {event.status}
                          </IonBadge>
                        </div>
                        <p className="event-sidebar-type">{event.eventType}</p>
                        <p className="event-sidebar-date">
                          {new Date(event.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column - Event Details */}
              <div className="events-main">
                {selectedEvent ? (
                  <div className="event-details-panel">
                    <div className="event-details-header">
                      <div className="event-title-section">
                        <h2>{selectedEvent.title}</h2>
                        <div className="event-actions">
                          <IonButton
                            fill="outline"
                            size="small"
                            onClick={() => handleSetActiveEvent(selectedEvent.id)}
                            color={selectedEvent.id === activeEventId ? 'success' : 'primary'}
                          >
                            {selectedEvent.id === activeEventId ? 'Active Event' : 'Set as Active'}
                          </IonButton>
                          <IonButton fill="clear" size="small" onClick={() => handleEditEvent(selectedEvent)}>
                            Edit
                          </IonButton>
                        </div>
                      </div>
                      <IonBadge color={
                        selectedEvent.status === 'Active' ? 'success' :
                          selectedEvent.status === 'Published' ? 'primary' :
                            selectedEvent.status === 'Draft' ? 'medium' :
                              selectedEvent.status === 'Completed' ? 'dark' :
                                'warning'
                      }>
                        {selectedEvent.status}
                      </IonBadge>
                    </div>

                    <div className="event-details-content">
                      <p className="event-description">{selectedEvent.description}</p>

                      <div className="event-info-grid">
                        <div className="event-info-item">
                          <strong>Type:</strong> {selectedEvent.eventType}
                        </div>
                        <div className="event-info-item">
                          <strong>Location:</strong> {selectedEvent.location}
                        </div>
                        <div className="event-info-item">
                          <strong>Date:</strong> {new Date(selectedEvent.startDate).toLocaleDateString()} - {new Date(selectedEvent.endDate).toLocaleDateString()}
                        </div>
                        <div className="event-info-item">
                          <strong>Time:</strong> {selectedEvent.startTime} - {selectedEvent.endTime}
                        </div>
                        <div className="event-info-item">
                          <strong>Attendees:</strong> {selectedEvent.currentAttendees}{selectedEvent.maxAttendees ? ` / ${selectedEvent.maxAttendees}` : ''}
                        </div>
                        {selectedEvent.isTicketed && selectedEvent.ticketPrice && (
                          <div className="event-info-item">
                            <strong>Price:</strong> £{selectedEvent.ticketPrice}
                          </div>
                        )}
                      </div>

                      {selectedEvent.featuredArtists.length > 0 && (
                        <div className="event-section">
                          <h4>Featured Artists</h4>
                          <div className="event-tags">
                            {selectedEvent.featuredArtists.map((artist, index) => (
                              <IonBadge key={index} color="secondary" className="tag">
                                {artist}
                              </IonBadge>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedEvent.featuredArtworks.length > 0 && (
                        <div className="event-section">
                          <h4>Featured Artworks</h4>
                          <div className="event-tags">
                            {selectedEvent.featuredArtworks.map((artwork, index) => (
                              <IonBadge key={index} color="tertiary" className="tag">
                                {artwork}
                              </IonBadge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Show Items Toggle */}
                      <div className="event-section">
                        <div className="event-info-row">
                          <div className="event-info-label">
                            <strong>Show Items Carousel:</strong>
                          </div>
                          <div className="event-toggle-control">
                            <IonButton
                              fill={selectedEvent.showItems ? "solid" : "outline"}
                              color={selectedEvent.showItems ? "success" : "medium"}
                              size="small"
                              onClick={() => {
                                if (!isEditMode) {
                                  // Start edit mode if not already in it
                                  handleStartEdit(selectedEvent);
                                  const newShowItemsValue = !selectedEvent.showItems;
                                  setTempEventChanges(prev => ({
                                    ...prev,
                                    showItems: newShowItemsValue
                                  }));

                                  // Also update the global setting if this is the active event
                                  if (selectedEvent.id === activeEventId) {
                                    GallerySettingsService.updateShowItemCards(newShowItemsValue);
                                  }
                                } else {
                                  // Already in edit mode, just update the temp changes
                                  const newShowItemsValue = !tempEventChanges.showItems && !selectedEvent.showItems;
                                  setTempEventChanges(prev => ({
                                    ...prev,
                                    showItems: newShowItemsValue
                                  }));

                                  // Also update the global setting if this is the active event
                                  if (selectedEvent.id === activeEventId) {
                                    GallerySettingsService.updateShowItemCards(newShowItemsValue);
                                  }
                                }
                              }}
                            >
                              {isEditMode
                                ? (tempEventChanges.showItems !== undefined
                                  ? tempEventChanges.showItems
                                  : selectedEvent.showItems)
                                  ? "Enabled"
                                  : "Disabled"
                                : selectedEvent.showItems
                                  ? "Enabled"
                                  : "Disabled"
                              }
                            </IonButton>
                            <p className="event-toggle-description">
                              {selectedEvent.featuredItems && selectedEvent.featuredItems.length > 0
                                ? `Controls visibility of ${selectedEvent.featuredItems.length} items in the visitor landing carousel.`
                                : "No items currently attached to this event. Add items to display in the carousel."}
                            </p>
                          </div>
                        </div>
                      </div>

                      {selectedEvent.tags.length > 0 && (
                        <div className="event-section">
                          <h4>Tags</h4>
                          <div className="event-tags">
                            {selectedEvent.tags.map((tag, index) => (
                              <IonBadge key={index} color="medium" className="tag">
                                {tag}
                              </IonBadge>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedEvent.specialInstructions && (
                        <div className="event-section">
                          <h4>Special Instructions</h4>
                          <p>{selectedEvent.specialInstructions}</p>
                        </div>
                      )}

                      <div className="event-contact">
                        <h4>Contact Information</h4>
                        <p><strong>Email:</strong> {selectedEvent.contactEmail}</p>
                        {selectedEvent.contactPhone && (
                          <p><strong>Phone:</strong> {selectedEvent.contactPhone}</p>
                        )}
                      </div>

                      {/* Background Images Section */}
                      <div className="event-section">
                        <div className="event-info-row">
                          <div className="event-info-label">
                            <strong>Background Images:</strong>
                          </div>
                          <div className="event-background-images">
                            {isEditMode ? (
                              <div className="background-images-edit">
                                <div className="background-images-thumbnails">
                                  {(tempEventChanges.backgroundImages || editingEvent?.backgroundImages || []).map((imageUrl, index) => (
                                    <div
                                      key={index}
                                      className={`background-thumbnail ${(tempEventChanges.imageUrl || editingEvent?.imageUrl) === imageUrl ? 'active' : ''}`}
                                      onClick={() => handleSetBackgroundImage(imageUrl)}
                                    >
                                      <img src={imageUrl} alt={`Background ${index + 1}`}/>
                                      {(tempEventChanges.imageUrl || editingEvent?.imageUrl) === imageUrl && (
                                        <div className="active-indicator">
                                          <IonIcon icon={star}/>
                                        </div>
                                      )}
                                      <div className="thumbnail-actions">
                                        <IonButton
                                          fill="clear"
                                          size="small"
                                          color="danger"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveBackgroundImage(imageUrl);
                                          }}
                                        >
                                          <IonIcon icon={trash}/>
                                        </IonButton>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="add-image-button">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      style={{display: 'none'}}
                                      id="background-image-upload"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onload = (event) => {
                                            const imageUrl = event.target?.result as string;
                                            handleAddBackgroundImage(imageUrl);
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                    <IonButton
                                      fill="outline"
                                      size="small"
                                      onClick={() => document.getElementById('background-image-upload')?.click()}
                                    >
                                      <IonIcon icon={cloudUpload} slot="start"/>
                                      Add Image
                                    </IonButton>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="background-images-display">
                                {selectedEvent.backgroundImages && selectedEvent.backgroundImages.length > 0 ? (
                                  <div className="background-images-thumbnails">
                                    {selectedEvent.backgroundImages.map((imageUrl, index) => (
                                      <div
                                        key={index}
                                        className={`background-thumbnail ${selectedEvent.imageUrl === imageUrl ? 'active' : ''}`}
                                      >
                                        <img src={imageUrl} alt={`Background ${index + 1}`}/>
                                        {selectedEvent.imageUrl === imageUrl && (
                                          <div className="active-indicator">
                                            <IonIcon icon={star}/>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                    <IonButton
                                      fill="clear"
                                      size="small"
                                      onClick={() => handleStartEdit(selectedEvent)}
                                    >
                                      Edit Images
                                    </IonButton>
                                  </div>
                                ) : (
                                  <div className="no-background-images">
                                    <p>No background images</p>
                                    <IonButton
                                      fill="outline"
                                      size="small"
                                      onClick={() => handleStartEdit(selectedEvent)}
                                    >
                                      <IonIcon icon={add} slot="start"/>
                                      Add Images
                                    </IonButton>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="event-meta">
                        <p><strong>Created:</strong> {new Date(selectedEvent.createdAt).toLocaleDateString()}</p>
                        <p><strong>Updated:</strong> {new Date(selectedEvent.updatedAt).toLocaleDateString()}</p>
                        <p><strong>Visibility:</strong> {selectedEvent.isPublic ? 'Public' : 'Private'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-event-selected">
                    <div className="event-stats">
                      <IonBadge color="primary">{eventStats.totalEvents} Total</IonBadge>
                      <IonBadge color="success">{eventStats.activeEvents} Active</IonBadge>
                      <IonBadge color="warning">{eventStats.upcomingEvents} Upcoming</IonBadge>
                      <IonBadge color="medium">{eventStats.completedEvents} Completed</IonBadge>
                    </div>
                    <h3>Select an event to view details</h3>
                    <p>Choose an event from the list on the left to see its full details and manage its settings.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'clients':
        return (
          <div className="section-content">
            <div className="section-header">
              <h2>Client Management</h2>
              <div className="client-stats">
                <IonBadge color="primary">{clientStats.totalClients} Total</IonBadge>
                <IonBadge color="success">{clientStats.emailListClients} Email List</IonBadge>
              </div>
            </div>

            <IonSearchbar
              value={searchQuery}
              onIonInput={(e) => handleSearch(e.detail.value!)}
              placeholder="Search clients by name, email, location..."
              className="client-search"
            />

            <div className="clients-list">
              {clients.length === 0 ? (
                <IonCard>
                  <IonCardContent>
                    <p>No clients
                      found. {searchQuery ? 'Try adjusting your search.' : 'Add your first client to get started.'}</p>
                  </IonCardContent>
                </IonCard>
              ) : (
                clients.map((client) => (
                  <IonCard key={client.id} className="client-card">
                    <IonCardContent>
                      <div className="client-info">
                        <IonAvatar className="client-avatar">
                          <div className="avatar-placeholder">
                            {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                          </div>
                        </IonAvatar>

                        <div className="client-details">

                          <h3>{client.firstName} {client.lastName}</h3>
                          <p>{client.email}</p>
                          <p>{client.townCity}, {client.country}</p>
                          {client.generalInformation && (
                            <p className="client-notes">{client.generalInformation}</p>
                          )}
                          <div className="client-tags">
                            {client.categories.slice(0, 3).map((category, index) => (
                              <IonBadge key={index} color="medium" className="tag">
                                {category.name}
                              </IonBadge>
                            ))}
                            {client.categories.length > 3 && (
                              <IonBadge color="light" className="tag">
                                +{client.categories.length - 3} more
                              </IonBadge>
                            )}
                          </div>
                          <div className="client-interests">
                            {client.interests.slice(0, 2).map((interest, index) => (
                              <IonBadge key={index} color="tertiary" className="tag">
                                {interest.name}
                              </IonBadge>
                            ))}
                            {client.interests.length > 2 && (
                              <IonBadge color="light" className="tag">
                                +{client.interests.length - 2} interests
                              </IonBadge>
                            )}
                          </div>
                        </div>
                        <div className="client-actions">
                          {client.onEmailList && (
                            <IonBadge color="success">
                              <IonIcon icon={mail}/>
                            </IonBadge>
                          )}
                          <p className="client-date">
                            Added: {new Date(client.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))
              )}
            </div>

            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton onClick={handleAddClient}>
                <IonIcon icon={add}/>
              </IonFabButton>
            </IonFab>
          </div>
        );
      case 'items':
        return (
          <div className="section-content">
            <div className="section-header">
              <h2>Item Management</h2>
              <div className="item-stats">
                <IonBadge color="primary">{itemStats.totalItems} Total</IonBadge>
                <IonBadge color="success">{itemStats.availableItems} Available</IonBadge>
                <IonBadge color="warning">{itemStats.soldItems} Sold</IonBadge>
                <IonBadge color="medium">{itemStats.reservedItems} Reserved</IonBadge>
              </div>
            </div>

            <IonSearchbar
              value={itemSearchQuery}
              onIonInput={(e) => handleItemSearch(e.detail.value!)}
              placeholder="Search items by title, artist, medium, category..."
              className="item-search"
            />

            <div className="items-list">
              {items.length === 0 ? (
                <IonCard>
                  <IonCardContent>
                    <p>No items
                      found. {itemSearchQuery ? 'Try adjusting your search.' : 'Add your first item to get started.'}</p>
                  </IonCardContent>
                </IonCard>
              ) : (
                items.map((item) => (
                  <IonCard key={item.id} className="item-card" button onClick={() => handleEditItem(item)}>
                    <IonCardContent>
                      <div className="item-info">
                        <div className="item-image">
                          {item.thumbnailImage ? (
                            <img src={item.thumbnailImage} alt={item.title}/>
                          ) : (
                            <div className="image-placeholder">
                              <IonIcon icon={images}/>
                            </div>
                          )}
                        </div>
                        <div className="item-details">
                          <div className="item-header">
                            <h3>{item.title}</h3>
                            <IonBadge color={
                              item.status === 'Available' ? 'success' :
                                item.status === 'Sold' ? 'dark' :
                                  item.status === 'Reserved' ? 'warning' :
                                    item.status === 'On Loan' ? 'tertiary' :
                                      item.status === 'In Restoration' ? 'medium' :
                                        'light'
                            }>
                              {item.status}
                            </IonBadge>
                          </div>
                          <p className="item-artist"><strong>Artist:</strong> {item.artist}</p>
                          <p className="item-medium"><strong>Medium:</strong> {item.medium}</p>
                          <p className="item-dimensions"><strong>Dimensions:</strong> {item.dimensions}</p>
                          <p className="item-year"><strong>Year:</strong> {item.year}</p>
                          <div className="item-pricing">
                            <p><strong>Price:</strong> {item.currency} {item.price.toLocaleString()}</p>
                            <p>
                              <strong>Estimated Value:</strong> {item.currency} {item.estimatedValue.toLocaleString()}
                            </p>
                          </div>
                          <div className="item-location">
                            <p><strong>Location:</strong> {item.location}</p>
                            <p><strong>Category:</strong> {item.category}</p>
                          </div>
                          {item.tags.length > 0 && (
                            <div className="item-tags">
                              {item.tags.slice(0, 4).map((tag, index) => (
                                <IonBadge key={index} color="tertiary" className="tag">
                                  {tag}
                                </IonBadge>
                              ))}
                              {item.tags.length > 4 && (
                                <IonBadge color="light" className="tag">
                                  +{item.tags.length - 4} more
                                </IonBadge>
                              )}
                            </div>
                          )}
                          <div className="item-footer">
                            <div className="item-features">
                              {item.isFeatured && (
                                <IonBadge color="secondary">Featured</IonBadge>
                              )}
                              {item.isFramed && (
                                <IonBadge color="medium">Framed</IonBadge>
                              )}
                              {item.certificate && (
                                <IonBadge color="success">Certified</IonBadge>
                              )}
                              {!item.isPubliclyVisible && (
                                <IonBadge color="warning">Private</IonBadge>
                              )}
                            </div>
                            <p className="item-date">
                              Added: {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))
              )}
            </div>

            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton onClick={handleAddItem}>
                <IonIcon icon={add}/>
              </IonFabButton>
            </IonFab>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <IonPage>
      <IonSplitPane contentId="main-content">
        <IonMenu contentId="main-content" type="overlay">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Gallery Admin</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {/* Gallery/Company Section */}
            <div className="company-section">
              <IonCard>
                <IonCardContent>
                  <div className="company-info">
                    {galleryLogo ? (
                      <div className="company-logo">
                        <img src={galleryLogo} alt={galleryName}/>
                      </div>
                    ) : (
                      <IonAvatar className="company-logo">
                        <div className="logo-placeholder">
                          <IonIcon icon={business}/>
                        </div>
                      </IonAvatar>
                    )}
                    <div>
                      <h3>{galleryName}</h3>
                      <p>123 Art Street, London</p>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>

            {/* Navigation Menu */}
            <IonList>
              {menuItems.map((item) => (
                <IonItem
                  key={item.id}
                  button
                  className={selectedSection === item.id ? 'selected' : ''}
                  onClick={() => {
                    if (item.id === 'settings') {
                      history.push('/admin/settings');
                    } else {
                      setSelectedSection(item.id);
                    }
                  }}
                >
                  <IonIcon icon={item.icon} slot="start"/>
                  <IonLabel>{item.label}</IonLabel>
                </IonItem>
              ))}
            </IonList>

            {/* Personal Account Section */}
            <div className="personal-section">
              <IonCard>
                <IonCardContent>
                  <div className="personal-info">
                    <IonAvatar>
                      <div className="avatar-placeholder">
                        {userEmail.charAt(0).toUpperCase()}
                      </div>
                    </IonAvatar>
                    <div>
                      <h4>Admin User</h4>
                      <p>{userEmail}</p>
                    </div>
                  </div>
                  <IonButton
                    fill="clear"
                    size="small"
                    onClick={handleLogout}
                    className="logout-button"
                  >
                    <IonIcon icon={logOut} slot="start"/>
                    Logout
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </div>
          </IonContent>
        </IonMenu>

        <div className="ion-page" id="main-content">
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton/>
              </IonButtons>
              <IonTitle>
                {menuItems.find(item => item.id === selectedSection)?.label || 'Dashboard'}
              </IonTitle>
              <IonButtons slot="end">
                {isEditMode ? (
                  <>
                    <IonButton fill="clear" color="medium" onClick={handleCancelEdit}>
                      <IonIcon icon={close} slot="start"/>
                      Cancel
                    </IonButton>
                    <IonButton fill="solid" color="primary" onClick={handleSaveEdit}>
                      <IonIcon icon={checkmark} slot="start"/>
                      Done
                    </IonButton>
                  </>
                ) : (
                  <IonButton fill="clear" onClick={() => history.push('/')}>
                    <IonIcon icon={home}/>
                  </IonButton>
                )}
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {renderContent()}
          </IonContent>
        </div>
      </IonSplitPane>

      <ClientForm
        isOpen={isClientFormOpen}
        onDidDismiss={handleClientFormClose}
        client={selectedClient}
        onSave={handleClientFormSave}
      />

      <EventForm
        isOpen={isEventFormOpen}
        onDidDismiss={handleEventFormClose}
        event={selectedEvent}
        onSave={handleEventFormSave}
      />

      <ItemForm
        isOpen={isItemFormOpen}
        onDidDismiss={handleItemFormClose}
        item={selectedItem}
        onSave={handleItemFormSave}
      />
    </IonPage>
  );
};

export default AdminDashboard;
