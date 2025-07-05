import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonAlert,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton
} from '@ionic/react';
import { logIn, person, lockClosed } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();

  const handleLogin = () => {
    // Simple validation for demo purposes
    if (!credentials.email || !credentials.password) {
      setAlertMessage('Please enter both email and password.');
      setShowAlert(true);
      return;
    }

    // Demo login - in real app, this would authenticate with backend
    if (credentials.email === 'admin@gallery.com' && credentials.password === 'admin123') {
      // Store auth state (in real app, use proper auth management)
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', credentials.email);
      history.push('/admin');
    } else {
      setAlertMessage('Invalid email or password. Try admin@gallery.com / admin123');
      setShowAlert(true);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Admin Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="admin-login">
        <div className="login-container">
          <div className="login-header">
            <IonIcon icon={person} className="login-icon" />
            <h1>Gallery Admin</h1>
            <p>Sign in to manage your gallery</p>
          </div>

          <IonCard className="login-card">
            <IonCardHeader>
              <IonCardTitle>Sign In</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem className="login-item">
                <IonIcon icon={person} slot="start" />
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  type="email"
                  value={credentials.email}
                  onIonInput={(e) => setCredentials({...credentials, email: e.detail.value!})}
                  onKeyPress={handleKeyPress}
                  placeholder="admin@gallery.com"
                />
              </IonItem>

              <IonItem className="login-item">
                <IonIcon icon={lockClosed} slot="start" />
                <IonLabel position="stacked">Password</IonLabel>
                <IonInput
                  type="password"
                  value={credentials.password}
                  onIonInput={(e) => setCredentials({...credentials, password: e.detail.value!})}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                />
              </IonItem>

              <IonButton
                expand="block"
                onClick={handleLogin}
                className="login-button"
              >
                <IonIcon icon={logIn} slot="start" />
                Sign In
              </IonButton>

              <div className="demo-credentials">
                <p><strong>Demo Credentials:</strong></p>
                <p>Email: admin@gallery.com</p>
                <p>Password: admin123</p>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Login Error"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminLogin;
