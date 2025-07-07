import { Item } from '../../types/Item';
import { Event } from '../../types/Event';
import { LogoImage } from '../../types/GallerySettings';

export interface VisitorFormData {
  name: string;
  email: string;
  message: string;
  interest: string;
}

export interface AdminFormData {
  email: string;
  password: string;
}

export interface ItemsCarouselProps {
  items: Item[];
  onItemClick: (item: Item) => void;
}

export interface EventBannerProps {
  activeEvent: Event | null;
}

export interface VisitorFormProps {
  visitorForm: VisitorFormData;
  onVisitorFormChange: (field: keyof VisitorFormData, value: string) => void;
  onVisitorSubmit: () => void;
}

export interface ItemDetailModalProps {
  isOpen: boolean;
  selectedItem: Item | null;
  onClose: () => void;
  formatPrice: (price: number, currency: string) => string;
}

export interface AdminLoginModalProps {
  isOpen: boolean;
  adminForm: AdminFormData;
  onAdminFormChange: (field: keyof AdminFormData, value: string) => void;
  onAdminSubmit: () => void;
  onClose: () => void;
}

export interface BackgroundImagesProps {
  backgroundImages: string[];
  currentBackgroundIndex: number;
}
