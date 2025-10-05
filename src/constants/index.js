// src/constants/index.js

// Application Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'SaveThePlate',
  VERSION: import.meta.env.VITE_APP_VERSION || '2.0.0',
  ENVIRONMENT: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  DESCRIPTION: 'A real-time food rescue platform connecting restaurants with volunteers to reduce food waste and feed communities.',
  KEYWORDS: ['food rescue', 'sustainability', 'community', 'restaurant', 'volunteer', 'food waste reduction']
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  FOOD: '/food',
  ADD_FOOD: '/food/add',
  ANALYTICS: '/analytics',
  VOLUNTEERS: '/volunteers',
  RESTAURANT: '/restaurant',
  VOLUNTEER: '/volunteer',
  ABOUT: '/about',
  HOW_IT_WORKS: '/how-it-works',
  TESTIMONIALS: '/testimonials'
};

// User Roles
export const USER_ROLES = {
  RESTAURANT_OWNER: 'restaurant_owner',
  VOLUNTEER: 'volunteer',
  ADMIN: 'admin'
};

// Food Categories
export const FOOD_CATEGORIES = {
  VEGETABLES: 'vegetables',
  FRUITS: 'fruits',
  DAIRY: 'dairy',
  MEAT: 'meat',
  GRAINS: 'grains',
  PREPARED: 'prepared',
  BEVERAGES: 'beverages',
  OTHER: 'other'
};

// Food Status
export const FOOD_STATUS = {
  AVAILABLE: 'available',
  PENDING: 'pending',
  CLAIMED: 'claimed',
  COMPLETED: 'completed',
  EXPIRED: 'expired'
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'savetheplate_user',
  THEME: 'savetheplate_theme',
  PREFERENCES: 'savetheplate_preferences',
  RECENT_SEARCHES: 'savetheplate_recent_searches'
};

// Theme Configuration
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Breakpoints (Tailwind CSS)
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
};

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000
};

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 second
};

// Firebase Collections
export const COLLECTIONS = {
  USERS: 'users',
  FOOD_ITEMS: 'food-items',
  RESTAURANTS: 'restaurants',
  VOLUNTEERS: 'volunteers',
  PICKUP_REQUESTS: 'pickup-requests',
  ANALYTICS: 'analytics',
  NOTIFICATIONS: 'notifications'
};

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  EMAIL_REGEX: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
  INVALID_FILE_TYPE: 'Please select a valid file type.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  FOOD_ADDED: 'Food item added successfully!',
  FOOD_UPDATED: 'Food item updated successfully!',
  FOOD_DELETED: 'Food item deleted successfully!',
  PICKUP_REQUESTED: 'Pickup request sent successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  LOGOUT: 'Logged out successfully!',
  LOGIN: 'Welcome back!',
  REGISTER: 'Account created successfully!'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: 'yyyy-MM-dd HH:mm:ss'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100]
};

export default {
  APP_CONFIG,
  ROUTES,
  USER_ROLES,
  FOOD_CATEGORIES,
  FOOD_STATUS,
  PRIORITY_LEVELS,
  STORAGE_KEYS,
  THEME,
  BREAKPOINTS,
  ANIMATION,
  API_CONFIG,
  COLLECTIONS,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  NOTIFICATION_TYPES,
  DATE_FORMATS,
  PAGINATION
};