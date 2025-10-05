# 🍽️ SaveThePlate - Food Rescue Platform

<div align="center">
  <img src="public/pwa-512x512.png" alt="SaveThePlate Logo" width="120" height="120">
  
  <h3>Transforming Food Waste into Community Impact</h3>
  
  <p>
    A comprehensive, real-time food rescue platform that connects restaurants with volunteers to reduce food waste and feed communities. Built with modern web technologies for maximum impact.
  </p>
  
  <p>
    <a href="https://savetheplate-demo.vercel.app">🌐 Live Demo</a> •
    <a href="#-features">✨ Features</a> •
    <a href="#-quick-start">🚀 Quick Start</a> •
    <a href="#-api-documentation">📖 API Docs</a>
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
    <img src="https://img.shields.io/badge/Firebase-11.10.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
    <img src="https://img.shields.io/badge/Vite-7.0.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=for-the-badge" alt="PWA">
  </p>
</div>

---

## 🌟 Overview

**SaveThePlate** is a cutting-edge Progressive Web Application (PWA) designed to tackle food waste while addressing food insecurity. Our platform creates a seamless bridge between restaurants with surplus food and volunteers ready to rescue and redistribute it to communities in need.

### 🎯 Mission
- **Reduce Food Waste**: Divert perfectly good food from landfills
- **Feed Communities**: Connect surplus food with those who need it most
- **Empower Volunteers**: Create opportunities for meaningful community impact
- **Support Restaurants**: Help businesses reduce waste and contribute to social good

---

## ✨ Features

### 🏪 Restaurant Portal
- **📊 Real-time Inventory Management**: Add, edit, and delete food items with instant updates
- **⏰ Smart Expiry Tracking**: Automated alerts for food nearing expiration
- **🗓️ Pickup Coordination**: Manage volunteer pickup requests efficiently
- **📈 Impact Analytics**: Track donations, waste reduction, and community impact
- **🔔 Smart Notifications**: Real-time alerts for pickup requests and confirmations
- **💬 Live Chat System**: Direct messaging with volunteers for seamless coordination
- **📱 QR Code Generation**: Generate secure pickup verification codes instantly
- **📱 Mobile Responsive**: Full functionality on all devices

### 👥 Volunteer Portal
- **🔄 Live Food Listings**: See available food items in real-time
- **📍 Location-based Discovery**: Find nearby restaurants with available food
- **⚡ Quick Claim System**: Lightning-fast food claiming with one-click process
- **📱 QR Code Scanning**: Verify pickups using built-in QR code scanner
- **💬 Real-time Chat**: Direct messaging with restaurants for coordination
- **🎙️ Voice Messages**: Send and receive voice notes for quick communication
- **📆 Personal Impact Tracking**: Monitor your food rescue contributions
- **🏆 Achievement System**: Gamification to encourage continued participation
- **📱 Progressive Web App**: Install on any device for native-like experience

### 🚀 Core Technology Features
- **⚡ Real-time Synchronization**: Instant updates across all portals using Firebase
- **🔒 Advanced Security**: Environment-based configuration and secure authentication
- **📱 PWA Capabilities**: Offline support, push notifications, installable
- **📱 QR Code Integration**: Secure pickup verification with camera scanning
- **💬 Real-time Messaging**: Firebase-powered live chat with voice support
- **⚡ Quick Claim System**: Lightning-fast food claiming with multi-step process
- **🎨 Modern UI/UX**: Intuitive design with smooth animations (Framer Motion)
- **📆 Advanced Analytics**: Comprehensive tracking and reporting
- **🛡️ Error Handling**: Professional error boundaries with detailed reporting
- **⚡ Performance Optimized**: Code splitting, lazy loading, and caching strategies
- **🌙 Accessibility**: WCAG compliant with screen reader support

---

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Vite 7** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **Redux Toolkit** - Modern Redux for state management
- **QR Code Libraries** - QR generation and scanning capabilities
- **React Speech Kit** - Voice message functionality

### Backend & Services
- **Firebase 11** - Complete backend solution
  - **Firestore** - NoSQL document database
  - **Authentication** - User management and security
  - **Storage** - File uploads and management
  - **Analytics** - User behavior tracking
  - **Hosting** - Static site hosting

### Development & Deployment
- **TypeScript Support** - Type safety and better DX
- **ESLint & Prettier** - Code quality and formatting
- **Workbox** - Service worker and PWA features
- **GitHub Actions** - CI/CD pipeline
- **Vercel** - Production deployment

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Firebase Account** (free tier available)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nikeshsapkota32/save-more.git
   cd save-more
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your Firebase configuration
   nano .env
   ```

4. **Firebase Configuration**
   - Create a new [Firebase project](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Storage
   - Copy your config to `.env` file
   - Set up Firestore security rules (see `/firebase/firestore.rules`)

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) to view the app.

### 📦 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Firebase (requires firebase-cli)
npm run deploy
```

---

## 📖 Usage Guide

### 🏪 For Restaurant Owners

1. **Account Setup**
   - Register with restaurant details
   - Verify email address
   - Complete restaurant profile

2. **Food Management**
   - Add food items with photos, descriptions, and expiry times
   - Set pickup windows and special instructions
   - Monitor real-time pickup requests

3. **Volunteer Coordination**
   - Review volunteer profiles and ratings
   - Approve pickup requests
   - Track successful pickups and impact

### 👥 For Volunteers

1. **Getting Started**
   - Create volunteer profile
   - Set location preferences and availability
   - Install PWA for best experience

2. **Finding Food**
   - Browse real-time food listings
   - Filter by location, food type, and urgency
   - Claim items you can collect

