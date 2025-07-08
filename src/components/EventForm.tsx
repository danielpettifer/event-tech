import React, { useState, useEffect, useCallback } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
  IonChip,
  IonToggle,
} from '@ionic/react';
import { close, save, calendar, add, remove } from 'ionicons/icons';
import { Event, EVENT_TYPES, EVENT_STATUSES, EVENT_TAGS } from '../types/Event';
import { EventService } from '../services/EventService';
import { ItemService } from '../services/ItemService';
import { Item } from '../types/Item';
import ImageUpload from './ImageUpload';

interface EventFormProps {
  isOpen: boolean;
  onDidDismiss: () => void;
  event?: Event | null;
  onSave: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ isOpen, onDidDismiss, event, onSave }) => {
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    eventType: 'Exhibition',
    status: 'Draft',
    maxAttendees: undefined,
    currentAttendees: 0,
    ticketPrice: undefined,
    isTicketed: false,
    featuredArtists: [],
    featuredArtworks: [],
    tags: [],
    imageUrl: '',
    images: [],
    contactEmail: '',
    contactPhone: '',
    specialInstructions: '',
    isPublic: true
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newArtist, setNewArtist] = useState('');
  const [newArtwork, setNewArtwork] = useState('');
  const [availableItems, setAvailableItems] = useState<Item[]>([]);

  useEffect(() => {
    // Load available items
    ItemService.getAllItems().then(items => {
      setAvailableItems(items);
    })
    // const items = ItemService.getAllItems();
    // setAvailableItems(items);

    if (event) {
      // Editing existing event
      setFormData(event);
    } else {
      // Creating new event
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        title: '',
        description: '',
        startDate: today,
        endDate: today,
        startTime: '10:00',
        endTime: '18:00',
        location: '',
        eventType: 'Exhibition',
        status: 'Draft',
        maxAttendees: undefined,
        currentAttendees: 0,
        ticketPrice: undefined,
        isTicketed: false,
        featuredArtists: [],
        featuredArtworks: [],
        featuredItems: [],
        tags: [],
        imageUrl: '',
        contactEmail: 'events@gallery.com',
        contactPhone: '',
        specialInstructions: '',
        isPublic: true
      });
    }
    setErrors({});
  }, [event, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.title?.trim()) newErrors.title = 'Event title is required';
    if (!formData.description?.trim()) newErrors.description = 'Event description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.location?.trim()) newErrors.location = 'Location is required';
    if (!formData.contactEmail?.trim()) newErrors.contactEmail = 'Contact email is required';

    // Date validation
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate < startDate) {
        newErrors.endDate = 'End date cannot be before start date';
      }
    }

    // Time validation for same-day events
    if (formData.startDate === formData.endDate && formData.startTime && formData.endTime) {
      if (formData.endTime <= formData.startTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    // Email validation
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    // Ticket validation
    if (formData.isTicketed && (!formData.ticketPrice || formData.ticketPrice < 0)) {
      newErrors.ticketPrice = 'Ticket price is required for ticketed events';
    }

    // Attendee validation
    if (formData.maxAttendees && formData.maxAttendees < 1) {
      newErrors.maxAttendees = 'Maximum attendees must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      setToastMessage('Please fix the errors before saving');
      setShowToast(true);
      return;
    }

    try {
      const eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.title!,
        description: formData.description!,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        startTime: formData.startTime!,
        endTime: formData.endTime!,
        location: formData.location!,
        eventType: formData.eventType!,
        status: formData.status!,
        maxAttendees: formData.maxAttendees,
        currentAttendees: formData.currentAttendees || 0,
        ticketPrice: formData.isTicketed ? formData.ticketPrice : undefined,
        isTicketed: formData.isTicketed || false,
        featuredArtists: formData.featuredArtists || [],
        featuredArtworks: formData.featuredArtworks || [],
        featuredItems: formData.featuredItems || [],
        tags: formData.tags || [],
        imageUrl: formData.imageUrl,
        images: formData.images || [],
        contactEmail: formData.contactEmail!,
        contactPhone: formData.contactPhone,
        specialInstructions: formData.specialInstructions,
        isPublic: formData.isPublic !== false
      };

      if (event) {
        // Update existing event
        EventService.updateEvent(event.id, eventData);
        setToastMessage('Event updated successfully!');
      } else {
        // Create new event
        EventService.saveEvent(eventData);
        setToastMessage('Event created successfully!');
      }

      setShowToast(true);
      onSave();
      onDidDismiss();
    } catch (error) {
      setToastMessage('Error saving event. Please try again.');
      setShowToast(true);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      location: '',
      eventType: 'Exhibition',
      status: 'Draft',
      maxAttendees: undefined,
      currentAttendees: 0,
      ticketPrice: undefined,
      isTicketed: false,
      featuredArtists: [],
      featuredArtworks: [],
      featuredItems: [],
      tags: [],
      imageUrl: '',
      contactEmail: '',
      contactPhone: '',
      specialInstructions: '',
      isPublic: true
    });
    setErrors({});
    setNewArtist('');
    setNewArtwork('');
    onDidDismiss();
  };

  const addArtist = () => {
    if (newArtist.trim() && !formData.featuredArtists?.includes(newArtist.trim())) {
      setFormData({
        ...formData,
        featuredArtists: [...(formData.featuredArtists || []), newArtist.trim()]
      });
      setNewArtist('');
    }
  };

  const removeArtist = (artist: string) => {
    setFormData({
      ...formData,
      featuredArtists: formData.featuredArtists?.filter(a => a !== artist) || []
    });
  };

  const addArtwork = () => {
    if (newArtwork.trim() && !formData.featuredArtworks?.includes(newArtwork.trim())) {
      setFormData({
        ...formData,
        featuredArtworks: [...(formData.featuredArtworks || []), newArtwork.trim()]
      });
      setNewArtwork('');
    }
  };

  const removeArtwork = (artwork: string) => {
    setFormData({
      ...formData,
      featuredArtworks: formData.featuredArtworks?.filter(a => a !== artwork) || []
    });
  };

  const handleTagSelection = (selectedTags: string[]) => {
    setFormData({ ...formData, tags: selectedTags });
  };

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={handleClose}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
            <IonTitle>
              <IonIcon icon={calendar} style={{ marginRight: '8px' }} />
              {event ? 'Edit Event' : 'Add New Event'}
            </IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleSave} color="primary">
                <IonIcon icon={save} slot="start" />
                Save
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ padding: '20px' }}>
            <IonCard>
              <IonCardContent>
                <IonGrid>
                  {/* Basic Information */}
                  <IonRow>
                    <IonCol size="12">
                      <h3 style={{ margin: '0 0 16px 0', color: 'var(--ion-color-primary)' }}>
                        Basic Information
                      </h3>
                    </IonCol>
                  </IonRow>
                  
                  <IonRow>
                    <IonCol size="12">
                      <IonItem className={errors.title ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">Event Title *</IonLabel>
                        <IonInput
                          value={formData.title}
                          onIonInput={(e) => setFormData({...formData, title: e.detail.value!})}
                          placeholder="Enter event title"
                        />
                      </IonItem>
                      {errors.title && <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.8rem', margin: '4px 0 0 16px' }}>{errors.title}</p>}
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <IonItem className={errors.description ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">Description *</IonLabel>
                        <IonTextarea
                          value={formData.description}
                          onIonInput={(e) => setFormData({...formData, description: e.detail.value!})}
                          placeholder="Enter event description..."
                          rows={4}
                        />
                      </IonItem>
                      {errors.description && <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.8rem', margin: '4px 0 0 16px' }}>{errors.description}</p>}
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12" sizeMd="6">
                      <IonItem>
                        <IonLabel position="stacked">Event Type</IonLabel>
                        <IonSelect
                          value={formData.eventType}
                          onIonChange={(e) => setFormData({...formData, eventType: e.detail.value})}
                          placeholder="Select event type"
                        >
                          {EVENT_TYPES.map((type) => (
                            <IonSelectOption key={type} value={type}>
                              {type}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>
                    </IonCol>
                    <IonCol size="12" sizeMd="6">
                      <IonItem>
                        <IonLabel position="stacked">Status</IonLabel>
                        <IonSelect
                          value={formData.status}
                          onIonChange={(e) => setFormData({...formData, status: e.detail.value})}
                          placeholder="Select status"
                        >
                          {EVENT_STATUSES.map((status) => (
                            <IonSelectOption key={status} value={status}>
                              {status}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>
                    </IonCol>
                  </IonRow>

                  {/* Date and Time */}
                  <IonRow>
                    <IonCol size="12">
                      <h3 style={{ margin: '24px 0 16px 0', color: 'var(--ion-color-primary)' }}>
                        Date and Time
                      </h3>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12" sizeMd="6">
                      <IonItem className={errors.startDate ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">Start Date *</IonLabel>
                        <IonInput
                          type="date"
                          value={formData.startDate}
                          onIonInput={(e) => setFormData({...formData, startDate: e.detail.value!})}
                        />
                      </IonItem>
                      {errors.startDate && <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.8rem', margin: '4px 0 0 16px' }}>{errors.startDate}</p>}
                    </IonCol>
                    <IonCol size="12" sizeMd="6">
                      <IonItem className={errors.endDate ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">End Date *</IonLabel>
                        <IonInput
                          type="date"
                          value={formData.endDate}
                          onIonInput={(e) => setFormData({...formData, endDate: e.detail.value!})}
                        />
                      </IonItem>
                      {errors.endDate && <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.8rem', margin: '4px 0 0 16px' }}>{errors.endDate}</p>}
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12" sizeMd="6">
                      <IonItem className={errors.startTime ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">Start Time *</IonLabel>
                        <IonInput
                          type="time"
                          value={formData.startTime}
                          onIonInput={(e) => setFormData({...formData, startTime: e.detail.value!})}
                        />
                      </IonItem>
                      {errors.startTime && <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.8rem', margin: '4px 0 0 16px' }}>{errors.startTime}</p>}
                    </IonCol>
                    <IonCol size="12" sizeMd="6">
                      <IonItem className={errors.endTime ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">End Time *</IonLabel>
                        <IonInput
                          type="time"
                          value={formData.endTime}
                          onIonInput={(e) => setFormData({...formData, endTime: e.detail.value!})}
                        />
                      </IonItem>
                      {errors.endTime && <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.8rem', margin: '4px 0 0 16px' }}>{errors.endTime}</p>}
                    </IonCol>
                  </IonRow>

                  {/* Location and Contact */}
                  <IonRow>
                    <IonCol size="12">
                      <h3 style={{ margin: '24px 0 16px 0', color: 'var(--ion-color-primary)' }}>
                        Location and Contact
                      </h3>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <IonItem className={errors.location ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">Location *</IonLabel>
                        <IonInput
                          value={formData.location}
                          onIonInput={(e) => setFormData({...formData, location: e.detail.value!})}
                          placeholder="Enter event location"
                        />
                      </IonItem>
                      {errors.location && <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.8rem', margin: '4px 0 0 16px' }}>{errors.location}</p>}
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12" sizeMd="6">
                      <IonItem className={errors.contactEmail ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">Contact Email *</IonLabel>
                        <IonInput
                          type="email"
                          value={formData.contactEmail}
                          onIonInput={(e) => setFormData({...formData, contactEmail: e.detail.value!})}
                          placeholder="Enter contact email"
                        />
                      </IonItem>
                      {errors.contactEmail && <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.8rem', margin: '4px 0 0 16px' }}>{errors.contactEmail}</p>}
                    </IonCol>
                    <IonCol size="12" sizeMd="6">
                      <IonItem>
                        <IonLabel position="stacked">Contact Phone</IonLabel>
                        <IonInput
                          type="tel"
                          value={formData.contactPhone}
                          onIonInput={(e) => setFormData({...formData, contactPhone: e.detail.value!})}
                          placeholder="Enter contact phone"
                        />
                      </IonItem>
                    </IonCol>
                  </IonRow>

                  {/* Ticketing and Capacity */}
                  <IonRow>
                    <IonCol size="12">
                      <h3 style={{ margin: '24px 0 16px 0', color: 'var(--ion-color-primary)' }}>
                        Ticketing and Capacity
                      </h3>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <IonItem>
                        <IonCheckbox
                          checked={formData.isTicketed}
                          onIonChange={(e) => setFormData({...formData, isTicketed: e.detail.checked})}
                        />
                        <IonLabel style={{ marginLeft: '12px' }}>
                          This is a ticketed event
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                  </IonRow>

                  {formData.isTicketed && (
                    <IonRow>
                      <IonCol size="12" sizeMd="6">
                        <IonItem className={errors.ticketPrice ? 'ion-invalid' : ''}>
                          <IonLabel position="stacked">Ticket Price (£) *</IonLabel>
                          <IonInput
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.ticketPrice}
                            onIonInput={(e) => setFormData({...formData, ticketPrice: parseFloat(e.detail.value!) || 0})}
                            placeholder="0.00"
                          />
                        </IonItem>
                        {errors.ticketPrice && <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.8rem', margin: '4px 0 0 16px' }}>{errors.ticketPrice}</p>}
                      </IonCol>
                    </IonRow>
                  )}

                  <IonRow>
                    <IonCol size="12" sizeMd="6">
                      <IonItem className={errors.maxAttendees ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">Maximum Attendees</IonLabel>
                        <IonInput
                          type="number"
                          min="1"
                          value={formData.maxAttendees}
                          onIonInput={(e) => setFormData({...formData, maxAttendees: parseInt(e.detail.value!) || undefined})}
                          placeholder="Leave empty for unlimited"
                        />
                      </IonItem>
                      {errors.maxAttendees && <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.8rem', margin: '4px 0 0 16px' }}>{errors.maxAttendees}</p>}
                    </IonCol>
                  </IonRow>

                  {/* Featured Artists */}
                  <IonRow>
                    <IonCol size="12">
                      <h3 style={{ margin: '24px 0 16px 0', color: 'var(--ion-color-primary)' }}>
                        Featured Artists
                      </h3>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <IonInput
                          value={newArtist}
                          onIonInput={(e) => setNewArtist(e.detail.value!)}
                          placeholder="Enter artist name"
                          style={{ flex: 1 }}
                        />
                        <IonButton onClick={addArtist} disabled={!newArtist.trim()}>
                          <IonIcon icon={add} />
                        </IonButton>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {formData.featuredArtists?.map((artist, index) => (
                          <IonChip key={index} color="primary">
                            {artist}
                            <IonIcon icon={remove} onClick={() => removeArtist(artist)} />
                          </IonChip>
                        ))}
                      </div>
                    </IonCol>
                  </IonRow>

                  {/* Featured Artworks */}
                  <IonRow>
                    <IonCol size="12">
                      <h3 style={{ margin: '24px 0 16px 0', color: 'var(--ion-color-primary)' }}>
                        Featured Artworks
                      </h3>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <IonInput
                          value={newArtwork}
                          onIonInput={(e) => setNewArtwork(e.detail.value!)}
                          placeholder="Enter artwork title"
                          style={{ flex: 1 }}
                        />
                        <IonButton onClick={addArtwork} disabled={!newArtwork.trim()}>
                          <IonIcon icon={add} />
                        </IonButton>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {formData.featuredArtworks?.map((artwork, index) => (
                          <IonChip key={index} color="secondary">
                            {artwork}
                            <IonIcon icon={remove} onClick={() => removeArtwork(artwork)} />
                          </IonChip>
                        ))}
                      </div>
                    </IonCol>
                  </IonRow>

                  {/* Tags */}
                  <IonRow>
                    <IonCol size="12">
                      <h3 style={{ margin: '24px 0 16px 0', color: 'var(--ion-color-primary)' }}>
                        Tags
                      </h3>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <IonItem>
                        <IonLabel position="stacked">Event Tags</IonLabel>
                        <IonSelect
                          multiple={true}
                          value={formData.tags}
                          onIonChange={(e) => handleTagSelection(e.detail.value)}
                          placeholder="Select tags"
                        >
                          {EVENT_TAGS.map((tag) => (
                            <IonSelectOption key={tag} value={tag}>
                              {tag}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>
                    </IonCol>
                  </IonRow>

                  {/* Event Image */}
                  <IonRow>
                    <IonCol size="12">
                      <h3 style={{ margin: '24px 0 16px 0', color: 'var(--ion-color-primary)' }}>
                        Event Image
                      </h3>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <ImageUpload
                        value={formData.imageUrl}
                        onImageChange={(imageUrl) => setFormData({...formData, imageUrl})}
                        images={formData.images}
                        onImagesChange={(images) => setFormData({...formData, images})}
                        label="Event Images"
                        placeholder="Enter image URL or upload files"
                        required={true}
                        maxSizeMB={10}
                        showPreview={true}
                        previewHeight="250px"
                        allowMultiple={true}
                        maxImages={5}
                      />
                      <p style={{ fontSize: '0.8rem', color: 'var(--ion-color-medium)', margin: '8px 0 0 0' }}>
                        Note: Upload multiple images and select one as the primary image. The primary image is required to publish the event and will be used as the background when no featured items are selected.
                      </p>
                    </IonCol>
                  </IonRow>

                  {/* Featured Items */}
                  <IonRow>
                    <IonCol size="12">
                      <h3 style={{ margin: '24px 0 16px 0', color: 'var(--ion-color-primary)' }}>
                        Featured Items
                      </h3>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <IonItem>
                        <IonLabel position="stacked">Select Items to Feature</IonLabel>
                        <IonSelect
                          multiple={true}
                          value={formData.featuredItems}
                          onIonChange={(e) => setFormData({...formData, featuredItems: e.detail.value})}
                          placeholder="Choose items to display in the landing page carousel"
                        >
                          {availableItems.map((item) => (
                            <IonSelectOption key={item.id} value={item.id}>
                              {item.title} - {item.artist}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>
                      <p style={{ fontSize: '0.8rem', color: 'var(--ion-color-medium)', margin: '4px 0 0 16px' }}>
                        These items will be displayed in the carousel on the visitor landing page
                      </p>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <IonItem>
                        <IonLabel>Show Items Carousel</IonLabel>
                        <IonToggle
                          checked={formData.showItems !== false} // Default to true if undefined
                          onIonChange={(e) => setFormData({...formData, showItems: e.detail.checked})}
                        />
                      </IonItem>
                      <p style={{ fontSize: '0.8rem', color: 'var(--ion-color-medium)', margin: '4px 0 0 16px' }}>
                        When enabled, selected items will be displayed in a carousel on the visitor landing page. 
                        When disabled, only the event background image will be shown.
                      </p>
                    </IonCol>
                  </IonRow>

                  {/* Additional Information */}
                  <IonRow>
                    <IonCol size="12">
                      <h3 style={{ margin: '24px 0 16px 0', color: 'var(--ion-color-primary)' }}>
                        Additional Information
                      </h3>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <IonItem>
                        <IonLabel position="stacked">Special Instructions</IonLabel>
                        <IonTextarea
                          value={formData.specialInstructions}
                          onIonInput={(e) => setFormData({...formData, specialInstructions: e.detail.value!})}
                          placeholder="Enter any special instructions or notes..."
                          rows={3}
                        />
                      </IonItem>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <IonItem>
                        <IonLabel>Public Event</IonLabel>
                        <IonToggle
                          checked={formData.isPublic}
                          onIonChange={(e) => setFormData({...formData, isPublic: e.detail.checked})}
                        />
                      </IonItem>
                    </IonCol>
                  </IonRow>

                </IonGrid>
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonModal>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="top"
      />
    </>
  );
};

export default EventForm;
