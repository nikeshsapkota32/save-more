// src/services/analyticsService.js

import { analytics } from '../firebase/config';
import { logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { APP_CONFIG } from '../constants';

/**
 * Advanced analytics service for tracking user interactions and app performance
 */
class AnalyticsService {
  constructor() {
    this.isEnabled = APP_CONFIG.ENVIRONMENT === 'production' && analytics;
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    
    if (this.isEnabled) {
      this.initializeAnalytics();
    }
  }

  /**
   * Initialize analytics
   */
  initializeAnalytics() {
    // Track app initialization
    this.trackEvent('app_initialized', {
      app_version: APP_CONFIG.VERSION,
      environment: APP_CONFIG.ENVIRONMENT,
      session_id: this.sessionId
    });

    // Track page performance
    this.trackPerformanceMetrics();
    
    // Set up error tracking
    this.setupErrorTracking();
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Track custom event
   */
  trackEvent(eventName, parameters = {}) {
    if (!this.isEnabled) {
      console.log(`Analytics Event: ${eventName}`, parameters);
      return;
    }

    try {
      const eventData = {
        session_id: this.sessionId,
        timestamp: Date.now(),
        ...parameters
      };

      logEvent(analytics, eventName, eventData);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  /**
   * Track page view
   */
  trackPageView(pageName, additionalProps = {}) {
    this.trackEvent('page_view', {
      page_title: pageName,
      page_location: window.location.href,
      page_path: window.location.pathname,
      ...additionalProps
    });
  }

  /**
   * Track user authentication events
   */
  trackAuth(action, method = 'unknown', additionalProps = {}) {
    const events = {
      login: 'login',
      signup: 'sign_up',
      logout: 'logout'
    };

    this.trackEvent(events[action] || action, {
      method,
      ...additionalProps
    });
  }

  /**
   * Set user properties for analytics
   */
  setUser(userId, properties = {}) {
    if (!this.isEnabled) return;

    try {
      setUserId(analytics, userId);
      setUserProperties(analytics, {
        user_type: properties.userType || 'unknown',
        registration_date: properties.registrationDate || new Date().toISOString(),
        last_login: new Date().toISOString(),
        ...properties
      });
    } catch (error) {
      console.error('Error setting user properties:', error);
    }
  }

  /**
   * Track food-related events
   */
  trackFoodEvent(action, foodData = {}) {
    const eventMap = {
      add_food: 'add_food_item',
      view_food: 'view_food_item',
      claim_food: 'claim_food_item',
      complete_pickup: 'complete_food_pickup',
      cancel_pickup: 'cancel_food_pickup',
      expire_food: 'food_item_expired'
    };

    this.trackEvent(eventMap[action] || action, {
      food_id: foodData.id,
      food_category: foodData.category,
      food_quantity: foodData.quantity,
      restaurant_id: foodData.restaurantId,
      expiry_hours: foodData.expiryHours,
      ...foodData
    });
  }

  /**
   * Track user engagement
   */
  trackEngagement(action, context = {}) {
    const engagementEvents = {
      button_click: 'button_click',
      form_submit: 'form_submit',
      search: 'search',
      filter: 'apply_filter',
      share: 'share_content',
      download: 'download_content'
    };

    this.trackEvent(engagementEvents[action] || action, {
      engagement_time_msec: Date.now() - this.startTime,
      ...context
    });
  }

  /**
   * Track business metrics
   */
  trackBusinessMetric(metric, value, context = {}) {
    const businessMetrics = {
      food_saved: 'food_items_saved',
      meals_provided: 'meals_provided',
      waste_reduced: 'waste_reduced_kg',
      volunteer_hours: 'volunteer_hours_contributed',
      restaurant_partners: 'restaurant_partners_added'
    };

    this.trackEvent(businessMetrics[metric] || metric, {
      metric_value: value,
      metric_unit: context.unit || 'count',
      ...context
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformanceMetrics() {
    if (!this.isEnabled) return;

    // Track Core Web Vitals
    this.trackWebVitals();
    
    // Track custom performance metrics
    this.trackCustomPerformance();
  }

  /**
   * Track Core Web Vitals
   */
  trackWebVitals() {
    // First Contentful Paint
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.trackEvent('web_vital_fcp', {
            value: Math.round(entry.startTime)
          });
        }
      }
    });

    observer.observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.trackEvent('web_vital_lcp', {
        value: Math.round(lastEntry.startTime)
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.trackEvent('web_vital_cls', {
        value: Math.round(clsValue * 1000) / 1000
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Track custom performance metrics
   */
  trackCustomPerformance() {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackEvent('javascript_error', {
        error_message: event.message,
        error_source: event.filename,
        error_line: event.lineno,
        error_column: event.colno
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('unhandled_promise_rejection', {
        error_message: event.reason?.message || 'Unknown error',
        error_stack: event.reason?.stack
      });
    });

    // Track app load time
    window.addEventListener('load', () => {
      const loadTime = Date.now() - this.startTime;
      this.trackEvent('app_load_time', {
        load_time_ms: loadTime
      });
    });
  }

  /**
   * Setup error tracking
   */
  setupErrorTracking() {
    // Track React errors (to be called from ErrorBoundary)
    window.trackReactError = (error, errorInfo) => {
      this.trackEvent('react_error', {
        error_message: error.message,
        error_stack: error.stack,
        component_stack: errorInfo.componentStack
      });
    };
  }

  /**
   * Track conversion events
   */
  trackConversion(conversionType, value = 0, context = {}) {
    this.trackEvent('conversion', {
      conversion_type: conversionType,
      conversion_value: value,
      ...context
    });
  }

  /**
   * Track funnel progression
   */
  trackFunnelStep(funnelName, step, stepName, context = {}) {
    this.trackEvent('funnel_step', {
      funnel_name: funnelName,
      funnel_step: step,
      step_name: stepName,
      ...context
    });
  }

  /**
   * Track user retention
   */
  trackRetention(daysSinceFirstVisit, context = {}) {
    this.trackEvent('user_retention', {
      days_since_first_visit: daysSinceFirstVisit,
      ...context
    });
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(featureName, action = 'used', context = {}) {
    this.trackEvent('feature_usage', {
      feature_name: featureName,
      feature_action: action,
      ...context
    });
  }

  /**
   * Track search behavior
   */
  trackSearch(query, resultsCount = 0, filters = {}) {
    this.trackEvent('search', {
      search_term: query,
      results_count: resultsCount,
      filters_applied: Object.keys(filters).length,
      ...filters
    });
  }

  /**
   * Track social sharing
   */
  trackSocialShare(platform, contentType, contentId) {
    this.trackEvent('share', {
      method: platform,
      content_type: contentType,
      content_id: contentId
    });
  }

  /**
   * Track offline/online behavior
   */
  trackConnectivity(status) {
    this.trackEvent('connectivity_change', {
      connection_status: status,
      timestamp: Date.now()
    });
  }

  /**
   * Generate analytics report
   */
  generateSessionReport() {
    const sessionDuration = Date.now() - this.startTime;
    
    return {
      sessionId: this.sessionId,
      duration: sessionDuration,
      startTime: this.startTime,
      endTime: Date.now(),
      appVersion: APP_CONFIG.VERSION,
      environment: APP_CONFIG.ENVIRONMENT
    };
  }

  /**
   * Flush analytics data (call before app closes)
   */
  flush() {
    if (this.isEnabled) {
      const sessionReport = this.generateSessionReport();
      this.trackEvent('session_end', sessionReport);
    }
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

// Convenience exports
export const trackEvent = (eventName, parameters) => 
  analyticsService.trackEvent(eventName, parameters);

export const trackPageView = (pageName, props) => 
  analyticsService.trackPageView(pageName, props);

export const trackAuth = (action, method, props) => 
  analyticsService.trackAuth(action, method, props);

export const trackFoodEvent = (action, foodData) => 
  analyticsService.trackFoodEvent(action, foodData);

export const trackEngagement = (action, context) => 
  analyticsService.trackEngagement(action, context);

export const trackBusinessMetric = (metric, value, context) => 
  analyticsService.trackBusinessMetric(metric, value, context);

export const trackConversion = (type, value, context) => 
  analyticsService.trackConversion(type, value, context);

export const trackFeatureUsage = (featureName, action, context) => 
  analyticsService.trackFeatureUsage(featureName, action, context);

export const trackSearch = (query, resultsCount, filters) => 
  analyticsService.trackSearch(query, resultsCount, filters);

export const setUser = (userId, properties) => 
  analyticsService.setUser(userId, properties);

export default analyticsService;