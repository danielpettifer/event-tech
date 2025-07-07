import { useState, useEffect } from 'react';

export const useBackgroundImages = (images: string[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Set up background image rotation if there are multiple images
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 20000); // 20 seconds per image
      
      return () => clearInterval(interval);
    }
  }, [images.length]);

  return {
    currentIndex,
    setCurrentIndex
  };
};
