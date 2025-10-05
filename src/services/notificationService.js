// src/services/notificationService.js

import toast from 'react-hot-toast';
import { APP_CONFIG, NOTIFICATION_TYPES } from '../constants';

/**
 * Advanced notification service with toast and push notification support
 */
class NotificationService {
  constructor() {
    this.pushNotificationSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    this.notificationPermission = Notification.permission;
    
    // Initialize service worker for push notifications
    if (this.pushNotificationSupported) {
      this.initializeServiceWorker();
    }
  }

  /**
   * Initialize service worker for push notifications
   */
  async initializeServiceWorker() {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        console.log('Service worker ready for push notifications');
      }
    } catch (error) {
      console.error('Service worker initialization failed:', error);
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.notificationPermission === 'granted') {
      return true;
    }

    if (this.notificationPermission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission;
      return permission === 'granted';
    }

    return false;
  }

  /**
   * Show toast notification
   */
  showToast(message, type = NOTIFICATION_TYPES.INFO, options = {}) {
    const defaultOptions = {
      duration: 4000,
      position: 'top-right',
      style: {
        borderRadius: '12px',
        background: '#363636',
        color: '#fff',
        fontSize: '14px',
        maxWidth: '400px',
        padding: '12px 16px'
      },
      ...options
    };

    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return toast.success(message, {
          ...defaultOptions,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff'
          }
        });

      case NOTIFICATION_TYPES.ERROR:
        return toast.error(message, {
          ...defaultOptions,
          duration: 6000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff'
          }
        });

      case NOTIFICATION_TYPES.WARNING:
        return toast(message, {
          ...defaultOptions,
          icon: '⚠️',
          style: {
            ...defaultOptions.style,
            background: '#f59e0b',
            color: '#fff'
          }
        });

      default:
        return toast(message, {
          ...defaultOptions,
          icon: 'ℹ️'
        });
    }
  }

  /**
   * Show loading toast with promise
   */
  showLoadingToast(promise, messages = {}) {
    const defaultMessages = {
      loading: 'Loading...',
      success: 'Success!',
      error: 'Something went wrong!'
    };

    const finalMessages = { ...defaultMessages, ...messages };

    return toast.promise(promise, finalMessages, {
      style: {
        borderRadius: '12px',
        background: '#363636',
        color: '#fff'
      },
      success: {
        duration: 3000,
        iconTheme: {
          primary: '#10b981',
          secondary: '#fff'
        }
      },
      error: {
        duration: 5000,
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff'
        }
      }
    });
  }

  /**
   * Show browser push notification
   */
  async showPushNotification(title, options = {}) {
    if (!await this.requestPermission()) {
      console.warn('Notification permission not granted');
      return false;
    }

    const defaultOptions = {
      badge: '/favicon-96x96.png',
      icon: '/pwa-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        timestamp: Date.now(),
        app: APP_CONFIG.NAME
      },
      actions: [
        {
          action: 'view',
          title: 'View',
          icon: '/icons/view.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icons/dismiss.png'
        }
      ],
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      // Handle notification click
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        if (options.onClick) {
          options.onClick(event);
        }
      };

      return notification;
    } catch (error) {
      console.error('Failed to show push notification:', error);
      return false;
    }
  }

  /**
   * Show food-specific notifications
   */
  showFoodNotification(type, data) {
    switch (type) {
      case 'new_food':
        this.showToast(
          `🍽️ New food available: ${data.name} from ${data.restaurant}`,
          NOTIFICATION_TYPES.SUCCESS
        );
        
        if (this.notificationPermission === 'granted') {
          this.showPushNotification(`New Food Available!`, {
            body: `${data.name} from ${data.restaurant}`,
            tag: 'new-food',
            onClick: () => {
              window.location.href = `/food/${data.id}`;
            }
          });
        }
        break;

      case 'food_claimed':
        this.showToast(
          `✅ Food pickup confirmed: ${data.name}`,
          NOTIFICATION_TYPES.SUCCESS
        );
        break;

      case 'food_expired':
        this.showToast(
          `⏰ Food item expired: ${data.name}`,
          NOTIFICATION_TYPES.WARNING
        );
        break;

      case 'pickup_reminder':
        this.showToast(
          `🚚 Reminder: Pickup scheduled for ${data.name} at ${data.time}`,
          NOTIFICATION_TYPES.INFO
        );
        
        if (this.notificationPermission === 'granted') {
          this.showPushNotification(`Pickup Reminder`, {
            body: `Don't forget your scheduled pickup: ${data.name}`,
            tag: 'pickup-reminder'
          });
        }
        break;

      case 'low_stock':
        this.showToast(
          `📦 Low stock alert: Only ${data.quantity} left of ${data.name}`,
          NOTIFICATION_TYPES.WARNING
        );
        break;

      default:
        this.showToast(data.message, NOTIFICATION_TYPES.INFO);
    }
  }

  /**
   * Show system notifications
   */
  showSystemNotification(type, message, options = {}) {
    const systemMessages = {
      maintenance: '🔧 System maintenance scheduled',
      update: '🆕 App updated successfully!',
      offline: '📱 You are currently offline',
      online: '🌐 Connection restored',
      sync_error: '⚠️ Sync failed - changes saved locally',
      sync_success: '✅ All changes synced successfully'
    };

    const finalMessage = systemMessages[type] || message;
    const notificationType = ['offline', 'sync_error'].includes(type) 
      ? NOTIFICATION_TYPES.WARNING 
      : type === 'maintenance' 
      ? NOTIFICATION_TYPES.INFO 
      : NOTIFICATION_TYPES.SUCCESS;

    this.showToast(finalMessage, notificationType, options);
  }

  /**
   * Custom notification with advanced options
   */
  showCustomToast(options) {
    const {
      message,
      type = NOTIFICATION_TYPES.INFO,
      duration = 4000,
      action,
      actionText = 'Action',
      dismissible = true,
      persistent = false,
      ...toastOptions
    } = options;

    const customToast = toast((t) => (
      <div className="flex items-center justify-between w-full">
        <div className="flex-1">
          <p className="font-medium text-sm">{message}</p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {action && (
            <button
              onClick={() => {
                action();
                if (!persistent) toast.dismiss(t.id);
              }}
              className="px-3 py-1 bg-white bg-opacity-20 text-white text-xs rounded hover:bg-opacity-30 transition-colors"
            >
              {actionText}
            </button>
          )}
          
          {dismissible && (
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-white hover:text-gray-300"
            >
              ×
            </button>
          )}
        </div>
      </div>
    ), {
      duration: persistent ? Infinity : duration,
      style: {
        borderRadius: '12px',
        background: this.getTypeColor(type),
        color: '#fff',
        minWidth: '300px',
        padding: '12px 16px'
      },
      ...toastOptions
    });

    return customToast;
  }

  /**
   * Get color based on notification type
   */
  getTypeColor(type) {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return '#10b981';
      case NOTIFICATION_TYPES.ERROR:
        return '#ef4444';
      case NOTIFICATION_TYPES.WARNING:
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  }

  /**
   * Dismiss all toasts
   */
  dismissAll() {
    toast.dismiss();
  }

  /**
   * Check if notifications are supported
   */
  isSupported() {
    return 'Notification' in window;
  }

  /**
   * Get notification permission status
   */
  getPermissionStatus() {
    return this.notificationPermission;
  }
}

// Create singleton instance
const notificationService = new NotificationService();

// Convenience methods
export const showToast = (message, type, options) => 
  notificationService.showToast(message, type, options);

export const showLoadingToast = (promise, messages) => 
  notificationService.showLoadingToast(promise, messages);

export const showFoodNotification = (type, data) => 
  notificationService.showFoodNotification(type, data);

export const showSystemNotification = (type, message, options) => 
  notificationService.showSystemNotification(type, message, options);

export const showCustomToast = (options) => 
  notificationService.showCustomToast(options);

export const requestNotificationPermission = () => 
  notificationService.requestPermission();

export const dismissAllToasts = () => 
  notificationService.dismissAll();

export default notificationService;