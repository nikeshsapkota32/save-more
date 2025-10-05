// src/components/features/QRCodeSystem.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode.react';
import { 
  FaQrcode, 
  FaCamera, 
  FaDownload, 
  FaShare, 
  FaTimes, 
  FaCheck, 
  FaExclamationTriangle,
  FaCopy
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { showToast } from '../../services/notificationService';
import { trackEngagement } from '../../services/analyticsService';
import { v4 as uuidv4 } from 'uuid';

const QRCodeSystem = ({ 
  isOpen, 
  onClose, 
  foodItem, 
  mode = 'generate', // 'generate' or 'verify' 
  onVerificationComplete 
}) => {
  const [qrData, setQrData] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [qrCodeSize, setQrCodeSize] = useState(256);
  
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (mode === 'generate' && foodItem) {
      generateQRCode();
    }
  }, [mode, foodItem]);

  const generateQRCode = async () => {
    try {
      const verificationId = uuidv4();
      const qrCodeData = {
        foodId: foodItem.id,
        restaurantId: foodItem.restaurantId,
        verificationId,
        timestamp: Date.now(),
        type: 'food_pickup',
        amount: foodItem.quantity,
        restaurantName: foodItem.restaurantName
      };

      // Store verification data in Firebase
      await updateDoc(doc(db, 'food-items', foodItem.id), {
        qrVerificationId: verificationId,
        qrGeneratedAt: new Date(),
        qrGeneratedBy: user.uid
      });

      setQrData(JSON.stringify(qrCodeData));
      setVerificationCode(verificationId);
      
      trackEngagement('qr_code_generated', { 
        foodId: foodItem.id, 
        verificationId 
      });
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      showToast('Failed to generate QR code', 'error');
    }
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code-canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `pickup-qr-${foodItem?.name || 'food'}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      trackEngagement('qr_code_downloaded', { 
        foodId: foodItem?.id 
      });
      
      showToast('QR Code downloaded successfully!', 'success');
    }
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        const canvas = document.getElementById('qr-code-canvas');
        canvas.toBlob(async (blob) => {
          const file = new File([blob], `pickup-qr-${foodItem?.name}.png`, { type: 'image/png' });
          await navigator.share({
            title: 'Food Pickup QR Code',
            text: `QR Code for picking up ${foodItem?.name} from ${foodItem?.restaurantName}`,
            files: [file]
          });
        });
        
        trackEngagement('qr_code_shared');
      } catch (error) {
        console.error('Error sharing QR code:', error);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(verificationCode).then(() => {
      showToast('Verification code copied to clipboard!', 'success');
      trackEngagement('verification_code_copied');
    });
  };

  const verifyPickup = async (scannedData) => {
    setIsLoading(true);
    try {
      const qrCodeData = JSON.parse(scannedData);
      
      // Verify the QR code data
      const foodDoc = await getDoc(doc(db, 'food-items', qrCodeData.foodId));
      
      if (!foodDoc.exists()) {
        setVerificationStatus('invalid');
        showToast('Invalid QR code: Food item not found', 'error');
        return;
      }

      const foodData = foodDoc.data();
      
      if (foodData.qrVerificationId !== qrCodeData.verificationId) {
        setVerificationStatus('invalid');
        showToast('Invalid QR code: Verification ID mismatch', 'error');
        return;
      }

      if (foodData.status === 'completed') {
        setVerificationStatus('already_used');
        showToast('This pickup has already been completed', 'warning');
        return;
      }

      // Update food item status
      await updateDoc(doc(db, 'food-items', qrCodeData.foodId), {
        status: 'completed',
        pickupVerifiedAt: new Date(),
        pickupVerifiedBy: user.uid,
        qrCodeUsed: true
      });

      setVerificationStatus('success');
      showToast('Pickup verified successfully!', 'success');
      
      trackEngagement('qr_code_verified', {
        foodId: qrCodeData.foodId,
        verificationId: qrCodeData.verificationId
      });

      if (onVerificationComplete) {
        onVerificationComplete(qrCodeData);
      }

    } catch (error) {
      console.error('Error verifying pickup:', error);
      setVerificationStatus('error');
      showToast('Error verifying pickup', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
          className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaQrcode className="text-2xl" />
                <div>
                  <h3 className="text-xl font-semibold">
                    {mode === 'generate' ? 'Pickup QR Code' : 'Verify Pickup'}
                  </h3>
                  <p className="text-emerald-100 text-sm">
                    {mode === 'generate' 
                      ? 'Show this to the volunteer' 
                      : 'Scan to verify pickup'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-emerald-200 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          <div className="p-6">
            {mode === 'generate' ? (
              // QR Code Generation Mode
              <div className="text-center space-y-6">
                {foodItem && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-2">{foodItem.name}</h4>
                    <p className="text-sm text-gray-600">
                      Quantity: {foodItem.quantity} | Expires: {foodItem.expiryTime}
                    </p>
                  </div>
                )}

                {qrData && (
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-100">
                    <QRCode
                      id="qr-code-canvas"
                      value={qrData}
                      size={qrCodeSize}
                      level="H"
                      includeMargin
                      renderAs="canvas"
                      className="mx-auto"
                    />
                  </div>
                )}

                {verificationCode && (
                  <div className="bg-emerald-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">Verification Code:</p>
                    <div className="flex items-center justify-center space-x-2">
                      <code className="bg-white px-3 py-1 rounded font-mono text-sm border">
                        {verificationCode}
                      </code>
                      <button
                        onClick={copyToClipboard}
                        className="p-2 text-emerald-600 hover:bg-emerald-100 rounded transition-colors"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={downloadQRCode}
                    className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FaDownload />
                    <span>Download</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={shareQRCode}
                    className="flex-1 bg-green-500 text-white py-3 px-4 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FaShare />
                    <span>Share</span>
                  </motion.button>
                </div>
              </div>
            ) : (
              // QR Code Verification Mode
              <div className="text-center space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <FaCamera className="mx-auto text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Use your phone camera or QR scanner to scan the pickup code
                  </p>
                </div>

                {/* Manual Code Input */}
                <div className="space-y-4">
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or enter verification code manually:
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter verification code"
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => verifyPickup(`{"verificationId":"${verificationCode}"}`)}
                        disabled={!verificationCode.trim() || isLoading}
                        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FaCheck />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Verification Status */}
                {verificationStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl flex items-center space-x-3 ${
                      verificationStatus === 'success'
                        ? 'bg-green-50 text-green-800'
                        : verificationStatus === 'invalid'
                        ? 'bg-red-50 text-red-800'
                        : verificationStatus === 'already_used'
                        ? 'bg-yellow-50 text-yellow-800'
                        : 'bg-red-50 text-red-800'
                    }`}
                  >
                    {verificationStatus === 'success' ? (
                      <FaCheck className="text-green-600" />
                    ) : (
                      <FaExclamationTriangle className="text-red-600" />
                    )}
                    <span className="font-medium">
                      {verificationStatus === 'success' && 'Pickup verified successfully!'}
                      {verificationStatus === 'invalid' && 'Invalid verification code'}
                      {verificationStatus === 'already_used' && 'This pickup was already completed'}
                      {verificationStatus === 'error' && 'Error verifying pickup'}
                    </span>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QRCodeSystem;