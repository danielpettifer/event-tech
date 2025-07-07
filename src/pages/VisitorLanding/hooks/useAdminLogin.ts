import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AdminFormData } from '../types';

export const useAdminLogin = (setToastMessage: (message: string) => void, setShowToast: (show: boolean) => void) => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminForm, setAdminForm] = useState<AdminFormData>({
    email: 'admin@gallery.com',
    password: ''
  });
  const history = useHistory();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleFormChange = (field: keyof AdminFormData, value: string) => {
    setAdminForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Demo credentials
    if (adminForm.email === 'admin@gallery.com' && adminForm.password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', adminForm.email);
      setIsOpen(false);
      setAdminForm({ email: 'admin@gallery.com', password: '' });
      history.push('/admin');
    } else {
      setToastMessage('Invalid credentials. Use admin@gallery.com / admin123');
      setShowToast(true);
    }
  };

  return {
    isOpen,
    adminForm,
    openModal,
    closeModal,
    handleFormChange,
    handleSubmit
  };
};
