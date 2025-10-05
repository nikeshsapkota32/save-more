// src/components/FoodList.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaQrcode, 
  FaBolt, 
  FaMapMarkerAlt, 
  FaClock, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaPlus,
  FaScannerTouchscreen
} from 'react-icons/fa';
import { getFoodListings, deleteFoodListing } from '../firebase/food';
import { useSelector } from 'react-redux';
import FoodForm from './FoodForm';
import QRCodeSystem from './features/QRCodeSystem';
import QuickClaim from './features/QuickClaim';
import QRScanner from './features/QRScanner';
import { showToast } from '../services/notificationService';

export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const [editingFood, setEditingFood] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [qrMode, setQrMode] = useState(null); // 'generate', 'scan', 'claim'
  const [showQuickClaim, setShowQuickClaim] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'available', 'claimed', 'completed'
  
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const loadFoods = async () => {
      setFoods(await getFoodListings());
    };
    loadFoods();
  }, []);

  const handleQuickClaim = (food) => {
    setSelectedFood(food);
    setShowQuickClaim(true);
  };

  const handleGenerateQR = (food) => {
    setSelectedFood(food);
    setQrMode('generate');
  };

  const handleScanQR = () => {
    setShowQRScanner(true);
  };

  const filteredFoods = foods.filter(food => {
    if (filter === 'all') return true;
    return food.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'claimed': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Food Listings</h2>
          <p className="text-gray-600">Manage and track food rescue operations</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setEditingFood({})}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg"
          >
            <FaPlus />
            <span className="font-semibold">Add Food</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleScanQR}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
          >
            <FaScannerTouchscreen />
            <span className="font-semibold">Scan QR</span>
          </motion.button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-xl">
        {[
          { key: 'all', label: 'All', count: foods.length },
          { key: 'available', label: 'Available', count: foods.filter(f => f.status === 'available').length },
          { key: 'claimed', label: 'Claimed', count: foods.filter(f => f.status === 'claimed').length },
          { key: 'completed', label: 'Completed', count: foods.filter(f => f.status === 'completed').length }
        ].map(tab => (
          <motion.button
            key={tab.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              filter === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                filter === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Food Grid */}
      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoods.map(food => (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Food Image */}
              {food.image && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={food.image} 
                    alt={food.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                  />
                </div>
              )}
              
              <div className="p-6">
                {/* Food Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{food.name}</h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(food.status || 'available')}`}>
                    {(food.status || 'available').charAt(0).toUpperCase() + (food.status || 'available').slice(1)}
                  </span>
                </div>
                
                {/* Food Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    <span>{food.restaurantName || 'Restaurant'}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <FaClock className="mr-2 text-blue-500" />
                    <span>Expires: {food.expiryTime || 'Not specified'}</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Quantity: <span className="font-medium">{food.quantity}</span>
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-2">
                  {/* Primary Actions */}
                  {(!food.status || food.status === 'available') && (
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickClaim(food)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 px-4 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-200"
                      >
                        <FaBolt size={14} />
                        <span className="font-medium">Quick Claim</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleGenerateQR(food)}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                      >
                        <FaQrcode size={14} />
                      </motion.button>
                    </div>
                  )}
                  
                  {food.status === 'claimed' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGenerateQR(food)}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-2 px-4 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200"
                    >
                      <FaQrcode size={14} />
                      <span className="font-medium">Generate QR Code</span>
                    </motion.button>
                  )}
                  
                  {/* Secondary Actions */}
                  <div className="flex space-x-2 pt-2 border-t border-gray-100">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditingFood(food)}
                      className="flex items-center justify-center space-x-1 flex-1 py-2 px-3 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <FaEdit size={12} />
                      <span className="text-sm font-medium">Edit</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this food listing?')) {
                          deleteFoodListing(food.id);
                          showToast('Food listing deleted successfully', 'success');
                          setFoods(foods.filter(f => f.id !== food.id));
                        }
                      }}
                      className="flex items-center justify-center space-x-1 flex-1 py-2 px-3 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <FaTrash size={12} />
                      <span className="text-sm font-medium">Delete</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredFoods.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaEye className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No {filter !== 'all' ? filter : ''} food listings found
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? "Start by adding your first food listing to help reduce waste."
              : `No ${filter} food items at the moment.`
            }
          </p>
          {filter === 'all' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setEditingFood({})}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 mx-auto"
            >
              <FaPlus />
              <span className="font-semibold">Add Your First Listing</span>
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Modals */}
      {editingFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full mx-4 shadow-2xl">
            <FoodForm 
              existingFood={editingFood} 
              onClose={() => setEditingFood(null)} 
              onSuccess={(updatedFood) => {
                if (updatedFood.id) {
                  setFoods(foods.map(f => f.id === updatedFood.id ? updatedFood : f));
                } else {
                  setFoods([...foods, updatedFood]);
                }
                setEditingFood(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Quick Claim Modal */}
      {showQuickClaim && selectedFood && (
        <QuickClaim
          foodItem={selectedFood}
          onClaimed={(claimedFood) => {
            setFoods(foods.map(f => f.id === claimedFood.id ? claimedFood : f));
            setShowQuickClaim(false);
            setSelectedFood(null);
          }}
          onClose={() => {
            setShowQuickClaim(false);
            setSelectedFood(null);
          }}
        />
      )}

      {/* QR Code System Modal */}
      {qrMode && selectedFood && (
        <QRCodeSystem
          isOpen={true}
          onClose={() => {
            setQrMode(null);
            setSelectedFood(null);
          }}
          foodItem={selectedFood}
          mode={qrMode}
        />
      )}

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner
          isOpen={true}
          onClose={() => setShowQRScanner(false)}
          onScanSuccess={(scannedFood) => {
            setFoods(foods.map(f => f.id === scannedFood.id ? { ...f, status: 'completed' } : f));
            setShowQRScanner(false);
            showToast(`Pickup verified for ${scannedFood.name}`, 'success');
          }}
        />
      )}
    </div>
  );
}
