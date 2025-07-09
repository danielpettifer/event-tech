# Services Documentation

This document provides detailed information about the service layer of the application, focusing on data management and storage handling.

## Overview

The services layer provides a clean abstraction for data operations, handling storage, retrieval, and manipulation of application data. It includes specialized services for different entity types (Items, Events, Clients, Gallery Settings).

## ItemService

The `ItemService` manages all item-related operations, including storage optimization and handling of image-heavy data.

### Key Features

- CRUD operations for gallery items
- Storage usage monitoring and optimization
- Search and filtering capabilities
- Statistics generation
- Background image management

### Storage Management

The service includes sophisticated storage management to handle image-heavy data:

```typescript
static getStorageUsage(): { 
  used: number; 
  usedMB: number;
  available: number;
  availableMB: number;
  total: number;
  totalMB: number;
  percentUsed: number;
}
```

This method provides detailed information about localStorage usage, which is critical for applications storing image data (especially PNG files which can be large).

### Storage Estimation

Before saving items, the service estimates if the operation would exceed storage limits:

```typescript
static estimateStorageSize(data: string): {
  itemSize: number;
  itemSizeMB: number;
  totalSize: number;
  totalSizeMB: number;
  willExceedQuota: boolean;
  usedMB: number;
  availableMB: number;
}
```

This proactive approach prevents data loss and provides meaningful feedback to users when storage limits are approached.

### Error Handling

The service implements comprehensive error handling for storage operations:

```typescript
// Check if it's a quota exceeded error
if (error instanceof DOMException && (
    error.name === 'QuotaExceededError' || 
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
  return { 
    success: false, 
    error: 'Storage quota exceeded. Please delete some items or reduce image sizes.' 
  };
}
```

This ensures that users receive clear guidance when storage issues occur, particularly with image-heavy operations.

## EventService

The `EventService` manages event data, including:

- CRUD operations for events
- Event status management
- Statistics generation
- Featured events handling

## ClientService

The `ClientService` handles client data with features for:

- Client information management
- Search and filtering
- Statistics and analytics
- Email list management

## GallerySettingsService

The `GallerySettingsService` manages application-wide settings:

- Gallery information
- Active event selection
- UI preferences
- Logo management

## Best Practices for Service Usage

1. **Always check operation results**: Services return detailed result objects that should be checked for success/failure
   ```typescript
   const saveResult = ItemService.saveItem(item);
   if (saveResult.success) {
     // Handle success
   } else {
     // Handle error with saveResult.error
   }
   ```

2. **Monitor storage usage**: For image-heavy operations, check storage usage proactively
   ```typescript
   const storageUsage = ItemService.getStorageUsage();
   if (storageUsage.percentUsed > 70) {
     // Show warning to user
   }
   ```

3. **Handle large images carefully**: When working with PNG files or other large images, consider:
   - Checking file size before processing
   - Offering image compression options
   - Providing clear feedback about storage limitations

4. **Use batch operations when possible**: When making multiple changes, batch them to reduce storage operations
   ```typescript
   // Instead of saving each item individually in a loop
   const updatedItems = items.map(item => /* update logic */);
   localStorage.setItem('gallery_items', JSON.stringify(updatedItems));
   ```

## Troubleshooting

If you encounter storage-related issues:

1. **Check browser storage limits**: Different browsers have different localStorage limits
2. **Monitor image sizes**: Large PNG files can quickly consume available storage
3. **Clear unnecessary data**: Remove unused items or reduce image quality when appropriate
4. **Check for storage errors**: Look for specific error types like `QuotaExceededError`
5. **Use the storage diagnostic tools**: The test-png-upload.html tool can help diagnose storage issues
