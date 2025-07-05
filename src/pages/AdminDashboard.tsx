import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge
} from '@ionic/react';
import {
  business,
  person,
  people,
  images,
  calendar,
  settings,
  logOut,
  statsChart,
  mail,
  home
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './AdminDashboard.css';

// Dummy data
const dummyStats = {
  totalVisitors: 156,
  totalClients: 23,
  activeEvents: 2,
  totalItems: 45
};

const dummyRecentVisitors = [
  { id: 1, name: 'John Smith', email: 'john@example.com', visitDate: '2025-01-07', interest: 'Abstract Art' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', visitDate: '2025-01-06', interest: 'Landscapes' },
  { id: 3, name: 'Mike Brown', email: 'mike@example.com', visitDate: '2025-01-06', interest: 'Sculptures' }
];

const AdminDashboard: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [userEmail, setUserEmail] = useState('');
  const history = useHistory();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    
    if (!isAuthenticated) {
      history.push('/admin/login');
      return;
    }
    
    if (email) {
      setUserEmail(email);
    }
  }, [history]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    history.push('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: statsChart },
    { id: 'events', label: 'Events', icon: calendar },
    { id: 'clients', label: 'Clients', icon: people },
    { id: 'items', label: 'Items', icon: images },
    { id: 'settings', label: 'Settings', icon: settings }
  ];

  const renderDashboard = () => (
    <div className="dashboard-content">
      <IonGrid>
        <IonRow>
          <IonCol size="12" sizeMd="6" sizeLg="3">
            <IonCard className="stat-card">
              <IonCardContent>
                <div className="stat-item">
                  <IonIcon icon={people} className="stat-icon" />
                  <div>
                    <h2>{dummyStats.totalVisitors}</h2>
                    <p>Total Visitors</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol size="12" sizeMd="6" sizeLg="3">
            <IonCard className="stat-card">
              <IonCardContent>
                <div className="stat-item">
                  <IonIcon icon={person} className="stat-icon" />
                  <div>
                    <h2>{dummyStats.totalClients}</h2>
                    <p>Total Clients</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol size="12" sizeMd="6" sizeLg="3">
            <IonCard className="stat-card">
              <IonCardContent>
                <div className="stat-item">
                  <IonIcon icon={calendar} className="stat-icon" />
                  <div>
                    <h2>{dummyStats.activeEvents}</h2>
                    <p>Active Events</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol size="12" sizeMd="6" sizeLg="3">
            <IonCard className="stat-card">
              <IonCardContent>
                <div className="stat-item">
                  <IonIcon icon={images} className="stat-icon" />
                  <div>
                    <h2>{dummyStats.totalItems}</h2>
                    <p>Total Items</p>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
        
        <IonRow>
          <IonCol size="12">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Recent Visitors</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  {dummyRecentVisitors.map((visitor) => (
                    <IonItem key={visitor.id}>
                      <IonAvatar slot="start">
                        <div className="avatar-placeholder">
                          {visitor.name.charAt(0)}
                        </div>
                      </IonAvatar>
                      <IonLabel>
                        <h3>{visitor.name}</h3>
                        <p>{visitor.email}</p>
                        <p>Interested in: {visitor.interest}</p>
                      </IonLabel>
                      <IonBadge slot="end">{visitor.visitDate}</IonBadge>
                    </IonItem>
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );

  const renderContent = () => {
    switch (selectedSection) {
      case 'dashboard':
        return renderDashboard();
      case 'events':
        return (
          <div className="section-content">
            <h2>Events Management</h2>
            <p>Manage your gallery events here. (Coming soon)</p>
          </div>
        );
      case 'clients':
        return (
          <div className="section-content">
            <h2>Client Management</h2>
            <p>Manage your clients here. (Coming soon)</p>
          </div>
        );
      case 'items':
        return (
          <div className="section-content">
            <h2>Items Management</h2>
            <p>Manage your gallery items here. (Coming soon)</p>
          </div>
        );
      case 'settings':
        return (
          <div className="section-content">
            <h2>Settings</h2>
            <p>Configure your gallery settings here. (Coming soon)</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <IonPage>
      <IonSplitPane contentId="main-content">
        <IonMenu contentId="main-content" type="overlay">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Gallery Admin</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {/* Gallery/Company Section */}
            <div className="company-section">
              <IonCard>
                <IonCardContent>
                  <div className="company-info">
                    <IonAvatar className="company-logo">
                      <div className="logo-placeholder">
                        <IonIcon icon={business} />
                      </div>
                    </IonAvatar>
                    <div>
                      <h3>Demo Gallery</h3>
                      <p>123 Art Street, London</p>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>

            {/* Navigation Menu */}
            <IonList>
              {menuItems.map((item) => (
                <IonItem
                  key={item.id}
                  button
                  className={selectedSection === item.id ? 'selected' : ''}
                  onClick={() => setSelectedSection(item.id)}
                >
                  <IonIcon icon={item.icon} slot="start" />
                  <IonLabel>{item.label}</IonLabel>
                </IonItem>
              ))}
            </IonList>

            {/* Personal Account Section */}
            <div className="personal-section">
              <IonCard>
                <IonCardContent>
                  <div className="personal-info">
                    <IonAvatar>
                      <div className="avatar-placeholder">
                        {userEmail.charAt(0).toUpperCase()}
                      </div>
                    </IonAvatar>
                    <div>
                      <h4>Admin User</h4>
                      <p>{userEmail}</p>
                    </div>
                  </div>
                  <IonButton
                    fill="clear"
                    size="small"
                    onClick={handleLogout}
                    className="logout-button"
                  >
                    <IonIcon icon={logOut} slot="start" />
                    Logout
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </div>
          </IonContent>
        </IonMenu>

        <div className="ion-page" id="main-content">
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle>
                {menuItems.find(item => item.id === selectedSection)?.label || 'Dashboard'}
              </IonTitle>
              <IonButtons slot="end">
                <IonButton fill="clear" onClick={() => history.push('/')}>
                  <IonIcon icon={home} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {renderContent()}
          </IonContent>
        </div>
      </IonSplitPane>
    </IonPage>
  );
};

export default AdminDashboard;
