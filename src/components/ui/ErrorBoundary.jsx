// src/components/ui/ErrorBoundary.jsx

import React, { Component } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';
import { APP_CONFIG } from '../../constants';

/**
 * Advanced Error Boundary component with professional error handling
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // In production, you would send this to your error reporting service
    if (APP_CONFIG.ENVIRONMENT === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  reportError = (error, errorInfo) => {
    // Example error reporting - replace with your preferred service
    try {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        errorId: this.state.errorId
      };

      // Send to error tracking service (e.g., Sentry, Rollbar, etc.)
      console.log('Error report:', errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      const { fallback: CustomFallback } = this.props;
      
      if (CustomFallback) {
        return (
          <CustomFallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
          />
        );
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                <FaExclamationTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-lg text-gray-600">
                We encountered an unexpected error. Don't worry, we're on it!
              </p>
            </motion.div>

            {/* Error Details */}
            {APP_CONFIG.ENVIRONMENT === 'development' && this.state.error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <details className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <summary className="font-semibold text-red-800 cursor-pointer">
                    Error Details (Development Mode)
                  </summary>
                  <div className="mt-4 space-y-2">
                    <div className="text-sm">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </div>
                    {this.state.errorInfo && (
                      <div className="text-sm">
                        <strong>Component Stack:</strong>
                        <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorId && (
                      <div className="text-sm">
                        <strong>Error ID:</strong> {this.state.errorId}
                      </div>
                    )}
                  </div>
                </details>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                <FaRedo className="w-4 h-4 mr-2" />
                Try Again
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                <FaHome className="w-4 h-4 mr-2" />
                Go Home
              </button>
            </motion.div>

            {/* Support Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center text-sm text-gray-500"
            >
              <p>
                If this problem persists, please{' '}
                <a
                  href="mailto:support@savetheplate.com"
                  className="text-emerald-600 hover:text-emerald-700 underline"
                >
                  contact support
                </a>
                {this.state.errorId && (
                  <span> and include Error ID: {this.state.errorId}</span>
                )}
              </p>
            </motion.div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export const useErrorHandler = () => {
  return (error, errorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // In a real app, you'd send this to your error reporting service
    if (APP_CONFIG.ENVIRONMENT === 'production') {
      // Report error to service
    }
  };
};

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = (WrappedComponent, fallbackComponent) => {
  const WithErrorBoundaryComponent = (props) => (
    <ErrorBoundary fallback={fallbackComponent}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundaryComponent;
};

// Lightweight error fallback for smaller components
export const SimpleErrorFallback = ({ error, onRetry }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
    <FaExclamationTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
    <h3 className="font-semibold text-red-800 mb-2">Something went wrong</h3>
    <p className="text-sm text-red-600 mb-4">
      {error?.message || 'An unexpected error occurred'}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
      >
        Try Again
      </button>
    )}
  </div>
);

export default ErrorBoundary;