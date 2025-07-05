import React, { useState, useEffect } from 'react';
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
  IonToast
} from '@ionic/react';
import { close, save, person } from 'ionicons/icons';
import { Client, CATEGORIES, INTERESTS, COUNTRIES, BASIS_FOR_PROCESSING_OPTIONS } from '../types/Client';
import { ClientService } from '../services/ClientService';

interface ClientFormProps {
  isOpen: boolean;
  onDidDismiss: () => void;
  client?: Client | null;
  onSave: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ isOpen, onDidDismiss, client, onSave }) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    firstName: '',
    lastName: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    townCity: '',
    countyState: '',
    postcodeZip: '',
    country: '',
    onEmailList: false,
    basisForProcessing: '',
    dataProtectionDate: '',
    generalInformation: '',
    categories: [],
    interests: []
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (client) {
      // Editing existing client
      setFormData(client);
    } else {
      // Creating new client
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        townCity: '',
        countyState: '',
        postcodeZip: '',
        country: '',
        onEmailList: false,
        basisForProcessing: '',
        dataProtectionDate: '',
        generalInformation: '',
        categories: [],
        interests: []
      });
    }
    setErrors({});
  }, [client, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    if (!formData.addressLine1?.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.townCity?.trim()) newErrors.townCity = 'Town/City is required';
    if (!formData.country?.trim()) newErrors.country = 'Country is required';
    if (!formData.basisForProcessing?.trim()) newErrors.basisForProcessing = 'Basis for processing is required';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
      const clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        email: formData.email!,
        addressLine1: formData.addressLine1!,
        addressLine2: formData.addressLine2 || '',
        townCity: formData.townCity!,
        countyState: formData.countyState || '',
        postcodeZip: formData.postcodeZip || '',
        country: formData.country!,
        onEmailList: formData.onEmailList || false,
        basisForProcessing: formData.basisForProcessing!,
        dataProtectionDate: formData.dataProtectionDate || new Date().toISOString().split('T')[0],
        generalInformation: formData.generalInformation || '',
        categories: formData.categories || [],
        interests: formData.interests || []
      };

      if (client) {
        // Update existing client
        ClientService.updateClient(client.id, clientData);
        setToastMessage('Client updated successfully!');
      } else {
        // Create new client
        ClientService.saveClient(clientData);
        setToastMessage('Client created successfully!');
      }

      setShowToast(true);
      onSave();
      onDidDismiss();
    } catch (error) {
      setToastMessage('Error saving client. Please try again.');
      setShowToast(true);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      townCity: '',
      countyState: '',
      postcodeZip: '',
      country: '',
      onEmailList: false,
      basisForProcessing: '',
      dataProtectionDate: '',
      generalInformation: '',
      categories: [],
      interests: []
    });
    setErrors({});
    onDidDismiss();
  };

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              <IonIcon icon={person} style={{ marginRight: '8px' }} />
              {client ? 'Edit Client' : 'Add New Client'}
            </IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleClose}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ padding: '20px' }}>
            <IonCard>
              <IonCardContent>
                <IonGrid>
                  {/* Personal Information */}
                  <IonRow>
                    <IonCol size="12">
                      <h3 style={{ margin: '0 0 16px 0', color: 'var(--ion-color-primary)' }}>
                        Personal Information
                      </h3>
                    </IonCol>
                  </IonRow>
                  
                  <IonRow>
                    <IonCol size="12" sizeMd="6">
                      <IonItem className={errors.firstName ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">First Name *</IonLabel>
                        <IonInput
                          value={formData.firstName}
                          onIonInput={(e) => setFormData({...formData, firstName: e.detail.value!})}
                          placeholder="Enter first name"
                        />
                      </IonItem>
                      {errors.firstName && <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.8rem', margin: '4px 0 0 16px' }}>{errors.firstName}</p>}
                    </IonCol>
                    <IonCol size="12" sizeMd="6">
                      <IonItem className={errors.lastName ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">Last Name *</IonLabel>
                        <IonInput
                          value={formData.lastName}
                          onIonInput={(e) => setFormData({...formData, lastName: e.detail.value!})}
                          placeholder="Enter last name"
                        />
                      </IonItem>
                      {errors.lastName && <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.8rem', margin: '4px 0 0 16px' }}>{errors.lastName}</p>}
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <IonItem className={errors.email ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">Email Address *</IonLabel>
                        <IonInput
                          type="email"
                          value={formData.email}
                          onIonInput={(e) => setFormData({...formData, email: e.detail.value!})}
                          placeholder="Enter email address"
                        />
                      </IonItem>
                      {errors.email && <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.8rem', margin: '4px 0 0 16px' }}>{errors.email}</p>}
                    </IonCol>
                  </IonRow>

                  {/* Address Information */}
                  <IonRow>
                    <IonCol size="12">
                      <h3 style={{ margin: '24px 0 16px 0', color: 'var(--ion-color-primary)' }}>
                        Address Information
                      </h3>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <IonItem className={errors.addressLine1 ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">Address Line 1 *</IonLabel>
                        <IonInput
                          value={formData.addressLine1}
                          onIonInput={(e) => setFormData({...formData, addressLine1: e.detail.value!})}
                          placeholder="Enter address line 1"
                        />
                      </IonItem>
                      {errors.addressLine1 && <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.8rem', margin: '4px 0 0 16px' }}>{errors.addressLine1}</p>}
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <IonItem>
                        <IonLabel position="stacked">Address Line 2</IonLabel>
                        <IonInput
                          value={formData.addressLine2}
                          onIonInput={(e) => setFormData({...formData, addressLine2: e.detail.value!})}
                          placeholder="Enter address line 2 (optional)"
                        />
                      </IonItem>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12" sizeMd="6">
                      <IonItem className={errors.townCity ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">Town/City *</IonLabel>
                        <IonInput
                          value={formData.townCity}
                          onIonInput={(e) => setFormData({...formData, townCity: e.detail.value!})}
                          placeholder="Enter town or city"
                        />
                      </IonItem>
                      {errors.townCity && <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.8rem', margin: '4px 0 0 16px' }}>{errors.townCity}</p>}
                    </IonCol>
                    <IonCol size="12" sizeMd="6">
                      <IonItem>
                        <IonLabel position="stacked">County/State</IonLabel>
                        <IonInput
                          value={formData.countyState}
                          onIonInput={(e) => setFormData({...formData, countyState: e.detail.value!})}
                          placeholder="Enter county or state"
                        />
                      </IonItem>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12" sizeMd="6">
                      <IonItem>
                        <IonLabel position="stacked">Postcode/ZIP</IonLabel>
                        <IonInput
                          value={formData.postcodeZip}
                          onIonInput={(e) => setFormData({...formData, postcodeZip: e.detail.value!})}
                          placeholder="Enter postcode or ZIP"
                        />
                      </IonItem>
                    </IonCol>
                    <IonCol size="12" sizeMd="6">
                      <IonItem className={errors.country ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">Country *</IonLabel>
                        <IonSelect
                          value={formData.country}
                          onIonChange={(e) => setFormData({...formData, country: e.detail.value})}
                          placeholder="Select country"
                        >
                          {COUNTRIES.map((country) => (
                            <IonSelectOption key={country} value={country}>
                              {country}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>
                      {errors.country && <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.8rem', margin: '4px 0 0 16px' }}>{errors.country}</p>}
                    </IonCol>
                  </IonRow>

                  {/* Data Protection & Preferences */}
                  <IonRow>
                    <IonCol size="12">
                      <h3 style={{ margin: '24px 0 16px 0', color: 'var(--ion-color-primary)' }}>
                        Data Protection & Preferences
                      </h3>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <IonItem>
                        <IonCheckbox
                          checked={formData.onEmailList}
                          onIonChange={(e) => setFormData({...formData, onEmailList: e.detail.checked})}
                        />
                        <IonLabel style={{ marginLeft: '12px' }}>
                          Add to email list for updates and newsletters
                        </IonLabel>
                      </IonItem>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <IonItem className={errors.basisForProcessing ? 'ion-invalid' : ''}>
                        <IonLabel position="stacked">Basis for Processing Personal Data *</IonLabel>
                        <IonSelect
                          value={formData.basisForProcessing}
                          onIonChange={(e) => setFormData({...formData, basisForProcessing: e.detail.value})}
                          placeholder="Select basis for processing"
                        >
                          {BASIS_FOR_PROCESSING_OPTIONS.map((basis) => (
                            <IonSelectOption key={basis} value={basis}>
                              {basis}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>
                      {errors.basisForProcessing && <p style={{ color: 'var(--ion-color-danger)', fontSize: '0.8rem', margin: '4px 0 0 16px' }}>{errors.basisForProcessing}</p>}
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <IonItem>
                        <IonLabel position="stacked">Data Protection Processing Date</IonLabel>
                        <IonInput
                          type="date"
                          value={formData.dataProtectionDate}
                          onIonInput={(e) => setFormData({...formData, dataProtectionDate: e.detail.value!})}
                        />
                      </IonItem>
                    </IonCol>
                  </IonRow>

                  {/* Categories & Interests */}
                  <IonRow>
                    <IonCol size="12">
                      <h3 style={{ margin: '24px 0 16px 0', color: 'var(--ion-color-primary)' }}>
                        Categories & Interests
                      </h3>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <IonItem>
                        <IonLabel position="stacked">Categories</IonLabel>
                        <IonSelect
                          multiple={true}
                          value={formData.categories}
                          onIonChange={(e) => setFormData({...formData, categories: e.detail.value})}
                          placeholder="Select categories"
                        >
                          {CATEGORIES.map((category) => (
                            <IonSelectOption key={category} value={category}>
                              {category}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <IonItem>
                        <IonLabel position="stacked">Interests</IonLabel>
                        <IonSelect
                          multiple={true}
                          value={formData.interests}
                          onIonChange={(e) => setFormData({...formData, interests: e.detail.value})}
                          placeholder="Select interests"
                        >
                          {INTERESTS.map((interest) => (
                            <IonSelectOption key={interest} value={interest}>
                              {interest}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>
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
                        <IonLabel position="stacked">General Information / Notes</IonLabel>
                        <IonTextarea
                          value={formData.generalInformation}
                          onIonInput={(e) => setFormData({...formData, generalInformation: e.detail.value!})}
                          placeholder="Enter any additional notes or information about the client..."
                          rows={4}
                        />
                      </IonItem>
                    </IonCol>
                  </IonRow>

                  {/* Action Buttons */}
                  <IonRow>
                    <IonCol size="12">
                      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <IonButton expand="block" onClick={handleSave}>
                          <IonIcon icon={save} slot="start" />
                          {client ? 'Update Client' : 'Create Client'}
                        </IonButton>
                        <IonButton expand="block" fill="outline" onClick={handleClose}>
                          Cancel
                        </IonButton>
                      </div>
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

export default ClientForm;
