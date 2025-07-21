// src/hooks/useRealTimeNotifications.js
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { subscribeToAvailableListings } from '../firebase/food';
import { toast } from 'react-hot-toast';

export const useRealTimeNotifications = () => {
  const { user } = useSelector((state) => state.auth);
  const { availableListings } = useSelector((state) => state.food);

  useEffect(() => {
    if (!user || user.role !== 'volunteer') return;

    let previousCount = 0;
    
    const unsubscribe = subscribeToAvailableListings((listings) => {
      const currentCount = listings.length;
      
      // Show notification when new items are added
      if (currentCount > previousCount && previousCount > 0) {
        const newItems = currentCount - previousCount;
        toast.success(
          `${newItems} new food item${newItems > 1 ? 's' : ''} available for pickup!`,
          {
            duration: 5000,
            icon: '🍽️',
          }
        );
      }
      
      previousCount = currentCount;
    });

    return () => unsubscribe();
  }, [user]);

  return null;
}; 