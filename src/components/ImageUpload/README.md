# ImageUpload Component

A versatile image upload component for handling various image formats, with special enhancements for PNG files.

## Features

- Supports multiple image formats (JPEG, PNG, GIF, WebP)
- Handles both URL and file uploads
- Supports single or multiple image uploads
- Provides image preview
- Handles storage quota management
- **Enhanced PNG handling** to fix upload issues

## PNG Upload Fix

This component includes special handling for PNG files to address common upload issues:

1. **MIME Type Correction**: Forces the correct MIME type for PNG files
2. **Data URL Conversion**: Ensures proper conversion of PNG files to data URLs
3. **Fallback Conversion**: Uses canvas-based fallback when standard conversion fails
4. **Image Compression**: Compresses large PNG files to reduce storage requirements

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | '' | Current image URL value |
| onImageChange | function | required | Callback when image changes |
| images | string[] | [] | Array of image URLs (for multiple mode) |
| onImagesChange | function | - | Callback when images array changes |
| label | string | 'Image' | Label for the upload field |
| placeholder | string | 'Enter image URL or upload file' | Placeholder for URL input |
| required | boolean | false | Whether the field is required |
| maxSizeMB | number | 5 | Maximum file size in MB |
| acceptedTypes | string[] | ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] | Accepted MIME types |
| showPreview | boolean | true | Whether to show image previews |
| previewHeight | string | '200px' | Height for image preview |
| allowMultiple | boolean | false | Allow multiple image uploads |
| maxImages | number | 10 | Maximum number of images (when multiple) |

## Usage

```tsx
import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';

const MyComponent = () => {
  const [imageUrl, setImageUrl] = useState('');
  
  return (
    <div>
      <h2>Upload Image</h2>
      <ImageUpload
        value={imageUrl}
        onImageChange={setImageUrl}
        label="Product Image"
        required={true}
      />
      
      {imageUrl && (
        <div>
          <h3>Selected Image:</h3>
          <img src={imageUrl} alt="Selected" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default MyComponent;
```

## Multiple Image Upload

```tsx
import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';

const GalleryUpload = () => {
  const [images, setImages] = useState<string[]>([]);
  const [primaryImage, setPrimaryImage] = useState('');
  
  return (
    <div>
      <h2>Gallery Upload</h2>
      <ImageUpload
        value={primaryImage}
        onImageChange={setPrimaryImage}
        images={images}
        onImagesChange={setImages}
        label="Gallery Images"
        allowMultiple={true}
        maxImages={5}
      />
      
      {images.length > 0 && (
        <div>
          <h3>Gallery Preview:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {images.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt={`Gallery ${index}`} 
                style={{ 
                  width: '150px', 
                  height: '150px',
                  objectFit: 'cover',
                  border: img === primaryImage ? '2px solid blue' : 'none'
                }} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryUpload;
```

## PNG Upload Fix Implementation

The component includes several enhancements to fix PNG upload issues:

### 1. MIME Type Correction

```typescript
// Force PNG MIME type if needed
if (isPNG && file.type !== 'image/png') {
  console.log('Correcting PNG MIME type from', file.type, 'to image/png');
  Object.defineProperty(file, 'type', {
    value: 'image/png',
    writable: false
  });
}
```

### 2. Enhanced Data URL Conversion

```typescript
// Fix MIME type if needed for PNG files
if (file.name.toLowerCase().endsWith('.png') && !reader.result.startsWith('data:image/png')) {
  console.log('Fixing PNG MIME type in data URL');
  const fixedDataUrl = reader.result.replace(/^data:.*?;base64,/, 'data:image/png;base64,');
  resolve(fixedDataUrl);
}
```

### 3. Fallback Conversion Method

Uses canvas-based conversion as a fallback when standard FileReader fails:

```typescript
// Try fallback method for PNG files
if (isPNG) {
  try {
    console.log('Attempting fallback conversion method for PNG');
    const fallbackUrl = await pngFallbackConversion(file);
    newImages.push(fallbackUrl);
    // ...
  } catch (fallbackError) {
    console.error('Fallback PNG conversion also failed:', fallbackError);
  }
}
```

### 4. PNG Compression

Compresses large PNG files to reduce storage requirements:

```typescript
// Compress large PNG images
if (isPNG && dataUrlSizeMB > 1) {
  console.log(`Large PNG detected (${dataUrlSizeMB.toFixed(2)}MB), compressing...`);
  try {
    const compressedUrl = await compressPng(dataUrl);
    // ...
  } catch (compressionError) {
    console.error('PNG compression failed, using original:', compressionError);
  }
}
