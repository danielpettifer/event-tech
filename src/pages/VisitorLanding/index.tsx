import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonFooter,
  IonButton,
  IonIcon,
  IonToast,
  IonTitle,
  IonButtons
} from '@ionic/react';
import { lockClosedOutline } from 'ionicons/icons';
import { useVisitorLanding } from './hooks/useVisitorLanding';
import { useBackgroundImages } from './hooks/useBackgroundImages';
import { EventBanner } from './components/EventBanner';
import { ItemsCarousel } from './components/ItemsCarousel';
import { EventDefaultImage } from './components/EventDefaultImage';
import { VisitorForm } from './components/VisitorForm';
import { ItemDetailModal } from './components/ItemDetailModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import './VisitorLanding.css';

const VisitorLanding: React.FC = () => {
  const {
    selectedItem,
    isItemModalOpen,
    isAdminModalOpen,
    showToast,
    toastMessage,
    items,
    backgroundImages,
    showItemCards,
    activeEvent,
    galleryLogo,
    galleryName,
    visitorForm,
    adminForm,
    handleItemClick,
    handleAdminLogin,
    handleAdminFormChange,
    handleAdminSubmit,
    handleVisitorFormChange,
    handleVisitorSubmit,
    formatPrice,
    setIsItemModalOpen,
    setIsAdminModalOpen,
    setShowToast
  } = useVisitorLanding();

  // Use the background images hook for image rotation
  const { currentIndex } = useBackgroundImages(backgroundImages);

  // Background style with the current image
  const backgroundStyle = backgroundImages.length > 0 
    ? {
        backgroundImage: `url(${
          backgroundImages[currentIndex].startsWith('data:') || backgroundImages[currentIndex].startsWith('http')
            ? backgroundImages[currentIndex]
            : `${window.location.origin}/${backgroundImages[currentIndex].replace(/^\//, '')}`
        })`
      }
    : { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>
            <div className="logo-container">
              {galleryLogo && (
                <img 
                  src={
                    galleryLogo.url.startsWith('data:') || galleryLogo.url.startsWith('http')
                      ? galleryLogo.url
                      : `${window.location.origin}/${galleryLogo.url.replace(/^\//, '')}`
                  } 
                  alt={galleryName || 'Gallery Logo'} 
                  className="gallery-logo"
                />
              )}
            </div>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleAdminLogin}>
              <IonIcon slot="icon-only" icon={lockClosedOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="landing-container" style={backgroundStyle}>
          <div className="landing-content">
            {/* Event Banner */}
            {activeEvent && <EventBanner activeEvent={activeEvent} />}
            
            {/* Main Content Area */}
            <div className="main-content-area">
              {/* Visitor Form */}
              <VisitorForm 
                visitorForm={visitorForm}
                onVisitorFormChange={handleVisitorFormChange}
                onVisitorSubmit={handleVisitorSubmit}
              />
              
              {/* Items Carousel or Event Default Image */}
              {showItemCards && items.length > 0 ? (
                <ItemsCarousel 
                  items={items} 
                  onItemClick={handleItemClick} 
                />
              ) : (
                activeEvent && activeEvent.imageUrl && (
                  <EventDefaultImage activeEvent={activeEvent} />
                )
              )}
            </div>
          </div>
        </div>
        
        {/* Item Detail Modal */}
        <ItemDetailModal 
          isOpen={isItemModalOpen}
          selectedItem={selectedItem}
          onClose={() => setIsItemModalOpen(false)}
          formatPrice={formatPrice}
        />
        
        {/* Admin Login Modal */}
        <AdminLoginModal 
          isOpen={isAdminModalOpen}
          adminForm={adminForm}
          onAdminFormChange={handleAdminFormChange}
          onAdminSubmit={handleAdminSubmit}
          onClose={() => setIsAdminModalOpen(false)}
        />
        
        {/* Toast Notification */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
        />
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <div className="footer-content">
            <p>© {new Date().getFullYear()} {galleryName || 'Art Gallery'}</p>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default VisitorLanding;
