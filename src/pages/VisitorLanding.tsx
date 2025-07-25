import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonToast,
  IonChip,
  IonFabButton
} from '@ionic/react';
import { close, lockClosed, person, chevronDown } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { ItemService } from '../services/ItemService';
import { Item } from '../types/Item';
import { GallerySettingsService } from '../services/GallerySettingsService';
import { EventService } from '../services/EventService';
import { Event } from '../types/Event';
import { LogoImage } from '../types/GallerySettings';
import { useMemo } from 'react';
import useColorExtraction from './VisitorLanding/hooks/useColorExtraction';
import './VisitorLanding.css';

const VisitorLanding: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const [showItemCards, setShowItemCards] = useState(true);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [galleryLogo, setGalleryLogo] = useState<LogoImage | null>(null);
  const [galleryName, setGalleryName] = useState<string>('');
  const [visitorForm, setVisitorForm] = useState({
    name: '',
    email: '',
    message: '',
    interest: ''
  });
  const [adminForm, setAdminForm] = useState({
    email: 'admin@gallery.com',
    password: ''
  });
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const history = useHistory();

  // Add a function to load all data that can be called when needed
  const loadData = async () => {
    // Initialize sample data if needed
    await ItemService.initializeSampleData();
    await EventService.initializeSampleData();
    
    // Load gallery settings - this is the global preference
    const showCards = await GallerySettingsService.getShowItemCards();
    setShowItemCards(showCards);
    
    // Load gallery logo and name
    const activeLogo = await GallerySettingsService.getActiveLogo();
    setGalleryLogo(activeLogo);
    
    const settings = await GallerySettingsService.getOrInitializeSettings();
    setGalleryName(settings.galleryName);
    
    console.log('Show items carousel:', showCards);
  };
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
    const handleCustomStorageChange = () => {
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

  useEffect(() => {
    const handler = async () => {
      // Load active event and items
      const activeEventId = await GallerySettingsService.getActiveEventId();
      let currentEvent: Event | null = null;
      let currentItems: Item[] = [];

      if (activeEventId) {
        currentEvent = await EventService.getEventById(activeEventId);
        setActiveEvent(currentEvent);

        // First check the global setting - if it's false, don't show items regardless
        if (!showItemCards) {
          currentItems = [];
          setItems([]);
          // Global setting takes precedence
          setShowItemCards(false);
        }
        // Then check if event-specific showItems is explicitly set to false
        else if (currentEvent?.showItems === false) {
          // If showItems is false, don't show items regardless of whether there are featured items
          currentItems = [];
          setItems([]);
          setShowItemCards(false);
        } else if (currentEvent && currentEvent.featuredItems && currentEvent.featuredItems.length > 0) {
          // If global and event settings allow showing items, and there are featured items, show them
          const featuredItems = (
            await Promise.all(
              currentEvent.featuredItems.map(itemId => ItemService.getItemById(itemId))
            )
          ).filter(item => item !== null) as Item[];
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
        const publicItems = await ItemService.getPublicItems();
        currentItems = publicItems;
        setItems(publicItems);
      }

      // Load background images - use event default image if no carousel items
      let bgImages = await ItemService.getLandingPageBackgroundImages();

      // If there's an active event with no featured items but has an image, use that as background
      if (activeEventId && currentEvent && currentItems.length === 0 && currentEvent.imageUrl) {
        bgImages = [currentEvent.imageUrl];
      }

      setBackgroundImages(bgImages);
    }
    handler();
  }, [showItemCards]);

  // Get the current background image URL
  const currentBackgroundImage = useMemo(() => {
    if (backgroundImages.length > 0) {
      return backgroundImages[currentBackgroundIndex];
    }
    return null;
  }, [backgroundImages, currentBackgroundIndex]);

  // Extract dominant dark color from current background image
  useColorExtraction(currentBackgroundImage);

  // Function to update gradient heights based on content position
  const updateGradientHeights = () => {
    // Find the event description container
    const descriptionContainer = document.querySelector('.event-description-container');
    const eventTitle = document.querySelector('.event-banner-info h2');
    
    if (descriptionContainer && eventTitle) {
      // Get the position of the description container relative to the viewport
      const descRect = descriptionContainer.getBoundingClientRect();
      const titleRect = eventTitle.getBoundingClientRect();
      
      // Calculate the distance from the bottom of the viewport to the top of the description
      const solidHeight = window.innerHeight - descRect.top;
      
      // Calculate the height for the gradient (from description to above title)
      const gradientHeight = descRect.top - titleRect.top + 20; // Add 20px to extend slightly above title
      
      // Set the heights of the gradient elements
      const solidElement = document.querySelector('.dynamic-bottom-solid') as HTMLElement;
      const gradientElement = document.querySelector('.dynamic-bottom-gradient') as HTMLElement;
      
      if (solidElement && gradientElement) {
        // Set the solid color height
        solidElement.style.height = `${solidHeight}px`;
        
        // Set the gradient height and position
        gradientElement.style.height = `${gradientHeight}px`;
        gradientElement.style.bottom = `${solidHeight}px`;
        
        console.log('Updated gradient heights:', { solidHeight, gradientHeight });
      }
    }
  };

  // Update gradient heights when content changes or window resizes
  useEffect(() => {
    // Initial update with a slight delay to ensure DOM is fully rendered
    const initialUpdateTimer = setTimeout(() => {
      updateGradientHeights();
      console.log('Initial gradient height update');
    }, 300);
    
    // Set up event listeners for window resize
    window.addEventListener('resize', updateGradientHeights);
    
    // Set up a mutation observer to detect DOM changes
    const observer = new MutationObserver(() => {
      // Add a small delay to let the DOM settle after changes
      setTimeout(updateGradientHeights, 100);
    });
    
    const contentContainer = document.querySelector('.bottom-content-overlay');
    
    if (contentContainer) {
      observer.observe(contentContainer, { 
        childList: true, 
        subtree: true,
        attributes: true,
        characterData: true
      });
    }
    
    // Clean up
    return () => {
      clearTimeout(initialUpdateTimer);
      window.removeEventListener('resize', updateGradientHeights);
      observer.disconnect();
    };
  }, [activeEvent, items]); // Re-run when content changes
  
  // Additional effect to update gradient heights when the component mounts
  useEffect(() => {
    // Update gradient heights after component has fully mounted
    const mountTimer = setTimeout(() => {
      updateGradientHeights();
      console.log('Mount gradient height update');
    }, 500);
    
    return () => clearTimeout(mountTimer);
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    // Set up background image rotation if there are multiple images
    if (backgroundImages.length > 1) {
      // Pre-load all images to ensure smooth transitions
      backgroundImages.forEach(imgSrc => {
        const img = new Image();
        img.src = imgSrc;
      });
      
      const interval = setInterval(() => {
        // Log when rotation is about to happen for debugging
        console.log('Background image rotation triggered');
        
        // Update the background image index
        setCurrentBackgroundIndex(prevIndex => 
          prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
        );
        
        // The color extraction will happen with a 1-second delay (in useColorExtraction hook)
        // This creates a coordinated sequence:
        // 1. Background image starts fading in (0s)
        // 2. Color extraction begins (1s)
        // 3. Background image completes fade (2s)
        // 4. Colors complete transition (3s)
      }, 20000); // 20 seconds per image
      
      return () => clearInterval(interval);
    }
  }, [backgroundImages.length]);

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setIsItemModalOpen(true);
  };

  const handleAdminLogin = () => {
    setIsAdminModalOpen(true);
  };

  const handleAdminSubmit = () => {
    // Demo credentials
    if (adminForm.email === 'admin@gallery.com' && adminForm.password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', adminForm.email);
      setIsAdminModalOpen(false);
      setAdminForm({ email: 'admin@gallery.com', password: '' });
      history.push('/admin');
    } else {
      setToastMessage('Invalid credentials. Use admin@gallery.com / admin123');
      setShowToast(true);
    }
  };

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

  const formatPrice = (price: number, currency: string) => {
    if (price >= 1000000) {
      return `${currency} ${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `${currency} ${(price / 1000).toFixed(0)}K`;
    }
    return `${currency} ${price.toLocaleString()}`;
  };

  return (
    <IonPage>
      {/* Fixed Header */}
      <IonHeader className="ion-no-border">
        <IonToolbar className="transparent-toolbar">
          <IonButtons slot="start" style={{marginTop: -28}}>
            <IonFabButton 
              className="admin-login-fab"
              onClick={handleAdminLogin}
              style={{
                '--background': 'var(--dynamic-dark-color-solid)',
                transition: 'background-color 2s ease-in-out',
                margin: '16px 0 0 16px'
              }}
            >
              <img 
                src="/touchid.svg" 
                alt="Admin Login" 
                style={{ 
                  filter: 'invert(1)', 
                  width: '60%', 
                  height: '60%' 
                }} 
              />
            </IonFabButton>
          </IonButtons>
          
          {galleryLogo && (
            <div className="gallery-logo" slot="start">
              <img src={galleryLogo.url} alt={galleryName} />
            </div>
          )}
          {!galleryLogo && (
            <IonTitle className="gallery-name">{galleryName}</IonTitle>
          )}
          <IonButtons slot="end">
            <IonButton
            shape="round"
            className='visitor-services-button'
            >
              <div className='visitor-sevices-button-content'>
              Visitor services
              <IonIcon icon={chevronDown} slot="end"/>
              </div>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen scrollY={false} className="visitor-landing">
        
        {/* Background Image Container */}
        <div className="background-container">
          {backgroundImages.length > 0 ? (
            backgroundImages.map((image, index) => (
              <div
                key={index}
                className={`background-image ${index === currentBackgroundIndex ? 'active' : ''}`}
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
            ))
          ) : (
            <div 
              className="background-image active"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            ></div>
          )}
        </div>
        
        {/* Main Content Container */}
        <div className="main-content-container">
          {/* Spacer to push content to bottom */}
          <div className="flex-spacer"></div>
        </div>
        
        {/* Level 2: Black Gradient Overlay */}
        <div className="black-gradient-overlay"></div>
        
        {/* Level 3: Dynamic Bottom Solid Color */}
        <div className="dynamic-bottom-solid"></div>
        
        {/* Level 3: Dynamic Bottom Gradient */}
        <div className="dynamic-bottom-gradient"></div>
        
        {/* Bottom Content Overlay */}
        <div className="bottom-content-overlay">
          {/* Conditional rendering based on whether there's an active event with description */}
          {activeEvent && activeEvent.description ? (
            /* Two-column layout container when event has description */
            <div className="two-column-layout">
              {/* Left Column: Event Description */}
              <div className="column-left">
                <div className="active-event-banner">
                  <IonCard className="event-banner-card" button onClick={() => setIsDescriptionModalOpen(true)}>
                    <IonCardContent>
                      <div className="event-banner-content">
                        <div className="event-banner-info">
                          <h2>{activeEvent.title}</h2>
                          <div className="event-banner-details">
                            <IonChip color="light">
                              <IonLabel>{activeEvent.eventType}</IonLabel>
                            </IonChip>
                            <IonChip color="light">
                              <IonLabel>{new Date(activeEvent.startDate).toLocaleDateString()} - {new Date(activeEvent.endDate).toLocaleDateString()}</IonLabel>
                            </IonChip>
                            {/* {activeEvent.isTicketed && activeEvent.ticketPrice && (
                              <IonChip color="success">
                                <IonLabel>£{activeEvent.ticketPrice}</IonLabel>
                              </IonChip>
                            )} */}
                          </div>
                          <div className="event-description-container">
                            <p>{activeEvent.description}</p>
                          </div>
                          <IonButton 
                            className="read-more-button" 
                            size="default"
                            fill="clear"
                            shape='round'
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click from triggering
                              setIsDescriptionModalOpen(true);
                            }}
                          >
                            Read More
                          </IonButton>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </div>
              </div>

              {/* Right Column: Items Carousel */}
              {showItemCards && items.length > 0 && (
                <div className="column-right">
                  <div className="items-container">
                    <div className="carousel-container">
                      <div 
                        className="items-scroll-container"
                        ref={(el) => {
                          if (el) {
                            // Initial check for scroll mask
                            const hasMoreContent = el.scrollWidth > el.clientWidth;
                            const maskEl = el.parentElement?.querySelector('.carousel-gradient-mask');
                            if (maskEl) {
                              maskEl.classList.toggle('visible', hasMoreContent);
                            }
                            
                            // Add scroll event listener
                            el.addEventListener('scroll', () => {
                              const isAtEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 10;
                              const maskEl = el.parentElement?.querySelector('.carousel-gradient-mask');
                              if (maskEl) {
                                maskEl.classList.toggle('visible', !isAtEnd);
                              }
                            });
                          }
                        }}
                      >
                        {items.map((item) => (
                          <div 
                            key={item.id}
                            className="item-card" 
                            onClick={() => handleItemClick(item)}
                          >
                            <img src={item.thumbnailImage || item.images[0]} alt={item.title} />
                            <div className="item-card-overlay"></div>
                            <div className="item-card-content">
                              <h3 className="item-card-title">{item.title}</h3>
                              <p className="item-card-artist">{item.artist}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Gradient mask for indicating more content */}
                      <div className="carousel-gradient-mask"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Full-width carousel when no event description */
            showItemCards && items.length > 0 && (
              <div className="full-width-carousel">
                <div className="items-container">
                  <div className="carousel-container">
                    <div 
                      className="items-scroll-container"
                      ref={(el) => {
                        if (el) {
                          // Initial check for scroll mask
                          const hasMoreContent = el.scrollWidth > el.clientWidth;
                          const maskEl = el.parentElement?.querySelector('.carousel-gradient-mask');
                          if (maskEl) {
                            maskEl.classList.toggle('visible', hasMoreContent);
                          }
                          
                          // Add scroll event listener
                          el.addEventListener('scroll', () => {
                            const isAtEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 10;
                            const maskEl = el.parentElement?.querySelector('.carousel-gradient-mask');
                            if (maskEl) {
                              maskEl.classList.toggle('visible', !isAtEnd);
                            }
                          });
                        }
                      }}
                    >
                      {items.map((item) => (
                        <div 
                          key={item.id}
                          className="item-card" 
                          onClick={() => handleItemClick(item)}
                        >
                          <img src={item.thumbnailImage || item.images[0]} alt={item.title} />
                          <div className="item-card-overlay"></div>
                          <div className="item-card-content">
                            <h3 className="item-card-title">{item.title}</h3>
                            <p className="item-card-artist">{item.artist}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Gradient mask for indicating more content */}
                    <div className="carousel-gradient-mask"></div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Event Default Image - shown when no featured items but event has image */}
          {showItemCards && items.length === 0 && activeEvent && activeEvent.imageUrl && (
            <div className="items-container">
              <div className="event-default-image-container">
                <img 
                  src={activeEvent.imageUrl} 
                  alt={activeEvent.title}
                  className="event-default-image"
                />
                <div className="event-default-overlay">
                  <h3>{activeEvent.title}</h3>
                  <p>{activeEvent.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Visitor Form */}
        {/* <div className="visitor-form-container">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Welcome to Our Gallery</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Name</IonLabel>
                <IonInput
                  value={visitorForm.name}
                  onIonInput={(e) => setVisitorForm({...visitorForm, name: e.detail.value!})}
                  placeholder="Your name"
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  type="email"
                  value={visitorForm.email}
                  onIonInput={(e) => setVisitorForm({...visitorForm, email: e.detail.value!})}
                  placeholder="your.email@example.com"
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Message</IonLabel>
                <IonTextarea
                  value={visitorForm.message}
                  onIonInput={(e) => setVisitorForm({...visitorForm, message: e.detail.value!})}
                  placeholder="Say hello or share your thoughts..."
                  rows={3}
                />
              </IonItem>
              <IonButton 
                expand="block" 
                onClick={handleVisitorSubmit}
                className="submit-button"
              >
                Submit
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div> */}

        {/* Item Detail Modal */}
        <IonModal isOpen={isItemModalOpen} onDidDismiss={() => setIsItemModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{selectedItem?.title}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsItemModalOpen(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {selectedItem && (
              <div className="item-detail">
                <img src={selectedItem.thumbnailImage || selectedItem.images[0]} alt={selectedItem.title} />
                <IonCard>
                  <IonCardContent>
                    <h2>{selectedItem.title}</h2>
                    <p><strong>Artist:</strong> {selectedItem.artist}</p>
                    <p><strong>Year:</strong> {selectedItem.year}</p>
                    <p><strong>Medium:</strong> {selectedItem.medium}</p>
                    <p><strong>Dimensions:</strong> {selectedItem.dimensions}</p>
                    <p><strong>Price:</strong> {formatPrice(selectedItem.price, selectedItem.currency)}</p>
                    <p><strong>Category:</strong> {selectedItem.category}</p>
                    <p><strong>Style:</strong> {selectedItem.style}</p>
                    {selectedItem.description && (
                      <p><strong>Description:</strong> {selectedItem.description}</p>
                    )}
                    <div style={{ marginTop: '16px' }}>
                      <strong>Tags:</strong>
                      <div style={{ marginTop: '8px' }}>
                        {selectedItem.tags.map((tag, index) => (
                          <IonChip key={index} color="primary" style={{ marginRight: '4px' }}>
                            <IonLabel>{tag}</IonLabel>
                          </IonChip>
                        ))}
                      </div>
                    </div>
                    {selectedItem.images.length > 1 && (
                      <div style={{ marginTop: '16px' }}>
                        <strong>Additional Images:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                          {selectedItem.images.slice(1).map((image, index) => (
                            <img 
                              key={index}
                              src={image} 
                              alt={`${selectedItem.title} - Image ${index + 2}`}
                              style={{ 
                                width: '80px', 
                                height: '80px', 
                                objectFit: 'cover', 
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                              onClick={() => {
                                // Could implement full-size image viewer here
                                window.open(image, '_blank');
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </IonCardContent>
                </IonCard>
              </div>
            )}
          </IonContent>
        </IonModal>

        {/* Event Description Modal */}
        <IonModal 
          isOpen={isDescriptionModalOpen} 
          onDidDismiss={() => setIsDescriptionModalOpen(false)}
          className="event-description-modal"
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>{activeEvent?.title}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsDescriptionModalOpen(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="event-description-modal-content">
              <h2>{activeEvent?.title}</h2>
              <div className="event-banner-details" style={{ marginBottom: '20px' }}>
                {activeEvent && (
                  <>
                    <IonChip color="primary">
                      <IonLabel>{activeEvent.eventType}</IonLabel>
                    </IonChip>
                    <IonChip color="secondary">
                      <IonLabel>{new Date(activeEvent.startDate).toLocaleDateString()} - {new Date(activeEvent.endDate).toLocaleDateString()}</IonLabel>
                    </IonChip>
                    {activeEvent.isTicketed && activeEvent.ticketPrice && (
                      <IonChip color="success">
                        <IonLabel>£{activeEvent.ticketPrice}</IonLabel>
                      </IonChip>
                    )}
                  </>
                )}
              </div>
              <p>{activeEvent?.description}</p>
              <IonButton 
                expand="block" 
                onClick={() => setIsDescriptionModalOpen(false)}
              >
                Close
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        {/* Admin Login Modal */}
        <IonModal isOpen={isAdminModalOpen} onDidDismiss={() => setIsAdminModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Admin Login</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsAdminModalOpen(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div style={{ padding: '20px' }}>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={lockClosed} style={{ marginRight: '8px' }} />
                    Gallery Admin Access
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonItem>
                    <IonIcon icon={person} slot="start" />
                    <IonLabel position="stacked">Email</IonLabel>
                    <IonInput
                      type="email"
                      value={adminForm.email}
                      onIonInput={(e) => setAdminForm({...adminForm, email: e.detail.value!})}
                      placeholder="admin@gallery.com"
                    />
                  </IonItem>
                  <IonItem>
                    <IonIcon icon={lockClosed} slot="start" />
                    <IonLabel position="stacked">Password</IonLabel>
                    <IonInput
                      type="password"
                      value={adminForm.password}
                      onIonInput={(e) => setAdminForm({...adminForm, password: e.detail.value!})}
                      placeholder="Enter password"
                    />
                  </IonItem>
                  <IonButton 
                    expand="block" 
                    onClick={handleAdminSubmit}
                    style={{ marginTop: '20px' }}
                  >
                    Login
                  </IonButton>
                  <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: '#666' }}>
                    Demo: admin@gallery.com / admin123
                  </p>
                </IonCardContent>
              </IonCard>
            </div>
          </IonContent>
        </IonModal>

        {/* Toast for notifications */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="top"
        />
      </IonContent>
      
      {/* Fixed Footer */}
      {/* <IonFooter className="ion-no-border">
        <IonToolbar className="transparent-toolbar">
          <IonButtons slot="end">
            <IonButton
              fill="clear"
              className="admin-login-button"
              onClick={handleAdminLogin}
            >
              <IonIcon icon={chevronForward} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter> */}
    </IonPage>
  );
};

export default VisitorLanding;