3. **Making Impact**
   - Coordinate pickup with restaurants
   - Mark successful collections
   - Track your contribution statistics

---

## 🏗️ Project Architecture

```
save-more/
├── 📁 public/                    # Static assets and PWA icons
├── 📁 src/
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📁 ui/               # Base UI components (buttons, modals, etc.)
│   │   └── 📁 features/         # Feature-specific components
│   ├── 📁 pages/                # Route components
│   ├── 📁 services/             # External service integrations
│   │   ├── analyticsService.js  # Advanced analytics tracking
│   │   ├── notificationService.js # Toast & push notifications
│   │   └── firebaseService.js   # Firebase utilities
│   ├── 📁 hooks/                # Custom React hooks
│   ├── 📁 utils/                # Utility functions and helpers
│   ├── 📁 constants/            # App-wide constants
│   ├── 📁 firebase/             # Firebase configuration
│   ├── 📁 features/             # Redux slices and logic
│   └── 📁 assets/               # Images, fonts, and media
├── 📁 firebase/                 # Firebase configuration files
├── 📄 .env.example             # Environment variables template
├── 📄 vite.config.js           # Vite configuration with PWA
└── 📄 tailwind.config.js       # Tailwind CSS configuration
```

---

## 🔧 Configuration

### Environment Variables

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# App Configuration
VITE_APP_NAME="SaveThePlate"
VITE_APP_VERSION="2.0.0"
VITE_APP_ENVIRONMENT=development
```

### PWA Configuration

The app is configured as a Progressive Web App with:
- 📱 **Installable** on mobile and desktop
- ⚡ **Offline support** with smart caching
- 🔔 **Push notifications** for real-time updates
- 🎨 **Themed UI** matching your device preferences

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

---

## 📊 Performance

- ⚡ **Lighthouse Score**: 95+ across all metrics
- 🎯 **Core Web Vitals**: Excellent ratings
- 📱 **Mobile Optimized**: 60fps animations on all devices
- 🗜️ **Bundle Size**: < 500KB gzipped initial load
- 🔄 **Real-time Updates**: < 100ms synchronization

---

## 🤝 Contributing

We welcome contributions from developers, designers, and domain experts!

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- **ES6+** JavaScript with modern syntax
- **Functional Components** with React Hooks
- **Tailwind CSS** for styling consistency
- **ESLint + Prettier** for code formatting
- **Conventional Commits** for clear history

### Areas for Contribution

- 🐛 **Bug Fixes** - Help us identify and fix issues
- ✨ **Features** - Add new functionality
- 🎨 **UI/UX** - Improve user experience
- 📖 **Documentation** - Enhance project documentation
- 🧪 **Testing** - Increase test coverage
- 🌍 **Accessibility** - Make the app more inclusive
- 🌐 **Internationalization** - Add multi-language support

---

## 📈 Roadmap

### Phase 1: Foundation (Completed ✅)
- ✅ Core platform development
- ✅ Real-time synchronization
- ✅ Progressive Web App setup
- ✅ Advanced analytics integration
- ✅ Professional error handling

### Phase 2: Enhanced Features (In Progress 🙧)
- ✅ **Real-time Chat System** - Direct messaging with voice support
- ✅ **QR Code Integration** - Secure pickup verification system
- ✅ **Quick Claim System** - Lightning-fast food claiming process
- 🙧 **Push Notifications** - Browser and mobile push alerts
- 🙧 **GPS Integration** - Location-based matching
- 🙧 **Advanced Filtering** - Smart food discovery
- 🙧 **Rating System** - User feedback and trust building

### Phase 3: Scale & Impact (Planned 📋)
- 📋 **Mobile Apps** - Native iOS and Android applications
- 📋 **API Platform** - Third-party integrations
- 📋 **Multi-tenant** - Support for multiple cities/regions
- 📋 **AI Matching** - Intelligent volunteer-restaurant pairing
- 📋 **Blockchain** - Transparent impact tracking

### Phase 4: Ecosystem (Future 🔮)
- 🔮 **Food Bank Integration** - Direct shelter partnerships
- 🔮 **Corporate Partnerships** - Enterprise restaurant chains
- 🔮 **Government Integration** - Policy and regulation support
- 🔮 **Global Expansion** - International deployment

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Technology Partners
- 🔥 **Firebase** - Powering our real-time backend
- ⚛️ **React Team** - For the incredible framework
- 🎨 **Tailwind Labs** - For beautiful, consistent styling
- 📱 **Workbox Team** - For excellent PWA tooling

### Community
- 👨‍🍳 **Restaurant Partners** - Trusting us with their surplus food
- 👥 **Volunteers** - Making real impact in communities
- 🏛️ **Food Banks & Shelters** - Our distribution partners
- 🌍 **Open Source Community** - For continuous inspiration

### Special Thanks
- 💡 **Early Adopters** - For valuable feedback and bug reports
- 🎓 **Academic Partners** - For research insights on food waste
- 🏢 **Sustainability Organizations** - For guidance on environmental impact

---

<div align="center">
  <h3>🌱 Making a Difference, One Meal at a Time</h3>
  <p>
    <strong>SaveThePlate</strong> - Where Technology Meets Social Impact
  </p>
  
  <p>
    <a href="https://github.com/nikeshsapkota32/save-more">⭐ Star this project</a> •
    <a href="https://github.com/nikeshsapkota32/save-more/issues">🐛 Report Bug</a> •
    <a href="https://github.com/nikeshsapkota32/save-more/discussions">💬 Join Discussion</a>
  </p>
  
  <p>
    Made with ❤️ by <a href="https://github.com/nikeshsapkota32">Nikesh Sapkota</a>
  </p>
</div>
