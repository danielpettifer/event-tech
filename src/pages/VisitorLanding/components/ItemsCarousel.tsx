import React from 'react';
import { 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { ItemsCarouselProps } from '../types';

export const ItemsCarousel: React.FC<ItemsCarouselProps> = ({ items, onItemClick }) => {
  if (items.length === 0) return null;

  return (
    <div className="items-container">
      <IonGrid>
        <IonRow>
          {items.map((item) => (
            <IonCol size="12" sizeSm="6" sizeMd="4" sizeLg="3" key={item.id}>
              <IonCard className="item-card" onClick={() => onItemClick(item)}>
                <div className="item-image-container">
                  <img 
                    src={
                      (item.thumbnailImage || item.images[0]).startsWith('data:') || 
                      (item.thumbnailImage || item.images[0]).startsWith('http') 
                        ? (item.thumbnailImage || item.images[0]) 
                        : `${window.location.origin}/${(item.thumbnailImage || item.images[0]).replace(/^\//, '')}`
                    } 
                    alt={item.title} 
                    className="item-image"
                  />
                  <div className="item-card-overlay"></div>
                </div>
                <IonCardHeader>
                  <IonCardTitle>{item.title}</IonCardTitle>
                  <IonCardSubtitle>{item.artist}</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </div>
  );
};
