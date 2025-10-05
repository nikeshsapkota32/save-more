// src/components/features/QuickClaim.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaQrcode, 
  FaBolt, 
  FaMapMarkerAlt, 
  FaClock, 
  FaUser,
  FaPhone,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { showToast } from '../../services/notificationService';
import { trackEngagement } from '../../services/analyticsService';
import QRCodeSystem from './QRCodeSystem';

const QuickClaim = ({ foodItem, onClaimed, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [claimStep, setClaimStep] = useState('details'); // 'details', 'confirm', 'success'
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    arrivalTime: '15',
    notes: ''
  });
  
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleQuickClaim = async () => {
    if (!contactInfo.phone.trim()) {
      showToast('Please provide a contact number', 'error');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create claim record
      const claimData = {
        foodItemId: foodItem.id,
        claimerId: user.uid,
        claimerName: user.displayName || user.email,
        claimerPhone: contactInfo.phone,
        estimatedArrival: contactInfo.arrivalTime,
        notes: contactInfo.notes,
        claimedAt: new Date(),
        status: 'pending',
        pickupLocation: foodItem.location || foodItem.restaurantAddress,
        restaurantId: foodItem.restaurantId,
        restaurantName: foodItem.restaurantName
      };

      // Add to claims collection
      const claimDoc = await addDoc(collection(db, 'claims'), claimData);

      // Update food item status
      await updateDoc(doc(db, 'food-items', foodItem.id), {
        status: 'claimed',
        claimedBy: user.uid,
        claimedAt: new Date(),
        claimId: claimDoc.id,
        claimerContact: contactInfo.phone
      });

      trackEngagement('food_quick_claimed', {
        foodId: foodItem.id,
        restaurantId: foodItem.restaurantId,
        estimatedArrival: contactInfo.arrivalTime
      });

      setClaimStep('success');
      
      if (onClaimed) {
        onClaimed({
          ...foodItem,
          status: 'claimed',
          claimId: claimDoc.id
        });
      }

      showToast('Food claimed successfully! Check your QR code for pickup.', 'success');
      
      // Show QR code after 2 seconds
      setTimeout(() => {
        setShowQR(true);
      }, 2000);

    } catch (error) {
      console.error('Error claiming food:', error);
      showToast('Failed to claim food. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}m` 
      : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  if (showQR) {
    return (
      <QRCodeSystem
        isOpen={true}
        onClose={() => {
          setShowQR(false);
          onClose?.();
        }}
        foodItem={foodItem}
        mode="generate"
      />
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-t-2xl sticky top-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaBolt className="text-2xl" />
                <div>
                  <h3 className="text-xl font-semibold">Quick Claim</h3>
                  <p className="text-orange-100 text-sm">
                    {claimStep === 'details' && 'Fast track your food rescue'}
                    {claimStep === 'confirm' && 'Confirm your claim'}
                    {claimStep === 'success' && 'Claim successful!'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-orange-200 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          <div className="p-6">
            {claimStep === 'details' && (
              <div className="space-y-6">
                {/* Food Item Details */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2">{foodItem.name}</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span>{foodItem.restaurantName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-blue-500" />
                      <span>Expires: {foodItem.expiryTime}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h5 className="font-semibold text-gray-800">Contact & Pickup Details</h5>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaPhone className="inline mr-2 text-green-500" />
                      Your Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaClock className="inline mr-2 text-blue-500" />
                      Estimated Arrival Time
                    </label>
                    <select
                      value={contactInfo.arrivalTime}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, arrivalTime: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="10">10 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="20">20 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={contactInfo.notes}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any special instructions or notes..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                {/* Quick Claim Benefits */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl">
                  <h6 className="font-semibold text-orange-800 mb-2">Quick Claim Benefits:</h6>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Instant QR code for pickup verification</li>
                    <li>• Direct notification to restaurant</li>
                    <li>• Priority pickup status</li>
                    <li>• Real-time tracking updates</li>
                  </ul>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setClaimStep('confirm')}
                  disabled={!contactInfo.phone.trim()}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-6 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg flex items-center justify-center space-x-2"
                >
                  <FaBolt />
                  <span>Quick Claim Food</span>
                </motion.button>
              </div>
            )}

            {claimStep === 'confirm' && (
              <div className="space-y-6">
                {/* Confirmation Summary */}
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                  <h5 className="font-semibold text-orange-800 mb-3">Claim Summary</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Food Item:</span>
                      <span className="font-medium">{foodItem.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Restaurant:</span>
                      <span className="font-medium">{foodItem.restaurantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Phone:</span>
                      <span className="font-medium">{contactInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Arrival Time:</span>
                      <span className="font-medium">{formatTime(parseInt(contactInfo.arrivalTime))}</span>
                    </div>
                    {contactInfo.notes && (
                      <div className="pt-2 border-t border-orange-200">
                        <span className="text-gray-600 text-xs">Notes:</span>
                        <p className="text-gray-800 text-sm mt-1">{contactInfo.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <p className="text-amber-800 text-sm">
                    ⚠️ Please arrive within your estimated time. The restaurant will be notified of your claim.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setClaimStep('details')}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleQuickClaim}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <FaCheck />
                        <span>Confirm Claim</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            )}

            {claimStep === 'success' && (
              <div className="text-center space-y-6">
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                  className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                >
                  <FaCheck className="text-4xl text-green-600" />
                </motion.div>

                <div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">Claim Successful!</h4>
                  <p className="text-gray-600">
                    Your food has been claimed and the restaurant has been notified.
                  </p>
                </div>

                {/* Next Steps */}
                <div className="bg-green-50 p-4 rounded-xl text-left">
                  <h6 className="font-semibold text-green-800 mb-2">Next Steps:</h6>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>1. QR code will be generated automatically</li>
                    <li>2. Head to {foodItem.restaurantName}</li>
                    <li>3. Show your QR code for pickup verification</li>
                    <li>4. Enjoy your rescued food!</li>
                  </ul>
                </div>

                {/* QR Code Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-blue-50 p-4 rounded-xl"
                >
                  <div className="flex items-center justify-center space-x-2 text-blue-800">
                    <FaQrcode className="text-2xl" />
                    <span className="font-medium">QR Code generating...</span>
                  </div>
                  <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2 }}
                      className="bg-blue-600 h-2 rounded-full"
                    />
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickClaim;