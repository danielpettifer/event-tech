import React from 'react';
import { 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent 
} from '@ionic/react';
import { Event } from '../../../types/Event';

interface EventDefaultImageProps {
  activeEvent: Event;
}

export const EventDefaultImage: React.FC<EventDefaultImageProps> = ({ activeEvent }) => {
  if (!activeEvent || !activeEvent.imageUrl) return null;

  return (
    <div className="items-container">
      <IonCard className="event-default-card">
        <div className="event-default-image-container">
          <img 
            src={
              activeEvent.imageUrl.startsWith('data:') || activeEvent.imageUrl.startsWith('http') 
                ? activeEvent.imageUrl 
                : `${window.location.origin}/${activeEvent.imageUrl.replace(/^\//, '')}`
            } 
            alt={activeEvent.title}
            className="event-default-image"
          />
          <div className="event-default-overlay"></div>
        </div>
        <IonCardHeader>
          <IonCardTitle>{activeEvent.title}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p>{activeEvent.description}</p>
        </IonCardContent>
      </IonCard>
    </div>
  );
};
