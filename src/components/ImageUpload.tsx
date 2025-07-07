import React, { useState, useRef } from 'react';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonToast,
  IonProgressBar,
  IonCheckbox,
  IonBadge
} from '@ionic/react';
import { cloudUpload, image, trash, link, checkmark, star } from 'ionicons/icons';

interface ImageUploadProps {
  value?: string;
  onImageChange: (imageUrl: string) => void;
  images?: string[];
  onImagesChange?: (images: string[]) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  showPreview?: boolean;
  previewHeight?: string;
  allowMultiple?: boolean;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value = '',
  onImageChange,
  images = [],
  onImagesChange,
  label = 'Image',
  placeholder = 'Enter image URL or upload file',
  required = false,
  maxSizeMB = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  showPreview = true,
  previewHeight = '200px',
  allowMultiple = false,
  maxImages = 10
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [inputMode, setInputMode] = useState<'url' | 'upload'>('url');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const filesToProcess = allowMultiple ? Array.from(files) : [files[0]];
    
    // Check if adding these files would exceed the limit
    if (allowMultiple && images.length + filesToProcess.length > maxImages) {
      setToastMessage(`Cannot upload more than ${maxImages} images`);
      setShowToast(true);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const newImages: string[] = [];
      
      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        
        console.log('Processing file:', file.name, 'type:', file.type, 'size:', file.size);
        
        // Validate file type - be more lenient with types
        const isAcceptedType = acceptedTypes.some(type => {
          // Check if file type matches directly or by category (e.g., image/*)
          if (file.type === type) return true;
          if (type.endsWith('*') && file.type.startsWith(type.replace('*', ''))) return true;
          return false;
        });
        
        if (!isAcceptedType) {
          console.warn(`File type ${file.type} not in accepted types:`, acceptedTypes);
          setToastMessage(`Please select valid image files (${acceptedTypes.join(', ')})`);
          setShowToast(true);
          continue;
        }

        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
          setToastMessage(`File "${file.name}" is too large. Max size: ${maxSizeMB}MB`);
          setShowToast(true);
          continue;
        }

        // Convert file to data URL
        try {
          const dataUrl = await fileToDataUrl(file);
          console.log('File converted to data URL successfully');
          newImages.push(dataUrl);
        } catch (fileError) {
          console.error('Error converting file to data URL:', fileError);
          setToastMessage(`Error processing file "${file.name}". Please try again.`);
          setShowToast(true);
          continue;
        }
        
