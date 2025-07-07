import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonToast,
  IonToggle
} from '@ionic/react';
import {
  save,
  business,
  images
} from 'ionicons/icons';
import { GallerySettings } from '../types/GallerySettings';
import { GallerySettingsService } from '../services/GallerySettingsService';
import './Settings.css';

const Settings: React.FC = () => {
  const [gallerySettings, setGallerySettings] = useState<GallerySettings | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    setIsLoading(true);
    try {
      const settings = GallerySettingsService.getOrInitializeSettings();
      setGallerySettings(settings);
    } catch (error) {
      console.error('Error loading settings:', error);
      setToastMessage('Error loading settings');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBasicInfo = () => {
    if (!gallerySettings) return;

    try {
      GallerySettingsService.updateGalleryName(gallerySettings.galleryName);
      GallerySettingsService.updateContactInfo(gallerySettings.contactInfo);
      setToastMessage('Basic information saved successfully!');
      setShowToast(true);
    } catch (error) {
      console.error('Error saving basic info:', error);
      setToastMessage('Error saving basic information');
      setShowToast(true);
    }
  };

  if (isLoading || !gallerySettings) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/admin" />
            </IonButtons>
            <IonTitle>Gallery Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p>Loading settings...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/admin" />
          </IonButtons>
          <IonTitle>Gallery Settings</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="settings-container">
          {/* Basic Information */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={business} style={{ marginRight: '8px' }} />
                Basic Information
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Gallery Name</IonLabel>
                <IonInput
                  value={gallerySettings.galleryName}
                  onIonInput={(e) => setGallerySettings({
                    ...gallerySettings,
                    galleryName: e.detail.value!
                  })}
                  placeholder="Enter gallery name"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Contact Email</IonLabel>
                <IonInput
                  type="email"
                  value={gallerySettings.contactInfo.email}
                  onIonInput={(e) => setGallerySettings({
                    ...gallerySettings,
                    contactInfo: {
                      ...gallerySettings.contactInfo,
                      email: e.detail.value!
                    }
                  })}
                  placeholder="Enter contact email"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Contact Phone</IonLabel>
                <IonInput
                  type="tel"
                  value={gallerySettings.contactInfo.phone}
                  onIonInput={(e) => setGallerySettings({
                    ...gallerySettings,
                    contactInfo: {
                      ...gallerySettings.contactInfo,
                      phone: e.detail.value!
                    }
                  })}
                  placeholder="Enter contact phone"
                />
              </IonItem>

              <IonButton expand="block" onClick={handleSaveBasicInfo} style={{ marginTop: '16px' }}>
                <IonIcon icon={save} slot="start" />
                Save Basic Information
              </IonButton>
            </IonCardContent>
          </IonCard>

          {/* Display Settings */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={images} style={{ marginRight: '8px' }} />
                Display Settings
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel>Show Items Carousel</IonLabel>
                <IonToggle
                  checked={gallerySettings.showItemCards}
                  onIonChange={(e) => {
                    const newValue = e.detail.checked;
                    setGallerySettings({
                      ...gallerySettings,
                      showItemCards: newValue
                    });
                    GallerySettingsService.updateShowItemCards(newValue);
                    
                    // Dispatch custom event to notify other tabs/components
                    window.dispatchEvent(new CustomEvent('gallerySettingsChanged', {
                      detail: { showItemCards: newValue }
                    }));
                    
                    setToastMessage(`Items carousel ${newValue ? 'enabled' : 'disabled'}`);
                    setShowToast(true);
                  }}
                />
              </IonItem>
              <p className="setting-description">
                When enabled, artwork items will be displayed in a carousel at the bottom of the visitor landing page.
              </p>
            </IonCardContent>
          </IonCard>

          {/* Test Card */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Settings Test</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>Settings page is working correctly!</p>
              <p>Gallery Name: {gallerySettings.galleryName}</p>
              <p>Contact Email: {gallerySettings.contactInfo.email}</p>
              <p>Business Hours Count: {gallerySettings.businessHours.length}</p>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Toast */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default Settings;
