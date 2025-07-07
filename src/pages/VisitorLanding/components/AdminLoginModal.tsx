import React from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonIcon
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { AdminLoginModalProps } from '../types';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  adminForm,
  onAdminFormChange,
  onAdminSubmit,
  onClose
}) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin Login</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="admin-login-form">
          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              type="email"
              value={adminForm.email}
              onIonInput={(e) => onAdminFormChange('email', e.detail.value!)}
              placeholder="admin@gallery.com"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput
              type="password"
              value={adminForm.password}
              onIonInput={(e) => onAdminFormChange('password', e.detail.value!)}
              placeholder="Enter password"
            />
          </IonItem>
          <IonButton 
            expand="block" 
            onClick={onAdminSubmit}
            className="login-button"
          >
            Login
          </IonButton>
          <p className="login-hint">
            <small>Demo credentials: admin@gallery.com / admin123</small>
          </p>
        </div>
      </IonContent>
    </IonModal>
  );
};
