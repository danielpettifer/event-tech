import React from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonChip,
  IonLabel,
  IonIcon,
  IonBadge
} from '@ionic/react';
import { closeOutline, pricetagOutline, calendarOutline, personOutline } from 'ionicons/icons';
import { ItemDetailModalProps } from '../types';

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  isOpen,
  selectedItem,
  onClose,
  formatPrice
}) => {
  if (!selectedItem) return null;

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{selectedItem.title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="item-detail-content">
          <div className="item-detail-image-container">
            <img 
              src={
                selectedItem.images[0].startsWith('data:') || selectedItem.images[0].startsWith('http') 
                  ? selectedItem.images[0] 
                  : `${window.location.origin}/${selectedItem.images[0].replace(/^\//, '')}`
              } 
              alt={selectedItem.title} 
              className="item-detail-image"
            />
          </div>
          
          <div className="item-detail-info">
            <h2>{selectedItem.title}</h2>
            <h3>{selectedItem.artist}</h3>
            
            <div className="item-detail-meta">
              <IonChip>
                <IonIcon icon={personOutline} />
                <IonLabel>{selectedItem.artist}</IonLabel>
              </IonChip>
              
              <IonChip>
                <IonIcon icon={calendarOutline} />
                <IonLabel>{selectedItem.year}</IonLabel>
              </IonChip>
              
              {selectedItem.status === 'Available' && (
                <IonChip color="success">
                  <IonIcon icon={pricetagOutline} />
                  <IonLabel>
                    {formatPrice(selectedItem.price, selectedItem.currency || '£')}
                  </IonLabel>
                </IonChip>
              )}
            </div>
            
            <p className="item-detail-description">{selectedItem.description}</p>
            
            <div className="item-detail-tags">
              {selectedItem.tags && selectedItem.tags.map((tag, index) => (
                <IonBadge key={index} color="medium" className="item-tag">
                  {tag}
                </IonBadge>
              ))}
            </div>
            
            {selectedItem.status === 'Available' && (
              <div className="item-purchase-info">
                <h4>Interested in purchasing?</h4>
                <p>Please contact the gallery for more information.</p>
                <IonButton expand="block" color="success">
                  Inquire About This Piece
                </IonButton>
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};
