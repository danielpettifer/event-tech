# Pages Documentation

This document provides an overview of the application's page structure and how the pages interact with components and services.

## Page Structure

The application is organized into several key pages:

```
src/pages/
├── AdminDashboard.tsx       # Admin control panel
├── AdminDashboard.css
├── AdminLogin.tsx           # Admin authentication
├── AdminLogin.css
├── Settings.tsx             # Application settings
├── Settings.css
├── VisitorLanding.tsx       # Main visitor-facing page
├── VisitorLanding.css
├── VisitorLanding/          # Visitor landing page components
│   ├── index.tsx
│   ├── types.ts
│   ├── VisitorLanding.css
│   ├── README.md
│   ├── components/          # Visitor-specific components
│   └── hooks/               # Visitor page hooks
└── README.md                # This file
```

## Key Pages

### AdminDashboard

The `AdminDashboard` page serves as the control center for gallery administrators. It provides interfaces for:

- Item management
- Client management
- Event management
- Gallery settings
- Analytics and statistics

This page integrates with multiple components including `ItemForm`, `ClientForm`, and `EventForm` to provide a comprehensive management interface.

### VisitorLanding

The `VisitorLanding` page is the main public-facing interface for gallery visitors. It features:

- Event information display
- Item carousel
- Visitor registration
- Background image display with dynamic color extraction
- Admin access via modal

This page uses specialized components in the `VisitorLanding/components/` directory and custom hooks in the `VisitorLanding/hooks/` directory.

### AdminLogin

The `AdminLogin` page provides authentication for administrators, with:

- Login form
- Authentication state management
- Redirect handling

### Settings

The `Settings` page allows administrators to configure application-wide settings:

- Gallery information
- Logo management
- Display preferences
- Storage management

## Page-Component Integration

The pages integrate with components in several ways:

1. **Direct Component Usage**: Pages import and use components directly:
   ```typescript
   import ItemForm from '../components/ItemForm';
   
   // In render function
   <ItemForm
     isOpen={isItemFormOpen}
     onDidDismiss={handleItemFormClose}
     item={selectedItem}
     onSave={handleItemFormSave}
   />
   ```

2. **Service Integration**: Pages use services to manage data:
   ```typescript
   import { ItemService } from '../services/ItemService';
   
   // In component
   const items = ItemService.getAllItems();
   ```

3. **State Management**: Pages manage state that is passed to components:
   ```typescript
   const [selectedItem, setSelectedItem] = useState<Item | null>(null);
   const [isItemFormOpen, setIsItemFormOpen] = useState(false);
   
   const handleEditItem = (item: Item) => {
     setSelectedItem(item);
     setIsItemFormOpen(true);
   };
   ```

## PNG Image Handling in Pages

The pages work with the components to ensure proper PNG file handling:

1. **AdminDashboard**: Integrates with `ItemForm` which uses `ImageUpload` for PNG handling
2. **VisitorLanding**: Uses background images which may be PNG files
3. **Settings**: Provides logo upload functionality which supports PNG files

## Responsive Design

All pages implement responsive design principles:

1. **Flexible Layouts**: Using Ionic Grid system and flexbox
2. **Adaptive Components**: Components adjust to different screen sizes
3. **Mobile-First Approach**: Designed for mobile with progressive enhancement for larger screens

## Best Practices

When working with these pages:

1. **Maintain Separation of Concerns**: 
   - Pages should handle routing, layout, and state management
   - Components should handle UI rendering and user interaction
   - Services should handle data operations

2. **Use Consistent Patterns**: Follow established patterns for:
   - Modal dialogs (isOpen, onDidDismiss, data props)
   - Form handling (controlled components, validation)
   - Error handling (try/catch, user feedback)

3. **Document Page Changes**: Update relevant README files when making significant changes

4. **Test Across Devices**: Ensure pages work well on different screen sizes and devices

## Troubleshooting

If you encounter issues with pages:

1. **Check Component Integration**: Ensure components are receiving the correct props
2. **Verify Service Calls**: Check that service methods are being called correctly
3. **Inspect State Management**: Verify that state is being managed properly
4. **Test Responsive Behavior**: Check behavior across different screen sizes
5. **Review Console Logs**: Look for errors or warnings in the browser console
