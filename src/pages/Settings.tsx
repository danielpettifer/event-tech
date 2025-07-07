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
  images,
  image
} from 'ionicons/icons';
import { GallerySettings, LogoImage } from '../types/GallerySettings';
import { GallerySettingsService } from '../services/GallerySettingsService';
import ImageUpload from '../components/ImageUpload';
import './Settings.css';

const Settings: React.FC = () => {
  const [gallerySettings, setGallerySettings] = useState<GallerySettings | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [logoImages, setLogoImages] = useState<string[]>([]);
  const [activeLogo, setActiveLogo] = useState<string>('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    setIsLoading(true);
    try {
      const settings = GallerySettingsService.getOrInitializeSettings();
      setGallerySettings(settings);
      
      // Initialize logo state
      const allLogos = settings.logoUrls.map(logo => logo.url);
      setLogoImages(allLogos);
      
      const activeLogoObj = settings.logoUrls.find(logo => logo.isActive);
      if (activeLogoObj) {
        setActiveLogo(activeLogoObj.url);
      } else if (allLogos.length > 0) {
        setActiveLogo(allLogos[0]);
      }
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

  const handleLogoChange = (imageUrl: string) => {
    if (!gallerySettings) return;
    
    console.log('Handling logo change with URL:', imageUrl);
    
    // Find if this logo already exists
    const existingLogo = gallerySettings.logoUrls.find(logo => logo.url === imageUrl);
    
    if (existingLogo) {
      // Set existing logo as active
      try {
        console.log('Setting existing logo as active:', existingLogo);
        GallerySettingsService.setActiveLogo(existingLogo.id);
        setActiveLogo(imageUrl);
        setToastMessage('Logo updated successfully!');
        setShowToast(true);
        loadSettings(); // Reload settings to get updated data
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('gallerySettingsChanged', {
          detail: { type: 'logo', logoUrl: imageUrl }
        }));
      } catch (error) {
        console.error('Error updating logo:', error);
        setToastMessage('Error updating logo');
        setShowToast(true);
      }
    } else {
      // Add new logo
      try {
        // Generate a more descriptive name for the logo
        let logoName = 'Gallery Logo';
        
        // If it's a data URL from a file upload, try to create a more descriptive name
        if (imageUrl.startsWith('data:image/')) {
          const fileType = imageUrl.split(';')[0].split('/')[1];
          logoName = `Uploaded Logo (${fileType}) - ${new Date().toLocaleString()}`;
        } else if (imageUrl.includes('/')) {
          // If it's a URL path, extract the filename
          const fileName = imageUrl.split('/').pop() || 'Logo';
          logoName = `${fileName} - ${new Date().toLocaleString()}`;
        }
        
        console.log('Adding new logo with name:', logoName);
        const updatedSettings = GallerySettingsService.addLogo(imageUrl, logoName);
        
        // Set the new logo as active
        const newLogo = updatedSettings.logoUrls.find(logo => logo.url === imageUrl);
        if (newLogo) {
          console.log('Setting new logo as active:', newLogo);
          GallerySettingsService.setActiveLogo(newLogo.id);
        }
        
        setActiveLogo(imageUrl);
        setToastMessage('New logo added and set as active!');
        setShowToast(true);
        loadSettings(); // Reload settings to get updated data
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('gallerySettingsChanged', {
          detail: { type: 'logo', logoUrl: imageUrl }
        }));
      } catch (error) {
        console.error('Error adding new logo:', error);
        setToastMessage('Error adding new logo');
        setShowToast(true);
      }
    }
  };

  const handleLogosChange = (images: string[]) => {
    setLogoImages(images);
    
    // Handle logo removal if needed
    if (!gallerySettings) return;
    
    const currentLogoUrls = gallerySettings.logoUrls.map(logo => logo.url);
    const removedLogos = currentLogoUrls.filter(url => !images.includes(url));
    
    if (removedLogos.length > 0) {
      removedLogos.forEach(url => {
        const logoToRemove = gallerySettings.logoUrls.find(logo => logo.url === url);
        if (logoToRemove) {
          try {
            GallerySettingsService.removeLogo(logoToRemove.id);
          } catch (error) {
            console.error('Error removing logo:', error);
            // If this is the only logo, we can't remove it
            if (error instanceof Error && error.message === 'Cannot remove the only logo') {
              setToastMessage('Cannot remove the only logo');
              setShowToast(true);
              loadSettings(); // Reload to restore the logo
              return;
            }
          }
        }
      });
      
      loadSettings(); // Reload settings to get updated data
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

          {/* Logo Management */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={image} style={{ marginRight: '8px' }} />
                Logo Management
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="logo-management">
                {activeLogo && (
                  <div className="active-logo-preview">
                    <h3>Current Active Logo</h3>
                    <img 
                      src={activeLogo} 
                      alt="Gallery Logo" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100px', 
                        display: 'block', 
                        margin: '0 auto 16px auto',
                        border: '1px solid #eee',
                        borderRadius: '4px',
                        padding: '8px'
                      }} 
                    />
                  </div>
                )}
                
                <h3>Upload or Change Logo</h3>
                <p className="setting-description">
                  Upload a new logo or select from previously uploaded logos. The active logo will be displayed in the gallery header and admin dashboard.
                </p>
                
                <ImageUpload
                  label="Gallery Logo"
                  value={activeLogo}
                  onImageChange={handleLogoChange}
                  images={logoImages}
                  onImagesChange={handleLogosChange}
                  placeholder="Enter logo URL or upload image"
                  maxSizeMB={5}
                  acceptedTypes={['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp', 'image/*']}
                  showPreview={true}
                  previewHeight="100px"
                  allowMultiple={true}
                  maxImages={5}
                />
                
                <div className="logo-usage-info" style={{ marginTop: '16px' }}>
                  <h4>Logo Usage</h4>
                  <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                    <li>Visitor landing page header</li>
                    <li>Admin dashboard</li>
                    <li>Printed materials and reports</li>
                    <li>Email communications</li>
                  </ul>
                  <p className="setting-description">
                    For best results, upload a logo with transparent background in PNG or SVG format.
                    Recommended dimensions: 200×100 pixels.
                  </p>
                </div>
              </div>
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
