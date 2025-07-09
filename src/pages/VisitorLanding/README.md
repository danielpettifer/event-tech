# VisitorLanding Documentation

This document provides detailed information about the VisitorLanding page, its components, and hooks.

## Overview

The VisitorLanding page serves as the main public-facing interface for gallery visitors. It provides an immersive experience with dynamic background images, event information, and an item carousel.

## Directory Structure

```
src/pages/VisitorLanding/
├── index.tsx               # Main entry point
├── types.ts                # Type definitions
├── VisitorLanding.css      # Styles specific to this page
├── components/             # Visitor-specific components
│   ├── AdminLoginModal.tsx # Admin authentication modal
│   ├── EventBanner.tsx     # Event information display
│   ├── EventDefaultImage.tsx # Fallback image component
│   ├── ItemDetailModal.tsx # Item details modal
│   ├── ItemsCarousel.tsx   # Carousel for displaying items
│   └── VisitorForm.tsx     # Visitor registration form
├── hooks/                  # Custom hooks
│   ├── useAdminLogin.ts    # Admin authentication logic
│   ├── useBackgroundImages.ts # Background image management
│   ├── useColorExtraction.ts # Color extraction from images
│   ├── useItemModal.ts     # Item modal state management
│   └── useVisitorLanding.ts # Main page logic
└── README.md               # This file
```

## Key Components

### EventBanner

Displays event information with dynamic styling based on the background image:

- Title and description
- Date and time information
- Location details
- Registration options

### ItemsCarousel

Presents gallery items in an interactive carousel:

- Image display with fallbacks
- Item information
- Detail view access
- Dynamic styling based on extracted colors

### AdminLoginModal

Provides secure access for administrators:

- Login form
- Authentication handling
- Error messaging

## Custom Hooks

### useColorExtraction

This hook extracts dominant and accent colors from background images, enabling dynamic theming:

```typescript
const { dominantColor, textColor, accentColor, isLoading } = useColorExtraction(imageUrl);
```

Key features:
- Analyzes image color palette
- Determines appropriate text colors for readability
- Handles various image formats including PNG
- Provides loading state for asynchronous processing

### useBackgroundImages

Manages background image loading and rotation:

```typescript
const { 
  currentImage, 
  isLoading, 
  nextImage, 
  prevImage 
} = useBackgroundImages(images, interval);
```

Features:
- Preloads images for smooth transitions
- Handles automatic rotation with configurable interval
- Provides manual navigation controls
- Works with various image formats including PNG

### useVisitorLanding

Centralizes the main page logic:

```typescript
const {
  event,
  items,
  isLoading,
  visitorFormOpen,
  handleOpenVisitorForm,
  handleCloseVisitorForm,
  handleSubmitVisitorForm
} = useVisitorLanding();
```

## Image Handling

The VisitorLanding page implements sophisticated image handling:

### Background Images

1. **Loading Strategy**: Images are preloaded to ensure smooth transitions:
   ```typescript
   useEffect(() => {
     const img = new Image();
     img.src = nextImageUrl;
     img.onload = () => setIsNextImageLoaded(true);
   }, [nextImageUrl]);
   ```

2. **Error Handling**: Fallbacks are provided for missing or failed images:
   ```typescript
   {!currentImage && <EventDefaultImage />}
   ```

3. **PNG Support**: The page properly handles PNG images with transparent backgrounds:
   ```css
   .background-image {
     background-size: cover;
     background-position: center;
     background-repeat: no-repeat;
   }
   ```

### Color Extraction

The `useColorExtraction` hook analyzes images to create a cohesive visual experience:

1. **Image Processing**: The hook processes the image data:
   ```typescript
   const canvas = document.createElement('canvas');
   const context = canvas.getContext('2d');
   // Image processing logic
   ```

2. **Color Analysis**: It extracts dominant colors:
   ```typescript
   // Simplified example
   const colorCounts = {};
   for (let i = 0; i < data.length; i += 4) {
     const rgb = `${data[i]},${data[i+1]},${data[i+2]}`;
     colorCounts[rgb] = (colorCounts[rgb] || 0) + 1;
   }
   ```

3. **Contrast Calculation**: It ensures text remains readable:
   ```typescript
   const calculateContrast = (color1, color2) => {
     // Contrast calculation logic
   };
   ```

## Responsive Design

The VisitorLanding page is fully responsive:

1. **Flexible Layout**: Uses CSS Grid and Flexbox:
   ```css
   .visitor-landing {
     display: grid;
     grid-template-rows: auto 1fr auto;
     min-height: 100vh;
   }
   ```

2. **Mobile Adaptations**: Adjusts layout for smaller screens:
   ```css
   @media (max-width: 768px) {
     .event-banner {
       padding: 1rem;
     }
   }
   ```

3. **Touch-Friendly**: Optimized for touch interactions:
   ```css
   .carousel-item {
     touch-action: pan-y;
   }
   ```

## Best Practices

When working with the VisitorLanding page:

1. **Optimize Images**: Background images should be optimized for web:
   - Compress images appropriately
   - Consider using WebP format with PNG fallbacks
   - Maintain aspect ratios

2. **Test Color Extraction**: When adding new background images:
   - Verify that extracted colors provide sufficient contrast
   - Test with both light and dark images
   - Ensure text remains readable

3. **Maintain Performance**: The page uses several performance optimizations:
   - Image preloading
   - Lazy loading for carousel items
   - Throttled color extraction
   - Efficient DOM updates

4. **Accessibility**: The page implements accessibility features:
   - Sufficient color contrast
   - Keyboard navigation
   - Screen reader support
   - Focus management

## Troubleshooting

If you encounter issues with the VisitorLanding page:

1. **Image Display Problems**:
   - Check image URLs and formats
   - Verify that images are properly loaded
   - Test with the PNG upload test tool

2. **Color Extraction Issues**:
   - Check browser console for errors
   - Verify that images are CORS-compliant
   - Test with different image types

3. **Performance Concerns**:
   - Optimize image sizes
   - Reduce the number of items in the carousel
   - Check for memory leaks in useEffect cleanup
