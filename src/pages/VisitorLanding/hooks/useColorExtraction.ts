import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook to extract the dominant dark color from an image URL
 */
const useColorExtraction = (imageUrl: string | null) => {
  const [dominantColor, setDominantColor] = useState<string>('rgba(0,0,0,0.8)');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  /**
   * Analyzes pixel data to find the dominant dark color
   */
  const analyzeDarkColors = (pixels: Uint8ClampedArray): string => {
    const colorFrequency: Record<string, number> = {};
    
    // Sample pixels for performance (every 16 bytes = every 4 pixels)
    for (let i = 0; i < pixels.length; i += 16) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];
      
      // Skip transparent pixels
      if (a < 128) continue;
      
      // Calculate brightness
      const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
      
      // Only consider dark colors (brightness < 80)
      if (brightness < 80) {
        // Quantize colors to reduce noise
        const quantizedR = Math.floor(r / 32) * 32;
        const quantizedG = Math.floor(g / 32) * 32;
        const quantizedB = Math.floor(b / 32) * 32;
        
        const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
        colorFrequency[colorKey] = (colorFrequency[colorKey] || 0) + 1;
      }
    }
    
    // Find most frequent dark color
    let dominantColorKey = '0,0,0'; // Default black
    let maxFrequency = 0;
    
    Object.keys(colorFrequency).forEach(key => {
      if (colorFrequency[key] > maxFrequency) {
        maxFrequency = colorFrequency[key];
        dominantColorKey = key;
      }
    });
    
    // Return with 0.8 opacity for UI elements that need transparency
    return `rgba(${dominantColorKey}, 0.8)`;
  };

  /**
   * Extracts the dominant dark color from an image URL
   */
  const extractColor = useCallback(async (url: string) => {
    if (!url) return;
    
    setIsExtracting(true);
    try {
      // Create a promise to handle the image loading
      const colorPromise = new Promise<string>((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          if (!ctx) {
            resolve('rgba(0,0,0,0.8)');
            return;
          }
          
          // Resize for performance (sample smaller version)
          canvas.width = 100;
          canvas.height = 100;
          ctx.drawImage(img, 0, 0, 100, 100);
          
          const imageData = ctx.getImageData(0, 0, 100, 100);
          const color = analyzeDarkColors(imageData.data);
          
          resolve(color);
        };
        
        img.onerror = () => {
          console.warn('Failed to load image for color extraction');
          resolve('rgba(0,0,0,0.8)');
        };
        
        // Handle CORS issues
        img.crossOrigin = 'anonymous';
        img.src = url;
        
        // If the image is already cached, the onload event might not fire
        if (img.complete) {
          img.onload?.(new Event('load') as any);
        }
      });
      
      const color = await colorPromise;
      setDominantColor(color);
      
      // Extract RGB components from the color
      const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      
      if (rgbMatch) {
        const r = rgbMatch[1];
        const g = rgbMatch[2];
        const b = rgbMatch[3];
        
        // Log the extracted color for debugging
        console.log('Extracted color:', color);
        console.log('RGB components:', r, g, b);
        
        // Apply to CSS custom properties - both with transparency and without
        document.documentElement.style.setProperty('--dynamic-dark-color', color);
        document.documentElement.style.setProperty('--dynamic-dark-color-solid', `rgb(${r}, ${g}, ${b})`);
      } else {
        // Fallback if regex fails
        document.documentElement.style.setProperty('--dynamic-dark-color', color);
        document.documentElement.style.setProperty('--dynamic-dark-color-solid', 'rgb(0, 0, 0)');
      }
      
    } catch (error) {
      console.warn('Color extraction failed:', error);
    } finally {
      setIsExtracting(false);
    }
  }, []);

  // Extract color when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      extractColor(imageUrl);
    }
  }, [imageUrl, extractColor]);

  return { dominantColor, extractColor, isExtracting };
};

export default useColorExtraction;
