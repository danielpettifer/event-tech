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
  IonCol
} from '@ionic/react';
import { close, chevronForward } from 'ionicons/icons';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visitorForm, setVisitorForm] = useState({
    name: '',
    email: '',
    message: '',
    interest: ''
  });
  const history = useHistory();

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAdminLogin = () => {
    history.push('/admin/login');
  };

  const handleVisitorSubmit = () => {
    // Handle visitor form submission
    console.log('Visitor form submitted:', visitorForm);
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
        <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{selectedItem?.title}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsModalOpen(false)}>
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
      </IonContent>
    </IonPage>
  );
};

export default VisitorLanding;
