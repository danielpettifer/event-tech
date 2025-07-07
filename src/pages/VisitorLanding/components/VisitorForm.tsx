import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton
} from '@ionic/react';
import { VisitorFormProps } from '../types';

export const VisitorForm: React.FC<VisitorFormProps> = ({
  visitorForm,
  onVisitorFormChange,
  onVisitorSubmit
}) => {
  return (
    <div className="visitor-form-container">
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Welcome to Our Gallery</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonItem>
            <IonLabel position="stacked">Name</IonLabel>
            <IonInput
              value={visitorForm.name}
              onIonInput={(e) => onVisitorFormChange('name', e.detail.value!)}
              placeholder="Your name"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              type="email"
              value={visitorForm.email}
              onIonInput={(e) => onVisitorFormChange('email', e.detail.value!)}
              placeholder="your.email@example.com"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Message</IonLabel>
            <IonTextarea
              value={visitorForm.message}
              onIonInput={(e) => onVisitorFormChange('message', e.detail.value!)}
              placeholder="Say hello or share your thoughts..."
              rows={3}
            />
          </IonItem>
          <IonButton 
            expand="block" 
            onClick={onVisitorSubmit}
            className="submit-button"
          >
            Submit
          </IonButton>
        </IonCardContent>
      </IonCard>
    </div>
  );
};
