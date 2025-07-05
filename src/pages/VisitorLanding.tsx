import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonTextarea,
  IonItem,
  IonLabel,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonToast
} from '@ionic/react';
import { close, chevronForward, lockClosed, person } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './VisitorLanding.css';

// Dummy data for items
const dummyItems = [
  {
    id: 1,
    title: 'Abstract Composition #1',
    artist: 'Jane Smith',
    year: 2023,
    medium: 'Oil on Canvas',
    dimensions: '120 x 90 cm',
    price: '£2,500',
    image: 'https://via.placeholder.com/400x300/333/fff?text=Abstract+Art+1'
  },
  {
    id: 2,
    title: 'Urban Landscape',
    artist: 'John Doe',
    year: 2022,
    medium: 'Acrylic on Canvas',
    dimensions: '100 x 80 cm',
    price: '£1,800',
    image: 'https://via.placeholder.com/400x300/666/fff?text=Urban+Landscape'
  },
  {
    id: 3,
    title: 'Still Life with Flowers',
    artist: 'Maria Garcia',
    year: 2023,
    medium: 'Watercolor',
    dimensions: '60 x 45 cm',
    price: '£950',
    image: 'https://via.placeholder.com/400x300/999/fff?text=Still+Life'
  }
];

const VisitorLanding: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [visitorForm, setVisitorForm] = useState({
    name: '',
    email: '',
    message: '',
    interest: ''
  });
  const [adminForm, setAdminForm] = useState({
    email: '',
    password: ''
  });
  const history = useHistory();

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsItemModalOpen(true);
  };

  const handleAdminLogin = () => {
    setIsAdminModalOpen(true);
  };

  const handleAdminSubmit = () => {
    // Demo credentials
    if (adminForm.email === 'admin@gallery.com' && adminForm.password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', adminForm.email);
      setIsAdminModalOpen(false);
      setAdminForm({ email: '', password: '' });
      history.push('/admin');
    } else {
      setToastMessage('Invalid credentials. Use admin@gallery.com / admin123');
      setShowToast(true);
    }
  };

  const handleVisitorSubmit = () => {
    // Handle visitor form submission
    console.log('Visitor form submitted:', visitorForm);
    setToastMessage('Thank you for your message!');
    setShowToast(true);
    // Reset form
    setVisitorForm({ name: '', email: '', message: '', interest: '' });
  };

  return (
    <IonPage>
      <IonContent fullscreen className="visitor-landing">
        {/* Background Image Container */}
        <div className="background-container">
          <div className="background-image"></div>
        </div>

        {/* Items Display */}
        <div className="items-container">
          <IonGrid>
            <IonRow>
              {dummyItems.map((item) => (
                <IonCol size="12" sizeMd="6" sizeLg="4" key={item.id}>
                  <IonCard 
                    className="item-card" 
                    button 
                    onClick={() => handleItemClick(item)}
                  >
                    <img src={item.image} alt={item.title} />
                    <IonCardHeader>
                      <IonCardTitle>{item.title}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <p>{item.artist}, {item.year}</p>
                      <p>{item.price}</p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </div>

        {/* Visitor Form */}
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
                  onIonInput={(e) => setVisitorForm({...visitorForm, name: e.detail.value!})}
                  placeholder="Your name"
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  type="email"
                  value={visitorForm.email}
                  onIonInput={(e) => setVisitorForm({...visitorForm, email: e.detail.value!})}
                  placeholder="your.email@example.com"
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Message</IonLabel>
                <IonTextarea
                  value={visitorForm.message}
                  onIonInput={(e) => setVisitorForm({...visitorForm, message: e.detail.value!})}
                  placeholder="Say hello or share your thoughts..."
                  rows={3}
                />
              </IonItem>
              <IonButton 
                expand="block" 
                onClick={handleVisitorSubmit}
                className="submit-button"
              >
                Submit
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Admin Login Button */}
        <IonButton
          fill="clear"
          className="admin-login-button"
          onClick={handleAdminLogin}
        >
          <IonIcon icon={chevronForward} />
        </IonButton>

        {/* Item Detail Modal */}
        <IonModal isOpen={isItemModalOpen} onDidDismiss={() => setIsItemModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{selectedItem?.title}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsItemModalOpen(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {selectedItem && (
              <div className="item-detail">
                <img src={selectedItem.image} alt={selectedItem.title} />
                <IonCard>
                  <IonCardContent>
                    <h2>{selectedItem.title}</h2>
                    <p><strong>Artist:</strong> {selectedItem.artist}</p>
                    <p><strong>Year:</strong> {selectedItem.year}</p>
                    <p><strong>Medium:</strong> {selectedItem.medium}</p>
                    <p><strong>Dimensions:</strong> {selectedItem.dimensions}</p>
                    <p><strong>Price:</strong> {selectedItem.price}</p>
                  </IonCardContent>
                </IonCard>
              </div>
            )}
          </IonContent>
        </IonModal>

        {/* Admin Login Modal */}
        <IonModal isOpen={isAdminModalOpen} onDidDismiss={() => setIsAdminModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Admin Login</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsAdminModalOpen(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div style={{ padding: '20px' }}>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <IonIcon icon={lockClosed} style={{ marginRight: '8px' }} />
                    Gallery Admin Access
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonItem>
                    <IonIcon icon={person} slot="start" />
                    <IonLabel position="stacked">Email</IonLabel>
                    <IonInput
                      type="email"
                      value={adminForm.email}
                      onIonInput={(e) => setAdminForm({...adminForm, email: e.detail.value!})}
                      placeholder="admin@gallery.com"
                    />
                  </IonItem>
                  <IonItem>
                    <IonIcon icon={lockClosed} slot="start" />
                    <IonLabel position="stacked">Password</IonLabel>
                    <IonInput
                      type="password"
                      value={adminForm.password}
                      onIonInput={(e) => setAdminForm({...adminForm, password: e.detail.value!})}
                      placeholder="Enter password"
                    />
                  </IonItem>
                  <IonButton 
                    expand="block" 
                    onClick={handleAdminSubmit}
                    style={{ marginTop: '20px' }}
                  >
                    Login
                  </IonButton>
                  <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: '#666' }}>
                    Demo: admin@gallery.com / admin123
                  </p>
                </IonCardContent>
              </IonCard>
            </div>
          </IonContent>
        </IonModal>

        {/* Toast for notifications */}
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

export default VisitorLanding;
