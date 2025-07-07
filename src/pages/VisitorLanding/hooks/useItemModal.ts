import { useState } from 'react';
import { Item } from '../../../types/Item';

export const useItemModal = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (item: Item) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Optional: Clear the selected item after a delay to allow for exit animations
    setTimeout(() => {
      setSelectedItem(null);
    }, 300);
  };

  // Format price helper
  const formatPrice = (price: number, currency: string) => {
    if (price >= 1000000) {
      return `${currency} ${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `${currency} ${(price / 1000).toFixed(0)}K`;
    }
    return `${currency} ${price.toLocaleString()}`;
  };

  return {
    selectedItem,
    isOpen,
    openModal,
    closeModal,
    formatPrice
  };
};
