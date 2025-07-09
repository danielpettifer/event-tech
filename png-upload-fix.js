/**
 * PNG Upload Fix
 * 
 * This script patches the application to fix PNG upload issues.
 * Include this script before your application code:
 * 
 * <script src="png-upload-fix.js"></script>
 * <script src="your-app.js"></script>
 * 
 * Version: 1.0.0
 * Date: 2025-07-08
 */

(function() {
  console.log('PNG Upload Fix: Initializing...');
  
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    console.log('PNG Upload Fix: DOM ready, applying fixes...');
    applyFixes();
  });
  
  // Apply fixes immediately if DOM is already loaded
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    console.log('PNG Upload Fix: DOM already ready, applying fixes...');
    applyFixes();
  }
  
  function applyFixes() {
    // Patch FileReader for better PNG handling
    patchFileReader();
    
    // Patch File object prototype to fix PNG MIME types
    patchFilePrototype();
    
    // Add PNG compression utility to window
    addPngCompression();
    
    // Patch ImageUpload component if it exists
    patchImageUploadComponent();
    
    // Patch ItemService if it exists
    patchItemService();
    
    console.log('PNG Upload Fix: All fixes applied successfully!');
  }
  
  function patchFileReader() {
    // Store the original readAsDataURL method
    const originalReadAsDataURL = FileReader.prototype.readAsDataURL;
    
    // Override readAsDataURL to handle PNG files better
    FileReader.prototype.readAsDataURL = function(file) {
      // Check if it's a PNG file with incorrect MIME type
      if (file && file.name && file.name.toLowerCase().endsWith('.png') && file.type !== 'image/png') {
        console.log('PNG Upload Fix: Detected PNG file with incorrect MIME type:', file.type);
        
        // Create a new File object with the correct MIME type
        const correctedFile = new File([file], file.name, { type: 'image/png' });
        
        // Call the original method with the corrected file
        originalReadAsDataURL.call(this, correctedFile);
      } else {
        // Call the original method for non-PNG files
        originalReadAsDataURL.call(this, file);
      }
    };
    
    console.log('PNG Upload Fix: FileReader patched for better PNG handling');
  }
  
  function patchFilePrototype() {
    // Override the type getter for File objects
    try {
      const originalTypeDescriptor = Object.getOwnPropertyDescriptor(File.prototype, 'type');
      
      if (originalTypeDescriptor && originalTypeDescriptor.get) {
        Object.defineProperty(File.prototype, 'type', {
          get: function() {
            const originalType = originalTypeDescriptor.get.call(this);
            
            // Check if it's a PNG file with incorrect MIME type
            if (this.name && this.name.toLowerCase().endsWith('.png') && originalType !== 'image/png') {
              console.log('PNG Upload Fix: Correcting PNG MIME type from', originalType, 'to image/png');
              return 'image/png';
            }
            
            return originalType;
          }
        });
        
        console.log('PNG Upload Fix: File.prototype.type patched for PNG files');
      } else {
        console.log('PNG Upload Fix: Could not patch File.prototype.type (descriptor not found)');
      }
    } catch (error) {
      console.error('PNG Upload Fix: Error patching File.prototype.type:', error);
    }
  }
  
  function addPngCompression() {
    // Add PNG compression utility to window
    window.compressPng = function(dataUrl, quality = 0.8) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Failed to get canvas context'));
              return;
            }
            
            ctx.drawImage(img, 0, 0);
            
            // Get compressed data URL from canvas
            const compressedDataUrl = canvas.toDataURL('image/png', quality);
            
            // Calculate compression stats
            const originalSize = dataUrl.length;
            const compressedSize = compressedDataUrl.length;
            const compressionRatio = (compressedSize / originalSize) * 100;
            
            console.log(`PNG Upload Fix: Compressed PNG from ${(originalSize / 1024 / 1024).toFixed(2)}MB to ${(compressedSize / 1024 / 1024).toFixed(2)}MB (${compressionRatio.toFixed(1)}%)`);
            
            resolve(compressedDataUrl);
          } catch (canvasError) {
            reject(canvasError);
          }
        };
        
        img.onerror = (imgError) => {
          reject(new Error('Failed to load image for compression'));
        };
        
        img.src = dataUrl;
      });
    };
    
    // Add PNG fallback conversion utility to window
    window.pngFallbackConversion = function(file) {
      return new Promise((resolve, reject) => {
        try {
          const objectUrl = URL.createObjectURL(file);
          
          const img = new Image();
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Failed to get canvas context'));
                return;
              }
              
              ctx.drawImage(img, 0, 0);
              
              // Get data URL from canvas with explicit PNG format
              const canvasDataUrl = canvas.toDataURL('image/png');
              URL.revokeObjectURL(objectUrl);
              
              console.log('PNG Upload Fix: Fallback conversion succeeded');
              resolve(canvasDataUrl);
            } catch (canvasError) {
              URL.revokeObjectURL(objectUrl);
              reject(canvasError);
            }
          };
          
          img.onerror = (imgError) => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load image from object URL'));
          };
          
          img.src = objectUrl;
        } catch (error) {
          reject(error);
        }
      });
    };
    
    console.log('PNG Upload Fix: Added PNG compression and fallback conversion utilities');
  }
  
  function patchImageUploadComponent() {
    // Wait for React to be available
    const checkReact = setInterval(() => {
      if (window.React) {
        clearInterval(checkReact);
        console.log('PNG Upload Fix: React detected, waiting for ImageUpload component...');
        
        // Wait for the ImageUpload component to be defined
        const checkComponent = setInterval(() => {
          // Look for the component in various possible locations
          const locations = [
            window.ImageUpload,
            window.Components && window.Components.ImageUpload,
            window.App && window.App.Components && window.App.Components.ImageUpload
          ];
          
          const ImageUpload = locations.find(loc => loc);
          
          if (ImageUpload) {
            clearInterval(checkComponent);
            console.log('PNG Upload Fix: ImageUpload component found, patching...');
            
            // Store the original component
            const OriginalImageUpload = ImageUpload;
            
            // Create a patched version
            const PatchedImageUpload = function(props) {
              const component = OriginalImageUpload(props);
              
              // Patch the fileToDataUrl method if it exists
              if (component.fileToDataUrl) {
                const originalFileToDataUrl = component.fileToDataUrl;
                
                component.fileToDataUrl = function(file) {
                  // Check if it's a PNG file
                  if (file.name.toLowerCase().endsWith('.png')) {
                    console.log('PNG Upload Fix: Enhanced fileToDataUrl for PNG file');
                    
                    return new Promise((resolve, reject) => {
                      originalFileToDataUrl(file).then(dataUrl => {
                        // Fix MIME type if needed
                        if (!dataUrl.startsWith('data:image/png')) {
                          console.log('PNG Upload Fix: Fixing PNG MIME type in data URL');
                          const fixedDataUrl = dataUrl.replace(/^data:.*?;base64,/, 'data:image/png;base64,');
                          resolve(fixedDataUrl);
                        } else {
                          resolve(dataUrl);
                        }
                      }).catch(error => {
                        console.log('PNG Upload Fix: Standard conversion failed, trying fallback...');
                        
                        // Try fallback method
                        window.pngFallbackConversion(file).then(fallbackUrl => {
                          console.log('PNG Upload Fix: Fallback conversion succeeded');
                          resolve(fallbackUrl);
                        }).catch(fallbackError => {
                          reject(fallbackError);
                        });
                      });
                    });
                  }
                  
                  // For non-PNG files, use the original method
                  return originalFileToDataUrl(file);
                };
              }
              
              // Patch the handleFileChange method if it exists
              if (component.handleFileChange) {
                const originalHandleFileChange = component.handleFileChange;
                
                component.handleFileChange = function(event) {
                  // Check if there are files to process
                  const files = event.target.files;
                  if (files && files.length > 0) {
                    console.log('PNG Upload Fix: Enhanced handleFileChange for', files.length, 'files');
                    
                    // Process each file
                    for (let i = 0; i < files.length; i++) {
                      const file = files[i];
                      
                      // Special handling for PNG files
                      if (file.name.toLowerCase().endsWith('.png')) {
                        console.log('PNG Upload Fix: Processing PNG file:', file.name);
                        
                        // Force PNG MIME type if needed
                        if (file.type !== 'image/png') {
                          console.log('PNG Upload Fix: Correcting PNG MIME type from', file.type, 'to image/png');
                          
                          // Use Object.defineProperty to override the type
                          Object.defineProperty(file, 'type', {
                            value: 'image/png',
                            writable: false
                          });
                        }
                      }
                    }
                  }
                  
                  // Call the original method
                  return originalHandleFileChange.call(this, event);
                };
              }
              
              return component;
            };
            
            // Replace the original component with the patched version
            locations.forEach(loc => {
              if (loc) {
                Object.assign(loc, PatchedImageUpload);
              }
            });
            
            console.log('PNG Upload Fix: ImageUpload component patched successfully');
          }
        }, 500);
        
        // Stop checking after 10 seconds
        setTimeout(() => {
          clearInterval(checkComponent);
          console.log('PNG Upload Fix: Timeout waiting for ImageUpload component');
        }, 10000);
      }
    }, 500);
    
    // Stop checking after 10 seconds
    setTimeout(() => {
      clearInterval(checkReact);
      console.log('PNG Upload Fix: Timeout waiting for React');
    }, 10000);
  }
  
  function patchItemService() {
    // Wait for the ItemService to be defined
    const checkService = setInterval(() => {
      // Look for the service in various possible locations
      const locations = [
        window.ItemService,
        window.Services && window.Services.ItemService,
        window.App && window.App.Services && window.App.Services.ItemService
      ];
      
      const ItemService = locations.find(loc => loc);
      
      if (ItemService) {
        clearInterval(checkService);
        console.log('PNG Upload Fix: ItemService found, patching...');
        
        // Patch the saveItem method if it exists
        if (ItemService.saveItem) {
          const originalSaveItem = ItemService.saveItem;
          
          ItemService.saveItem = async function(item) {
            try {
              // Check if we need to compress images
              if (item.images && item.images.length > 0) {
                const compressedImages = [];
                let imagesModified = false;
                
                // Process each image
                for (let i = 0; i < item.images.length; i++) {
                  const imageUrl = item.images[i];
                  
                  // Only process PNG data URLs
                  if (imageUrl.startsWith('data:image/png;base64,')) {
                    // Check if the image is large
                    const sizeInMB = (imageUrl.length * 2) / (1024 * 1024);
                    
                    if (sizeInMB > 1) {
                      console.log(`PNG Upload Fix: Large PNG detected (${sizeInMB.toFixed(2)}MB), compressing...`);
                      try {
                        const compressedUrl = await window.compressPng(imageUrl, 0.8);
                        compressedImages.push(compressedUrl);
                        imagesModified = true;
                        continue;
                      } catch (error) {
                        console.error('PNG Upload Fix: PNG compression failed, using original:', error);
                      }
                    }
                  }
                  
                  // If we didn't compress or compression failed, use original
                  compressedImages.push(imageUrl);
                }
                
                // Update images if any were compressed
                if (imagesModified) {
                  item.images = compressedImages;
                  
                  // Update thumbnail if it was compressed
                  if (item.thumbnailImage && item.thumbnailImage.startsWith('data:image/png;base64,')) {
                    const thumbnailIndex = item.images.findIndex(img => 
                      img.substring(0, 100) === item.thumbnailImage.substring(0, 100));
                    
                    if (thumbnailIndex >= 0) {
                      item.thumbnailImage = item.images[thumbnailIndex];
                    }
                  }
                  
                  console.log('PNG Upload Fix: Compressed PNG images for item:', item.id || 'new item');
                }
              }
              
              // Call the original method
              return originalSaveItem.call(this, item);
            } catch (error) {
              console.error('PNG Upload Fix: Error in patched saveItem:', error);
              return originalSaveItem.call(this, item);
            }
          };
          
          console.log('PNG Upload Fix: ItemService.saveItem patched for PNG compression');
        }
        
        // Add PNG compression method to ItemService if it doesn't exist
        if (!ItemService.compressPng) {
          ItemService.compressPng = window.compressPng;
          console.log('PNG Upload Fix: Added compressPng method to ItemService');
        }
      }
    }, 500);
    
    // Stop checking after 10 seconds
    setTimeout(() => {
      clearInterval(checkService);
      console.log('PNG Upload Fix: Timeout waiting for ItemService');
    }, 10000);
  }
})();
