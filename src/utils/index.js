// src/utils/index.js

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
  };\n\n  if (!password) {\n    result.suggestions.push('Password is required');\n    return result;\n  }\n\n  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {\n    result.suggestions.push(`Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters long`);\n  }\n\n  if (password.length > VALIDATION.MAX_PASSWORD_LENGTH) {\n    result.suggestions.push(`Password must not exceed ${VALIDATION.MAX_PASSWORD_LENGTH} characters`);\n  }\n\n  if (!/[a-z]/.test(password)) {\n    result.suggestions.push('Password must contain at least one lowercase letter');\n  }\n\n  if (!/[A-Z]/.test(password)) {\n    result.suggestions.push('Password must contain at least one uppercase letter');\n  }\n\n  if (!/[0-9]/.test(password)) {\n    result.suggestions.push('Password must contain at least one number');\n  }\n\n  if (!/[^a-zA-Z0-9]/.test(password)) {\n    result.suggestions.push('Password must contain at least one special character');\n  }\n\n  // Calculate strength\n  let score = 0;\n  if (password.length >= 8) score += 1;\n  if (password.length >= 12) score += 1;\n  if (/[a-z]/.test(password)) score += 1;\n  if (/[A-Z]/.test(password)) score += 1;\n  if (/[0-9]/.test(password)) score += 1;\n  if (/[^a-zA-Z0-9]/.test(password)) score += 1;\n\n  if (score <= 2) result.strength = 'weak';\n  else if (score <= 4) result.strength = 'medium';\n  else result.strength = 'strong';\n\n  result.isValid = result.suggestions.length === 0;\n  return result;\n};\n\n/**\n * Validate file size and type\n * @param {File} file - File to validate\n * @returns {object} Validation result\n */\nexport const validateFile = (file) => {\n  const result = {\n    isValid: true,\n    errors: []\n  };\n\n  if (!file) {\n    result.isValid = false;\n    result.errors.push('No file selected');\n    return result;\n  }\n\n  if (file.size > VALIDATION.MAX_FILE_SIZE) {\n    result.isValid = false;\n    result.errors.push(`File size must not exceed ${formatFileSize(VALIDATION.MAX_FILE_SIZE)}`);\n  }\n\n  if (!VALIDATION.ALLOWED_IMAGE_TYPES.includes(file.type)) {\n    result.isValid = false;\n    result.errors.push('Invalid file type. Please select a JPEG, PNG, WebP, or GIF image.');\n  }\n\n  return result;\n};\n\n/**\n * Format file size in human-readable format\n * @param {number} bytes - File size in bytes\n * @returns {string} Formatted file size\n */\nexport const formatFileSize = (bytes) => {\n  if (bytes === 0) return '0 Bytes';\n  \n  const k = 1024;\n  const sizes = ['Bytes', 'KB', 'MB', 'GB'];\n  const i = Math.floor(Math.log(bytes) / Math.log(k));\n  \n  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];\n};\n\n/**\n * Capitalize first letter of string\n * @param {string} str - String to capitalize\n * @returns {string} Capitalized string\n */\nexport const capitalizeFirst = (str) => {\n  if (!str) return '';\n  return str.charAt(0).toUpperCase() + str.slice(1);\n};\n\n/**\n * Convert string to title case\n * @param {string} str - String to convert\n * @returns {string} Title case string\n */\nexport const toTitleCase = (str) => {\n  if (!str) return '';\n  return str.replace(/\\w\\S*/g, (txt) => \n    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()\n  );\n};\n\n/**\n * Generate random string\n * @param {number} length - Length of random string\n * @returns {string} Random string\n */\nexport const generateRandomString = (length = 10) => {\n  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';\n  let result = '';\n  for (let i = 0; i < length; i++) {\n    result += characters.charAt(Math.floor(Math.random() * characters.length));\n  }\n  return result;\n};\n\n/**\n * Debounce function\n * @param {Function} func - Function to debounce\n * @param {number} delay - Delay in milliseconds\n * @returns {Function} Debounced function\n */\nexport const debounce = (func, delay) => {\n  let timeoutId;\n  return (...args) => {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => func.apply(null, args), delay);\n  };\n};\n\n/**\n * Throttle function\n * @param {Function} func - Function to throttle\n * @param {number} delay - Delay in milliseconds\n * @returns {Function} Throttled function\n */\nexport const throttle = (func, delay) => {\n  let lastCall = 0;\n  return (...args) => {\n    const now = Date.now();\n    if (now - lastCall >= delay) {\n      lastCall = now;\n      func.apply(null, args);\n    }\n  };\n};\n\n/**\n * Get storage item with error handling\n * @param {string} key - Storage key\n * @param {*} defaultValue - Default value if not found\n * @returns {*} Stored value or default\n */\nexport const getStorageItem = (key, defaultValue = null) => {\n  try {\n    const item = localStorage.getItem(key);\n    return item ? JSON.parse(item) : defaultValue;\n  } catch (error) {\n    console.error('Error getting storage item:', error);\n    return defaultValue;\n  }\n};\n\n/**\n * Set storage item with error handling\n * @param {string} key - Storage key\n * @param {*} value - Value to store\n * @returns {boolean} Success status\n */\nexport const setStorageItem = (key, value) => {\n  try {\n    localStorage.setItem(key, JSON.stringify(value));\n    return true;\n  } catch (error) {\n    console.error('Error setting storage item:', error);\n    return false;\n  }\n};\n\n/**\n * Remove storage item\n * @param {string} key - Storage key\n * @returns {boolean} Success status\n */\nexport const removeStorageItem = (key) => {\n  try {\n    localStorage.removeItem(key);\n    return true;\n  } catch (error) {\n    console.error('Error removing storage item:', error);\n    return false;\n  }\n};\n\n/**\n * Calculate distance between two coordinates\n * @param {number} lat1 - Latitude 1\n * @param {number} lon1 - Longitude 1\n * @param {number} lat2 - Latitude 2\n * @param {number} lon2 - Longitude 2\n * @returns {number} Distance in kilometers\n */\nexport const calculateDistance = (lat1, lon1, lat2, lon2) => {\n  const R = 6371; // Radius of the Earth in kilometers\n  const dLat = (lat2 - lat1) * Math.PI / 180;\n  const dLon = (lon2 - lon1) * Math.PI / 180;\n  const a = \n    Math.sin(dLat / 2) * Math.sin(dLat / 2) +\n    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *\n    Math.sin(dLon / 2) * Math.sin(dLon / 2);\n  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));\n  return R * c;\n};\n\n/**\n * Get color for food priority\n * @param {string} priority - Priority level\n * @returns {string} Tailwind color class\n */\nexport const getPriorityColor = (priority) => {\n  switch (priority) {\n    case 'urgent':\n      return 'text-red-600 bg-red-100 border-red-200';\n    case 'high':\n      return 'text-orange-600 bg-orange-100 border-orange-200';\n    case 'medium':\n      return 'text-yellow-600 bg-yellow-100 border-yellow-200';\n    case 'low':\n      return 'text-green-600 bg-green-100 border-green-200';\n    default:\n      return 'text-gray-600 bg-gray-100 border-gray-200';\n  }\n};\n\n/**\n * Get color for food status\n * @param {string} status - Food status\n * @returns {string} Tailwind color class\n */\nexport const getStatusColor = (status) => {\n  switch (status) {\n    case FOOD_STATUS.AVAILABLE:\n      return 'text-green-600 bg-green-100 border-green-200';\n    case FOOD_STATUS.PENDING:\n      return 'text-yellow-600 bg-yellow-100 border-yellow-200';\n    case FOOD_STATUS.CLAIMED:\n      return 'text-blue-600 bg-blue-100 border-blue-200';\n    case FOOD_STATUS.COMPLETED:\n      return 'text-emerald-600 bg-emerald-100 border-emerald-200';\n    case FOOD_STATUS.EXPIRED:\n      return 'text-red-600 bg-red-100 border-red-200';\n    default:\n      return 'text-gray-600 bg-gray-100 border-gray-200';\n  }\n};\n\nexport default {\n  formatDate,\n  isFoodExpired,\n  isFoodExpiringSoon,\n  getFoodPriority,\n  validateEmail,\n  validatePhone,\n  validatePassword,\n  validateFile,\n  formatFileSize,\n  capitalizeFirst,\n  toTitleCase,\n  generateRandomString,\n  debounce,\n  throttle,\n  getStorageItem,\n  setStorageItem,\n  removeStorageItem,\n  calculateDistance,\n  getPriorityColor,\n  getStatusColor\n};