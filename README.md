# SaveThePlate - Food Rescue Platform

A real-time food rescue platform connecting restaurants with volunteers to reduce food waste and feed communities.

## 🚀 Features

### Restaurant Portal
- **Real-time Food Management**: Add, edit, and delete food items with automatic updates
- **Inventory Tracking**: Monitor food items with expiry dates and status
- **Pickup Scheduling**: View and manage volunteer pickup requests
- **Analytics Dashboard**: Track donations and impact metrics

### Volunteer Portal
- **Real-time Available Pickups**: See food items available for pickup instantly
- **Schedule Pickups**: Request to pick up food items from restaurants
- **Activity Tracking**: Monitor your food rescue activities and impact
- **Status Updates**: Real-time updates when food items are added or claimed

### Core Features
- **Real-time Synchronization**: Changes in restaurant portal immediately appear in volunteer portal
- **Firebase Integration**: Secure, scalable backend with real-time listeners
- **Redux State Management**: Centralized state management for consistent data flow
- **Responsive Design**: Modern UI that works on all devices
- **Toast Notifications**: User-friendly feedback for all actions

## 🛠️ Technical Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **State Management**: Redux Toolkit
- **Backend**: Firebase (Firestore, Storage, Auth)
- **Real-time Updates**: Firebase Firestore listeners
- **UI Components**: Framer Motion, React Icons
- **Notifications**: React Hot Toast

## 🔧 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd save-more
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project
   - Enable Firestore, Storage, and Authentication
   - Update `src/firebase/config.js` with your Firebase config

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📱 Usage

### For Restaurant Owners
1. Login as "Restaurant Owner"
2. Add food items with details (name, category, quantity, expiry date)
3. Monitor pickup requests from volunteers
4. Track your food donation impact

### For Volunteers
1. Login as "Volunteer"
2. Browse available food items from restaurants
3. Schedule pickups for items you want to rescue
4. Track your rescue activities and impact

## 🔄 Real-time Features

- **Instant Updates**: When a restaurant adds food, it immediately appears in volunteer portal
- **Status Changes**: Food item status updates (available → pending → claimed) are synchronized
- **Live Notifications**: Toast notifications for all actions
- **Real-time Listeners**: Firebase Firestore listeners ensure data consistency

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
├── features/           # Redux slices and async thunks
│   ├── auth/          # Authentication state management
│   └── food/          # Food listings state management
├── firebase/          # Firebase configuration and functions
├── pages/             # Main application pages
├── app/               # Redux store configuration
└── context/           # React context providers
```

## 🚀 Recent Improvements

### Connected Portals
- ✅ Real-time synchronization between restaurant and volunteer portals
- ✅ Firebase Firestore integration for persistent data storage
- ✅ Redux state management for consistent data flow
- ✅ Real-time listeners for instant updates

### Enhanced User Experience
- ✅ Toast notifications for user feedback
- ✅ Loading states and error handling
- ✅ Responsive design improvements
- ✅ Better form validation

### Code Quality
- ✅ Removed unused components and files
- ✅ Improved code organization
- ✅ Better error handling
- ✅ Type-safe Firebase operations

## 🔮 Future Enhancements

- [ ] Push notifications for new food items
- [ ] GPS tracking for pickup coordination
- [ ] Advanced analytics and reporting
- [ ] Mobile app development
- [ ] Integration with food banks and shelters
- [ ] QR code scanning for quick pickups
- [ ] Rating and review system
- [ ] Automated expiry notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Firebase for the robust backend infrastructure
- React community for the excellent ecosystem
- All volunteers and restaurant owners making a difference
