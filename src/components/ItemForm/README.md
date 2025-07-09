# ItemForm Component

This document provides detailed information about the ItemForm component, which is used for adding and editing items in the gallery management system.

## Overview

The ItemForm component is a comprehensive form for managing artwork and gallery items. It provides a rich interface for entering detailed information about each piece, including images, pricing, classification, and more.

## Features

- Complete item information management
- Image upload and management with PNG support
- Validation for required fields
- Storage usage monitoring
- Comprehensive error handling
- Multi-section organization for better UX

## PNG Image Handling

The ItemForm component integrates with the ImageUpload component to handle PNG files properly. This ensures that PNG images are correctly processed regardless of MIME type inconsistencies that can occur across different browsers and operating systems.

### Common PNG Upload Issues Addressed

1. **MIME Type Detection**: The component handles PNG files with various MIME types, not just the standard "image/png".
2. **Storage Optimization**: Large PNG files are detected and users are warned about potential storage limitations.
3. **Preview Generation**: Reliable preview generation for PNG files regardless of their reported MIME type.

## Usage

```jsx
<ItemForm
  isOpen={isItemFormOpen}
  onDidDismiss={handleItemFormClose}
  item={selectedItem}
  onSave={handleItemFormSave}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| isOpen | boolean | Controls whether the modal is open |
| onDidDismiss | function | Callback when the modal is dismissed |
| item | Item \| null | Item to edit (null for new items) |
| onSave | function | Callback when an item is saved |

## Form Sections

The form is organized into logical sections for better user experience:

1. **Basic Information**: Title, artist, medium, dimensions, year, description
2. **Classification**: Category, style
3. **Pricing and Status**: Price, currency, status, estimated value, insurance value
4. **Images**: Upload and management of item images
5. **Tags**: Keywords and search terms
6. **Settings**: Visibility, featured status, framing, certification
7. **Additional Information**: Location, condition, signature, notes

## Storage Handling

The component monitors storage usage and provides warnings when approaching limits:

```typescript
// Check storage usage before saving
const storageUsage = ItemService.getStorageUsage();
if (storageUsage.percentUsed > 80) {
  console.warn('Storage usage is high:', storageUsage.percentUsed.toFixed(2) + '%');
}
```

## Error Handling

The component includes comprehensive error handling for various scenarios:

1. **Validation Errors**: Required fields are checked before submission
2. **Storage Errors**: Warnings when storage limits are approached
3. **Save Failures**: Detailed error messages when items cannot be saved

## Best Practices

When using or modifying the ItemForm component:

1. **Maintain Required Fields**: Title, artist, and medium are required fields and should remain so
2. **Preserve Image Handling**: The integration with ImageUpload is critical for proper image management
3. **Consider Storage Implications**: Be mindful of localStorage limits, especially with multiple images
4. **Test Thoroughly**: Changes should be tested with various item types and edge cases
5. **Maintain Section Organization**: The logical grouping of fields helps users navigate the form

## Troubleshooting

If issues occur with the ItemForm:

1. **Check Console Logs**: The component logs detailed information about validation and storage
2. **Verify Storage Usage**: Use the Storage Info button in error dialogs to check current usage
3. **Test Image Uploads**: Use the test-png-upload.html tool to diagnose image-related issues
4. **Check Required Fields**: Ensure all required fields have values
5. **Verify Item Service**: Ensure the ItemService is properly initialized and functioning
