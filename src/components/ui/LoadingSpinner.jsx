// src/components/ui/LoadingSpinner.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf } from 'react-icons/fa';

const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  text = 'Loading...',
  overlay = false,
  fullScreen = false,
  showText = true
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colors = {
    primary: 'text-emerald-600',
    secondary: 'text-amber-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const spinnerVariants = {
    start: { rotate: 0, scale: 1 },
    end: { rotate: 360, scale: [1, 1.1, 1] }
  };

  const leafVariants = {
    start: { rotate: 0, y: 0 },
    end: { rotate: [0, 10, -10, 0], y: [0, -5, 0] }
  };

  const containerClass = fullScreen
    ? 'fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center'
    : overlay
    ? 'absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-10 flex items-center justify-center'
    : 'flex items-center justify-center';

  const Spinner = () => (
    <div className="relative flex items-center justify-center">
      <motion.div
        className={`${sizes[size]} border-2 border-gray-200 border-t-current rounded-full ${colors[color]}`}
        variants={spinnerVariants}
        initial="start"
        animate="end"
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className={`absolute ${colors[color]}`}
        variants={leafVariants}
        initial="start"
        animate="end"
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <FaLeaf 
          className={size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-6 h-6'} 
        />
      </motion.div>
    </div>
  );

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center space-y-4">
        <Spinner />
        
        {showText && text && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`${textSizes[size]} ${colors[color]} font-medium text-center`}
          >
            {text}
          </motion.div>
        )}
        
        {showText && (
          <motion.div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className={`w-1 h-1 ${colors[color]} bg-current rounded-full`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export const SkeletonLoader = ({ lines = 3, className = '' }) => (
  <div className={`animate-pulse space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <div key={index}>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        {index === lines - 1 && (
          <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
        )}
      </div>
    ))}
  </div>
);

export const CardSkeleton = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-200 h-48 w-full rounded-lg mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

export const ButtonSpinner = ({ size = 'sm' }) => (
  <motion.div
    className={`inline-block border-2 border-white border-t-transparent rounded-full ${
      size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
    }`}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  />
);

export default LoadingSpinner;