// src/components/features/QRScanner.jsx

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaQrcode, 
  FaCamera, 
  FaStop, 
  FaCheck, 
  FaTimes, 
  FaExclamationTriangle,
  FaUser,
  FaPhone,
  FaClock,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { showToast } from '../../services/notificationService';
import { trackEngagement } from '../../services/analyticsService';

const QRScanner = ({ isOpen, onClose, onScanSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [cameraPermission, setCameraPermission] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (isOpen && isScanning) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isOpen, isScanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      setCameraPermission('granted');
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Start scanning for QR codes
        scanIntervalRef.current = setInterval(scanForQRCode, 500);
      }
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraPermission('denied');
      showToast('Camera access denied. Please use manual verification.', 'error');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    setIsScanning(false);
  };

  const scanForQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Try to detect QR code using ImageData
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Here you would typically use a QR code detection library
      // For demonstration, we'll simulate QR code detection
      // In a real implementation, you'd use libraries like 'jsqr' or similar
      
      // Simulated QR code detection (replace with actual library)
      // This is just a placeholder - in reality you'd use jsqr or similar
      // const code = jsQR(imageData.data, imageData.width, imageData.height);
      // if (code) {
      //   verifyQRCode(code.data);
      // }
    }
  };

  const verifyQRCode = async (qrData) => {
    setIsProcessing(true);
    stopCamera();
    
    try {
      let parsedData;
      
      try {
        parsedData = JSON.parse(qrData);
      } catch (error) {
        // If it's not JSON, treat as verification ID
        parsedData = { verificationId: qrData };
      }
      
      if (!parsedData.verificationId && !parsedData.foodId) {
        throw new Error('Invalid QR code format');
      }
      
      // Find the food item by verification ID
      let foodDoc;
      if (parsedData.foodId) {
        foodDoc = await getDoc(doc(db, 'food-items', parsedData.foodId));
      } else {
        // Search for food item with this verification ID
        // In a real implementation, you'd need to query the collection
        // For now, we'll assume the verification ID is the food ID
        foodDoc = await getDoc(doc(db, 'food-items', parsedData.verificationId));
      }
      
      if (!foodDoc.exists()) {
        setVerificationResult({
          status: 'invalid',
          message: 'Food item not found'
        });
        return;
      }
      
      const foodData = { id: foodDoc.id, ...foodDoc.data() };
      
      // Verify the code matches
      if (parsedData.verificationId && 
          foodData.qrVerificationId !== parsedData.verificationId) {
        setVerificationResult({
          status: 'invalid',
          message: 'Verification code mismatch'
        });
        return;
      }
      
      if (foodData.status === 'completed') {
        setVerificationResult({
          status: 'already_used',
          message: 'This pickup has already been completed',
          foodData
        });
        return;
      }
      
      if (foodData.status !== 'claimed') {
        setVerificationResult({
          status: 'not_claimed',
          message: 'This food item has not been claimed yet',
          foodData
        });
        return;
      }
      
      // Update the food item as completed
      await updateDoc(doc(db, 'food-items', foodData.id), {
        status: 'completed',
        pickupVerifiedAt: new Date(),
        pickupVerifiedBy: user.uid,
        qrCodeUsed: true
      });
      
      setVerificationResult({
        status: 'success',
        message: 'Pickup verified successfully!',
        foodData
      });
      
      trackEngagement('qr_verification_success', {
        foodId: foodData.id,
        verifierId: user.uid
      });
      
      showToast('Pickup verified successfully!', 'success');
      
      if (onScanSuccess) {
        onScanSuccess(foodData);
      }
      
    } catch (error) {
      console.error('Error verifying QR code:', error);
      setVerificationResult({
        status: 'error',
        message: 'Error verifying pickup code'
      });
      showToast('Error verifying pickup code', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualVerification = () => {
    if (!manualCode.trim()) {
      showToast('Please enter a verification code', 'error');
      return;
    }
    
    verifyQRCode(manualCode.trim());
  };

  const resetScanner = () => {
    setVerificationResult(null);
    setManualCode('');
    if (isScanning) {
      startCamera();
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
          className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaQrcode className="text-2xl" />
                <div>
                  <h3 className="text-xl font-semibold">QR Verification</h3>
                  <p className="text-blue-100 text-sm">Verify food pickup</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-blue-200 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          <div className="p-6">
            {!verificationResult ? (
              <div className="space-y-6">
                {/* Camera Scanner */}
                {cameraPermission !== 'denied' && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h5 className="font-semibold text-gray-800 mb-2">Scan QR Code</h5>
                      <p className="text-sm text-gray-600 mb-4">
                        Point your camera at the QR code to verify pickup
                      </p>
                    </div>
                    
                    {!isScanning ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsScanning(true)}
                        className="w-full bg-blue-500 text-white py-4 px-6 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center space-x-3"
                      >
                        <FaCamera className="text-xl" />
                        <span className="font-semibold">Start Camera</span>
                      </motion.button>
                    ) : (
                      <div className="space-y-4">
                        {/* Camera View */}
                        <div className="relative bg-black rounded-xl overflow-hidden">
                          <video
                            ref={videoRef}
                            className="w-full h-64 object-cover"
                            playsInline
                            muted
                          />
                          
                          {/* Scanning overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 border-2 border-white rounded-xl relative">
                              <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-400 rounded-tl-xl"></div>
                              <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-400 rounded-tr-xl"></div>
                              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-400 rounded-bl-xl"></div>
                              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-400 rounded-br-xl"></div>
                            </div>
                          </div>
                          
                          {isProcessing && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <div className="bg-white p-4 rounded-xl flex items-center space-x-3">
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-gray-800 font-medium">Verifying...</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <canvas ref={canvasRef} className="hidden" />
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={stopCamera}
                          className="w-full bg-red-500 text-white py-3 px-4 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <FaStop />
                          <span>Stop Camera</span>
                        </motion.button>
                      </div>
                    )}
                  </div>
                )}

                {/* Manual Input */}
                <div className="border-t border-gray-200 pt-6">
                  <h5 className="font-semibold text-gray-800 mb-4">Manual Verification</h5>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter verification code:
                      </label>
                      <input
                        type="text"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        placeholder="Enter the verification code"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleManualVerification()}
                      />
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleManualVerification}
                      disabled={!manualCode.trim() || isProcessing}
                      className="w-full bg-indigo-500 text-white py-3 px-4 rounded-xl hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <FaCheck />
                          <span>Verify Code</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            ) : (
              // Verification Result
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${
                    verificationResult.status === 'success'
                      ? 'bg-green-100'
                      : verificationResult.status === 'already_used'
                      ? 'bg-yellow-100'
                      : 'bg-red-100'
                  }`}
                >
                  {verificationResult.status === 'success' ? (
                    <FaCheck className="text-4xl text-green-600" />
                  ) : verificationResult.status === 'already_used' ? (
                    <FaClock className="text-4xl text-yellow-600" />
                  ) : (
                    <FaExclamationTriangle className="text-4xl text-red-600" />
                  )}
                </motion.div>

                <div>
                  <h4 className={`text-2xl font-bold mb-2 ${
                    verificationResult.status === 'success'
                      ? 'text-green-800'
                      : verificationResult.status === 'already_used'
                      ? 'text-yellow-800'
                      : 'text-red-800'
                  }`}>
                    {verificationResult.status === 'success' && 'Verified Successfully!'}
                    {verificationResult.status === 'already_used' && 'Already Completed'}
                    {verificationResult.status === 'invalid' && 'Invalid Code'}
                    {verificationResult.status === 'not_claimed' && 'Not Claimed'}
                    {verificationResult.status === 'error' && 'Verification Error'}
                  </h4>
                  <p className="text-gray-600">{verificationResult.message}</p>
                </div>

                {/* Food Details */}
                {verificationResult.foodData && (
                  <div className="bg-gray-50 p-4 rounded-xl text-left">
                    <h5 className="font-semibold text-gray-800 mb-3">Food Details:</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Food:</span>
                        <span className="font-medium">{verificationResult.foodData.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Restaurant:</span>
                        <span className="font-medium">{verificationResult.foodData.restaurantName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-medium">{verificationResult.foodData.quantity}</span>
                      </div>
                      {verificationResult.foodData.claimerContact && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Contact:</span>
                          <span className="font-medium">{verificationResult.foodData.claimerContact}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetScanner}
                    className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    Scan Another
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QRScanner;