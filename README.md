# Gallery Management System

A comprehensive gallery management system built with Ionic React, featuring both visitor-facing interfaces and admin management capabilities.

## 🎨 Features

### Visitor Interface
- **Beautiful Landing Page**: Animated gradient background with slow zoom effects
- **Gallery Display**: Interactive cards showing artwork with images, titles, artists, and pricing
- **Item Details**: Modal popups with comprehensive artwork information
- **Visitor Form**: Contact form for visitor engagement and inquiries
- **Responsive Design**: Mobile-first approach that works on all devices

### Admin Interface
- **Secure Authentication**: Login system with demo credentials
- **Professional Dashboard**: Statistics overview with visitor, client, and item counts
- **Split Pane Layout**: Professional sidebar navigation with company branding
- **Recent Visitors**: Track and manage visitor interactions
- **Multi-Section Navigation**: Dashboard, Events, Clients, Items, and Settings
- **Account Management**: User profile and logout functionality

## 🚀 Technology Stack

- **Framework**: Ionic React with TypeScript
- **Routing**: React Router for navigation
- **Styling**: CSS with Ionic design system
- **State Management**: React Hooks
- **Authentication**: localStorage-based session management
- **Build Tool**: Vite
- **Testing**: Cypress for E2E testing

## 📱 Screenshots

### Visitor Landing Page
- Animated background with gallery items
- Interactive visitor form
- Responsive card layout

### Admin Dashboard
- Professional statistics overview
- Recent visitors tracking
- Split-pane navigation

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/danielpettifer/event-tech.git
   cd event-tech
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Visitor Interface: `http://localhost:5173/`
   - Admin Login: `http://localhost:5173/admin/login`

## 🔐 Demo Credentials

For testing the admin interface:
- **Email**: admin@gallery.com
- **Password**: admin123

## 📁 Project Structure

```
src/
├── pages/
│   ├── VisitorLanding.tsx/css    # Main visitor interface
│   ├── AdminLogin.tsx/css        # Authentication page
│   └── AdminDashboard.tsx/css    # Admin management interface
├── components/
│   └── ExploreContainer.tsx      # Reusable components
├── theme/
│   └── variables.css             # Ionic theme customization
└── App.tsx                       # Main routing configuration
```

## 🎯 Key Components

### VisitorLanding
- Animated background with CSS keyframes
- Gallery item display with modal interactions
- Visitor form with validation
- Responsive grid layout

### AdminDashboard
- IonSplitPane for professional layout
- Statistics cards with icons
- Recent visitors list
- Navigation menu with routing

### AdminLogin
- Secure authentication form
- Professional styling with animations
- Demo credentials display
- Error handling

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test.e2e` - Run Cypress E2E tests
- `npm run test.unit` - Run unit tests
- `npm run lint` - Run ESLint

## 🌟 Features in Development

- [ ] Real backend integration
- [ ] Database connectivity
- [ ] Image upload functionality
- [ ] Event management system
- [ ] Client relationship management
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Multi-language support

## 🎨 Design Features

- **Glass Morphism**: Backdrop blur effects throughout
- **Smooth Animations**: CSS transitions and keyframe animations
- **Professional Color Scheme**: Ionic's design system integration
- **Responsive Typography**: Scalable text across devices
- **Interactive Elements**: Hover effects and button animations

## 📱 Mobile Support

The application is built with a mobile-first approach and includes:
- Touch-friendly interface elements
- Responsive breakpoints
- Optimized performance for mobile devices
- Native-like user experience through Ionic

## 🔒 Security Features

- Authentication state management
- Protected admin routes
- Session persistence
- Secure logout functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Daniel Pettifer**
- GitHub: [@danielpettifer](https://github.com/danielpettifer)

## 🙏 Acknowledgments

- Ionic Framework for the excellent React components
- React team for the powerful framework
- Vite for the fast build tool
- The open-source community for inspiration and tools

---

Built with ❤️ using Ionic React and TypeScript
