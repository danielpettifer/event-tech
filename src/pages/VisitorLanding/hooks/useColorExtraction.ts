import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook to extract the dominant color from an image URL and ensure it's dark enough for white text
 */
const useColorExtraction = (imageUrl: string | null) => {
  const [dominantColor, setDominantColor] = useState<string>('rgba(0,0,0,0.8)');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  /**
   * Converts RGB to HSL color space
   * Returns [h, s, l] where h is in [0, 360), s and l are in [0, 100]
   */
  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    return [h * 360, s * 100, l * 100];
  };
  
  /**
   * Converts HSL to RGB color space
   * h is in [0, 360), s and l are in [0, 100]
   * Returns [r, g, b] where r, g, b are in [0, 255]
   */
  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };
  
  /**
   * Calculates the relative luminance of an RGB color
   * Used for contrast calculations according to WCAG 2.0
   */
  const calculateLuminance = (r: number, g: number, b: number): number => {
    const rsrgb = r / 255;
    const gsrgb = g / 255;
    const bsrgb = b / 255;
    
    const r1 = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
    const g1 = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
    const b1 = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);
    
    return 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
  };
  
  /**
   * Calculates contrast ratio between two colors
   * Returns a value between 1 and 21
   * WCAG 2.0 requires a contrast ratio of at least 4.5:1 for normal text
   */
  const calculateContrastRatio = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number => {
    const l1 = calculateLuminance(r1, g1, b1);
    const l2 = calculateLuminance(r2, g2, b2);
    
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  
  /**
   * Ensures a color is dark enough for white text by adjusting its lightness
   * Preserves the hue and saturation while reducing lightness until sufficient contrast is achieved
   */
  const ensureDarkEnough = (r: number, g: number, b: number): [number, number, number] => {
    // Calculate contrast with white (255, 255, 255)
    let contrastRatio = calculateContrastRatio(r, g, b, 255, 255, 255);
    
    // If contrast is already sufficient (4.5:1 is WCAG AA standard)
    if (contrastRatio >= 4.5) {
      return [r, g, b];
    }
    
    // Convert to HSL to adjust lightness
    let [h, s, l] = rgbToHsl(r, g, b);
    
    // Gradually reduce lightness until we achieve sufficient contrast
    while (contrastRatio < 4.5 && l > 0) {
      l -= 5; // Reduce lightness in steps
      if (l < 0) l = 0; // Ensure lightness doesn't go negative
      
      // Convert back to RGB
      const [newR, newG, newB] = hslToRgb(h, s, l);
      
      // Recalculate contrast
      contrastRatio = calculateContrastRatio(newR, newG, newB, 255, 255, 255);
      
      // If we've reached maximum darkness and still don't have enough contrast
      if (l === 0 && contrastRatio < 4.5) {
        // Force a dark color that will have sufficient contrast
        return [0, 0, 0]; // Black
      }
      
      // If we have sufficient contrast, return the adjusted color
      if (contrastRatio >= 4.5) {
        return [newR, newG, newB];
      }
    }
    
    // Fallback to black if we couldn't achieve sufficient contrast
    return [0, 0, 0];
  };

  /**
   * Analyzes pixel data to find the dominant color and ensure it's dark enough for white text
   */
  const analyzeColors = (pixels: Uint8ClampedArray): string => {
    const colorFrequency: Record<string, number> = {};
    
    // Sample pixels for performance (every 16 bytes = every 4 pixels)
    for (let i = 0; i < pixels.length; i += 16) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];
      
      // Skip transparent pixels
      if (a < 128) continue;
      
      // Quantize colors to reduce noise and improve clustering
      const quantizedR = Math.floor(r / 32) * 32;
      const quantizedG = Math.floor(g / 32) * 32;
      const quantizedB = Math.floor(b / 32) * 32;
      
      const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
      colorFrequency[colorKey] = (colorFrequency[colorKey] || 0) + 1;
    }
    
    // Find most frequent color
    let dominantColorKey = '0,0,0'; // Default black
    let maxFrequency = 0;
    
    Object.keys(colorFrequency).forEach(key => {
      if (colorFrequency[key] > maxFrequency) {
        maxFrequency = colorFrequency[key];
        dominantColorKey = key;
      }
    });
    
    // Parse the RGB components
    const [r, g, b] = dominantColorKey.split(',').map(Number);
    
    // Ensure the color is dark enough for white text
    const [adjustedR, adjustedG, adjustedB] = ensureDarkEnough(r, g, b);
    
    // Return with 0.8 opacity for UI elements that need transparency
    return `rgba(${adjustedR},${adjustedG},${adjustedB}, 0.8)`;
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
          const color = analyzeColors(imageData.data);
          
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
        
        // Calculate contrast ratio with white text for debugging
        const contrastRatio = calculateContrastRatio(
          parseInt(r), parseInt(g), parseInt(b), 
          255, 255, 255
        );
        
        // Log the extracted color and contrast information for debugging
        console.log('Extracted color:', color);
        console.log('RGB components:', r, g, b);
        console.log('Contrast ratio with white text:', contrastRatio.toFixed(2), 
                    contrastRatio >= 4.5 ? '(WCAG AA Pass)' : '(WCAG AA Fail)');
        
        // Apply to CSS custom properties with smooth transitions
        // First get the current colors to check if they're changing
        const currentColor = getComputedStyle(document.documentElement).getPropertyValue('--dynamic-dark-color').trim();
        const currentSolidColor = getComputedStyle(document.documentElement).getPropertyValue('--dynamic-dark-color-solid').trim();
        
        // Only apply transition class if colors are actually changing
        if (currentColor !== color || currentSolidColor !== `rgb(${r}, ${g}, ${b})`) {
          console.log('Color changing, applying transition');
          
          // Apply both color updates in a single frame to ensure synchronized transitions
          requestAnimationFrame(() => {
            // Apply the new colors with transitions - using direct property setting
            document.documentElement.style.setProperty('--dynamic-dark-color', color);
            document.documentElement.style.setProperty('--dynamic-dark-color-solid', `rgb(${r}, ${g}, ${b})`);
            console.log('Applied synchronized color updates');
          });
        } else {
          // If colors aren't changing, just set them without transition
          document.documentElement.style.setProperty('--dynamic-dark-color', color);
          document.documentElement.style.setProperty('--dynamic-dark-color-solid', `rgb(${r}, ${g}, ${b})`);
        }
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

  // Extract color when imageUrl changes, with a delay to sync with background image transition
  useEffect(() => {
    if (imageUrl) {
      // Add a 1-second delay before extracting color
      // This allows the background image to start fading in before colors begin transitioning
      const extractionTimer = setTimeout(() => {
        console.log('Starting color extraction with delay for transition sync');
        extractColor(imageUrl);
      }, 1000); // 1-second delay to coordinate with background fade
      
      return () => clearTimeout(extractionTimer);
    }
  }, [imageUrl, extractColor]);

  return { dominantColor, extractColor, isExtracting };
};

export default useColorExtraction;