        // Update progress
        setUploadProgress(((i + 1) / filesToProcess.length) * 90);
      }

      // Complete the upload
      setTimeout(() => {
        setUploadProgress(100);
        
        if (newImages.length === 0) {
          setIsUploading(false);
          setToastMessage('No valid images were uploaded. Please try again.');
          setShowToast(true);
          return;
        }
        
        console.log('Processed images:', newImages);
        
        if (allowMultiple && onImagesChange) {
          const updatedImages = [...images, ...newImages];
          onImagesChange(updatedImages);
          
          // If no primary image is set and we have images, set the first one
          if (!value && updatedImages.length > 0) {
            onImageChange(updatedImages[0]);
          }
        } else if (newImages.length > 0) {
          onImageChange(newImages[0]);
        }
        
        setIsUploading(false);
        setToastMessage(`${newImages.length} image(s) uploaded successfully!`);
        setShowToast(true);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 500);

    } catch (error) {
      console.error('Error in file upload process:', error);
      setIsUploading(false);
      setUploadProgress(0);
      setToastMessage('Failed to upload images. Please try again.');
      setShowToast(true);
    }
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleUrlAdd = () => {
    if (!urlInput.trim()) return;
    
    if (allowMultiple && onImagesChange) {
      if (images.length >= maxImages) {
        setToastMessage(`Cannot add more than ${maxImages} images`);
        setShowToast(true);
        return;
      }
      
      if (images.includes(urlInput.trim())) {
        setToastMessage('This image URL is already added');
        setShowToast(true);
        return;
      }
      
      const updatedImages = [...images, urlInput.trim()];
      onImagesChange(updatedImages);
      
      // If no primary image is set, set this as primary
      if (!value) {
        onImageChange(urlInput.trim());
      }
    } else {
      onImageChange(urlInput.trim());
    }
    
    setUrlInput('');
    setToastMessage('Image URL added successfully!');
    setShowToast(true);
  };

  const handleRemoveImage = (imageUrl: string) => {
    if (allowMultiple && onImagesChange) {
      const updatedImages = images.filter(img => img !== imageUrl);
      onImagesChange(updatedImages);
      
      // If we removed the primary image, set a new one or clear it
      if (value === imageUrl) {
        onImageChange(updatedImages.length > 0 ? updatedImages[0] : '');
      }
    } else {
      onImageChange('');
    }
  };

  const handleSetAsPrimary = (imageUrl: string) => {
    onImageChange(imageUrl);
    setToastMessage('Primary image updated!');
    setShowToast(true);
  };

  const isValidImageUrl = (url: string) => {
    return url && (url.startsWith('http') || url.startsWith('data:image/'));
  };

  const allImages = allowMultiple ? images : (value ? [value] : []);

  return (
    <div>
      <IonGrid>
        <IonRow>
          <IonCol size="12">
            <div style={{ marginBottom: '12px' }}>
              <IonLabel>
                <strong>{label}{required && ' *'}</strong>
                {allowMultiple && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--ion-color-medium)', marginLeft: '8px' }}>
                    ({allImages.length}/{maxImages} images)
                  </span>
                )}
              </IonLabel>
            </div>
          </IonCol>
        </IonRow>

        {/* Mode Toggle Buttons */}
        <IonRow>
          <IonCol size="6">
            <IonButton
              expand="block"
              fill={inputMode === 'url' ? 'solid' : 'outline'}
              size="small"
              onClick={() => setInputMode('url')}
            >
              <IonIcon icon={link} slot="start" />
              URL
            </IonButton>
          </IonCol>
          <IonCol size="6">
            <IonButton
              expand="block"
              fill={inputMode === 'upload' ? 'solid' : 'outline'}
              size="small"
              onClick={() => setInputMode('upload')}
            >
              <IonIcon icon={cloudUpload} slot="start" />
              Upload
            </IonButton>
          </IonCol>
        </IonRow>

        {/* URL Input Mode */}
        {inputMode === 'url' && (
          <IonRow>
            <IonCol size="12">
              <div style={{ display: 'flex', gap: '8px', alignItems: 'end' }}>
                <IonItem style={{ flex: 1 }}>
                  <IonLabel position="stacked">Image URL</IonLabel>
                  <IonInput
                    value={urlInput}
                    onIonInput={(e) => setUrlInput(e.detail.value!)}
                    placeholder={placeholder}
                  />
                </IonItem>
                <IonButton 
                  onClick={handleUrlAdd} 
                  disabled={!urlInput.trim() || (allowMultiple && images.length >= maxImages)}
                >
                  Add
                </IonButton>
              </div>
            </IonCol>
          </IonRow>
        )}

        {/* Upload Mode */}
        {inputMode === 'upload' && (
          <IonRow>
            <IonCol size="12">
              <IonButton
                expand="block"
                fill="outline"
                onClick={handleFileSelect}
                disabled={isUploading || (allowMultiple && images.length >= maxImages)}
              >
                <IonIcon icon={image} slot="start" />
                {isUploading ? 'Uploading...' : `Choose Image File${allowMultiple ? 's' : ''}`}
              </IonButton>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedTypes.join(',')}
                multiple={allowMultiple}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              
              {/* Upload Progress */}
              {isUploading && (
                <div style={{ marginTop: '12px' }}>
                  <IonProgressBar value={uploadProgress / 100} />
                  <p style={{ textAlign: 'center', fontSize: '0.8rem', margin: '4px 0' }}>
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
              
              {/* File size and type info */}
              <p style={{ fontSize: '0.8rem', color: 'var(--ion-color-medium)', margin: '8px 0 0 0', textAlign: 'center' }}>
                Max size: {maxSizeMB}MB • Supported: JPG, PNG, GIF, WebP
                {allowMultiple && ` • Max ${maxImages} images`}
              </p>
            </IonCol>
          </IonRow>
        )}

        {/* Images Display */}
        {allImages.length > 0 && (
          <IonRow>
            <IonCol size="12">
              <div style={{ marginTop: '16px' }}>
                <IonLabel>
                  <strong>
                    {allowMultiple ? 'Uploaded Images:' : 'Current Image:'}
                    {allowMultiple && value && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--ion-color-primary)', marginLeft: '8px' }}>
                        (Primary image selected)
                      </span>
                    )}
                  </strong>
                </IonLabel>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: allowMultiple ? 'repeat(auto-fill, minmax(150px, 1fr))' : '1fr',
                  gap: '12px', 
                  marginTop: '12px' 
                }}>
                  {allImages.map((imageUrl, index) => (
                    <IonCard key={index} style={{ margin: '0', position: 'relative' }}>
                      <IonCardContent style={{ padding: '0', position: 'relative' }}>
                        {/* Primary Image Badge */}
                        {allowMultiple && value === imageUrl && (
                          <IonBadge 
                            color="primary" 
                            style={{ 
                              position: 'absolute', 
                              top: '8px', 
                              left: '8px', 
                              zIndex: 10,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <IonIcon icon={star} style={{ fontSize: '12px' }} />
                            Primary
                          </IonBadge>
                        )}
                        
                        {/* Delete Button */}
                        <IonButton
                          fill="clear"
                          size="small"
                          color="danger"
                          onClick={() => handleRemoveImage(imageUrl)}
                          style={{ 
                            position: 'absolute', 
                            top: '4px', 
                            right: '4px', 
                            zIndex: 10,
                            '--padding-start': '8px',
                            '--padding-end': '8px'
                          }}
                        >
                          <IonIcon icon={trash} style={{ fontSize: '16px' }} />
                        </IonButton>
                        
                        {showPreview && (
                          <img
                            src={imageUrl}
                            alt={`Image ${index + 1}`}
                            style={{
                              width: '100%',
                              height: allowMultiple ? '120px' : previewHeight,
                              objectFit: 'cover',
                              borderRadius: '8px',
                              cursor: allowMultiple ? 'pointer' : 'default'
                            }}
                            onClick={() => {
                              if (allowMultiple && value !== imageUrl) {
                                handleSetAsPrimary(imageUrl);
                              }
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        )}
                        
                        {/* Set as Primary Button for Multiple Images */}
                        {allowMultiple && value !== imageUrl && (
                          <div style={{ padding: '8px', textAlign: 'center' }}>
                            <IonButton
                              size="small"
                              fill="outline"
                              onClick={() => handleSetAsPrimary(imageUrl)}
                            >
                              <IonIcon icon={star} slot="start" />
                              Set as Primary
                            </IonButton>
                          </div>
                        )}
                        
                        {/* URL Reference */}
                        <p style={{ 
                          fontSize: '0.6rem', 
                          color: 'var(--ion-color-medium)', 
                          wordBreak: 'break-all',
                          margin: '4px 8px 8px 8px',
                          textAlign: 'center'
                        }}>
                          {imageUrl.length > 50 ? `${imageUrl.substring(0, 50)}...` : imageUrl}
                        </p>
                      </IonCardContent>
                    </IonCard>
                  ))}
                </div>
              </div>
            </IonCol>
          </IonRow>
        )}
      </IonGrid>

      {/* Toast for notifications */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="top"
      />
    </div>
  );
};

export default ImageUpload;
