import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonChip,
  IonLabel,
  IonBadge
} from '@ionic/react';
import { EventBannerProps } from '../types';

export const EventBanner: React.FC<EventBannerProps> = ({ activeEvent }) => {
  if (!activeEvent) return null;

  return (
    <div className="active-event-banner">
      <IonCard className="event-banner-card">
        <IonCardContent>
          <div className="event-banner-content">
            <div className="event-banner-info">
              <h2>{activeEvent.title}</h2>
              <p>{activeEvent.description}</p>
              <div className="event-banner-details">
                <IonChip color="primary">
                  <IonLabel>{activeEvent.eventType}</IonLabel>
                </IonChip>
                <IonChip color="secondary">
                  <IonLabel>
                    {new Date(activeEvent.startDate).toLocaleDateString()} - {new Date(activeEvent.endDate).toLocaleDateString()}
                  </IonLabel>
                </IonChip>
                {activeEvent.isTicketed && activeEvent.ticketPrice && (
                  <IonChip color="success">
                    <IonLabel>£{activeEvent.ticketPrice}</IonLabel>
                  </IonChip>
                )}
              </div>
            </div>
            <IonBadge color="success" className="active-badge">
              Active Event
            </IonBadge>
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  );
};
