# Components Documentation

This document provides an overview of the component architecture and how the various components work together in the application.

## Component Structure

The application uses a modular component structure with specialized components for different parts of the UI:

```
src/components/
├── index.ts                 # Re-exports all components
├── ClientForm/              # Client management form
├── EventForm/               # Event management form
├── ExploreContainer/        # Container for exploration views
├── ImageUpload/             # Image upload component with PNG support
│   ├── ImageUpload.tsx
│   ├── index.ts
│   └── README.md
├── ItemForm/                # Item management form
│   ├── ItemForm.tsx
│   ├── index.ts
│   └── README.md
└── README.md                # This file
```

## Key Components

### ImageUpload

The `ImageUpload` component handles file uploads with special consideration for PNG files. It provides a robust solution for image management, including:

- Multiple image upload support
- PNG file handling regardless of MIME type
- Storage usage monitoring
- Preview generation
- Error handling

See the [ImageUpload README](./ImageUpload/README.md) for detailed documentation.

### ItemForm

The `ItemForm` component provides a comprehensive interface for managing gallery items. It integrates with the `ImageUpload` component to handle image management and includes:

- Complete item information management
- Multi-section organization
- Validation
- Storage monitoring
- Error handling

See the [ItemForm README](./ItemForm/README.md) for detailed documentation.

### ClientForm

The `ClientForm` component manages client information, including:

- Contact details
- Preferences
- Categories and interests
- Communication settings

### EventForm

The `EventForm` component handles event creation and editing, with features for:

- Event details and scheduling
- Featured artists and artworks
- Background image management
- Visibility settings

### ExploreContainer

The `ExploreContainer` component provides a flexible container for exploration views, used in various parts of the application.

## Component Integration

The components are designed to work together seamlessly:

1. **Admin Dashboard Integration**: Components like `ItemForm`, `ClientForm`, and `EventForm` are integrated into the `AdminDashboard` page.

2. **Visitor Landing Integration**: Components like `ExploreContainer` and specialized visitor components are used in the `VisitorLanding` page.

3. **Service Layer Integration**: All components interact with the service layer for data operations, ensuring consistent data handling.

## PNG File Handling

A key feature of the component architecture is robust PNG file handling:

1. **Detection**: PNG files are detected by extension, not just MIME type:
   ```typescript
   const isPNG = file.name.toLowerCase().endsWith('.png');
   ```

2. **Storage Optimization**: Large PNG files are detected and users are warned about potential storage limitations:
   ```typescript
   if (storageUsage.percentUsed > 80 && totalFileSizeMB > 1) {
     setStorageWarningMessage(
       `Warning: Your storage is ${storageUsage.percentUsed.toFixed(0)}% full...`
     );
   }
   ```

3. **Testing Tools**: The application includes a dedicated testing tool (`test-png-upload.html`) for diagnosing PNG upload issues.

## Best Practices

When working with these components:

1. **Use the index exports**: Import components from the main index file:
   ```typescript
   import { ImageUpload, ItemForm } from '../components';
   ```

2. **Check operation results**: Components that interact with services return detailed result objects that should be checked for success/failure.

3. **Handle large images carefully**: When working with PNG files or other large images, use the built-in storage monitoring features.

4. **Maintain component structure**: Keep the modular structure with separate directories for complex components.

5. **Document component changes**: Update the relevant README files when making significant changes to components.

## Troubleshooting

If you encounter issues with components:

1. **Check console logs**: Components log detailed information about operations.
2. **Verify service integration**: Ensure the components are correctly integrated with the service layer.
3. **Test image uploads**: Use the test-png-upload.html tool to diagnose image-related issues.
4. **Check storage usage**: Use the ItemService.getStorageUsage() method to check current storage status.
5. **Verify component props**: Ensure all required props are being passed correctly.
