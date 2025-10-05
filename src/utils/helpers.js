// src/utils/helpers.js

import { format, parseISO, isAfter, isBefore, addDays, differenceInHours } from 'date-fns';
import { VALIDATION, DATE_FORMATS, FOOD_STATUS } from '../constants';

/**
 * Format date using specified format
 * @param {Date|string} date - Date to format
 * @param {string} formatString - Format string
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatString = DATE_FORMATS.DISPLAY) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Check if food item is expired
 * @param {Date|string} expiryDate - Expiry date
 * @returns {boolean} True if expired
 */
export const isFoodExpired = (expiryDate) => {
  if (!expiryDate) return false;
  const expiry = typeof expiryDate === 'string' ? parseISO(expiryDate) : expiryDate;
  return isBefore(expiry, new Date());
};

/**
 * Check if food item is expiring soon (within 24 hours)
 * @param {Date|string} expiryDate - Expiry date
 * @returns {boolean} True if expiring soon
 */
export const isFoodExpiringSoon = (expiryDate) => {
  if (!expiryDate) return false;
  const expiry = typeof expiryDate === 'string' ? parseISO(expiryDate) : expiryDate;
  const now = new Date();
  const hoursUntilExpiry = differenceInHours(expiry, now);
  return hoursUntilExpiry > 0 && hoursUntilExpiry <= 24;
};

/**
 * Get food priority based on expiry date
 * @param {Date|string} expiryDate - Expiry date
 * @returns {string} Priority level
 */
export const getFoodPriority = (expiryDate) => {
  if (!expiryDate) return 'low';
  
  const expiry = typeof expiryDate === 'string' ? parseISO(expiryDate) : expiryDate;
  const now = new Date();
  const hoursUntilExpiry = differenceInHours(expiry, now);
  
  if (hoursUntilExpiry <= 0) return 'expired';
  if (hoursUntilExpiry <= 6) return 'urgent';
  if (hoursUntilExpiry <= 24) return 'high';
  if (hoursUntilExpiry <= 72) return 'medium';
  return 'low';
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const validatePhone = (phone) => {
  return VALIDATION.PHONE_REGEX.test(phone);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with strength and suggestions
 */
export const validatePassword = (password) => {
  const result = {
    isValid: false,
    strength: 'weak',
    suggestions: []
  };

  if (!password) {
    result.suggestions.push('Password is required');
    return result;
  }

  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    result.suggestions.push(`Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters long`);
  }

  if (password.length > VALIDATION.MAX_PASSWORD_LENGTH) {
    result.suggestions.push(`Password must not exceed ${VALIDATION.MAX_PASSWORD_LENGTH} characters`);
  }

  if (!/[a-z]/.test(password)) {
    result.suggestions.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    result.suggestions.push('Password must contain at least one uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    result.suggestions.push('Password must contain at least one number');
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    result.suggestions.push('Password must contain at least one special character');
  }

  // Calculate strength
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) result.strength = 'weak';
  else if (score <= 4) result.strength = 'medium';
  else result.strength = 'strong';

  result.isValid = result.suggestions.length === 0;
  return result;
};

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate file size and type
 * @param {File} file - File to validate
 * @returns {object} Validation result
 */
export const validateFile = (file) => {
  const result = {
    isValid: true,
    errors: []
  };

  if (!file) {
    result.isValid = false;
    result.errors.push('No file selected');
    return result;
  }

  if (file.size > VALIDATION.MAX_FILE_SIZE) {
    result.isValid = false;
    result.errors.push(`File size must not exceed ${formatFileSize(VALIDATION.MAX_FILE_SIZE)}`);
  }

  if (!VALIDATION.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    result.isValid = false;
    result.errors.push('Invalid file type. Please select a JPEG, PNG, WebP, or GIF image.');
  }

  return result;
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert string to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Get storage item with error handling
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Stored value or default
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting storage item:', error);
    return defaultValue;
  }
};

/**
 * Set storage item with error handling
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error setting storage item:', error);
    return false;
  }
};

/**
 * Get color for food priority
 * @param {string} priority - Priority level
 * @returns {string} Tailwind color class
 */
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'urgent':
      return 'text-red-600 bg-red-100 border-red-200';
    case 'high':
      return 'text-orange-600 bg-orange-100 border-orange-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    case 'low':
      return 'text-green-600 bg-green-100 border-green-200';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200';
  }
};

/**
 * Get color for food status
 * @param {string} status - Food status
 * @returns {string} Tailwind color class
 */
export const getStatusColor = (status) => {
  switch (status) {
    case FOOD_STATUS.AVAILABLE:
      return 'text-green-600 bg-green-100 border-green-200';
    case FOOD_STATUS.PENDING:
      return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    case FOOD_STATUS.CLAIMED:
      return 'text-blue-600 bg-blue-100 border-blue-200';
    case FOOD_STATUS.COMPLETED:
      return 'text-emerald-600 bg-emerald-100 border-emerald-200';
    case FOOD_STATUS.EXPIRED:
      return 'text-red-600 bg-red-100 border-red-200';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200';
  }
};