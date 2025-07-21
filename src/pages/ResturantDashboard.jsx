// src/components/RestaurantDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaClock, FaMapMarkerAlt, FaLeaf, FaSignOutAlt, FaUtensils } from 'react-icons/fa';
import { GiMeal, GiFoodTruck, GiFruitBowl } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { 
  fetchRestaurantListings, 
  addFoodListing, 
  updateFoodStatus, 
  deleteFoodListing,
  setRestaurantListings 
} from '../features/food/foodSlice';
import { subscribeToRestaurantListings } from '../firebase/food';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ImpactStats from '../components/ImpactStats';

const RestaurantDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { restaurantListings, status } = useSelector((state) => state.food);
  
  // Safe access to user properties
  const restaurantName = user?.restaurantName || "Your Restaurant";
  const location = user?.location || "123 Main St, City";
  const email = user?.email || "restaurant@example.com";
  
  const [newFoodItem, setNewFoodItem] = useState({
    name: '',
    category: 'Main Course',
    quantity: '',
    expiry: '',
    description: ''
  });
  
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set up real-time listener for restaurant listings
  useEffect(() => {
    if (user?.id) {
      const unsubscribe = subscribeToRestaurantListings(user.id, (listings) => {
        dispatch(setRestaurantListings(listings));
      });
      
      return () => unsubscribe();
    }
  }, [user?.id, dispatch]);

  const handleAddFoodItem = async () => {
    if (!newFoodItem.name || !newFoodItem.quantity || !newFoodItem.expiry) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (editItem) {
        // Update existing item
        await dispatch(updateFoodStatus({ 
          id: editItem.id, 
          status: 'available' 
        })).unwrap();
        toast.success('Food item updated successfully!');
      } else {
        // Add new item
        await dispatch(addFoodListing({ 
          foodData: newFoodItem, 
          userId: user.id 
        })).unwrap();
        toast.success('Food item added successfully!');
      }
      
      // Reset form
      setNewFoodItem({
        name: '',
        category: 'Main Course',
        quantity: '',
        expiry: '',
        description: ''
      });
      setEditItem(null);
      setShowFoodModal(false);
    } catch (error) {
      toast.error('Failed to save food item. ' + (error?.message || JSON.stringify(error) || 'Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setNewFoodItem({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      expiry: item.expiry,
      description: item.description || ''
    });
    setShowFoodModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await dispatch(deleteFoodListing(id)).unwrap();
        toast.success('Food item deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete food item. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Calculate days until expiry
  const daysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const upcomingPickups = [
    { 
      id: 1, 
      volunteer: "Sarah Johnson", 
      time: "Today, 3:00 PM", 
      location: "123 Main St, City", 
      items: ["Bread", "Vegetables", "Sandwiches"],
      status: "Scheduled"
    },
    { 
      id: 2, 
      volunteer: "Michael Chen", 
      time: "Tomorrow, 11:00 AM", 
      location: "456 Oak Ave, City", 
      items: ["Pizza", "Salads", "Desserts"],
      status: "Confirmed"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50">
      {/* Add Food Modal */}
      {showFoodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-emerald-800">
                {editItem ? "Edit Food Item" : "Add New Food Item"}
              </h3>
              <button 
                onClick={() => setShowFoodModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Name *</label>
                <input
                  type="text"
                  value={newFoodItem.name}
                  onChange={(e) => setNewFoodItem({...newFoodItem, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., Fresh Bread, Vegetables"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={newFoodItem.category}
                  onChange={(e) => setNewFoodItem({...newFoodItem, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="Main Course">Main Course</option>
                  <option value="Appetizers">Appetizers</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Produce">Produce</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Prepared Meals">Prepared Meals</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <input
                  type="text"
                  value={newFoodItem.quantity}
                  onChange={(e) => setNewFoodItem({...newFoodItem, quantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., 5 bags, 10 lbs, 8 servings"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                <input
                  type="date"
                  value={newFoodItem.expiry}
                  onChange={(e) => setNewFoodItem({...newFoodItem, expiry: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newFoodItem.description}
                  onChange={(e) => setNewFoodItem({...newFoodItem, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Additional details about the food item..."
                  rows="3"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddFoodItem}
                disabled={isSubmitting}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-70"
              >
                {isSubmitting ? 'Saving...' : (editItem ? "Update Food Item" : "Add to Inventory")}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <FaLeaf className="text-3xl" />
              <span className="text-2xl font-bold">SaveThePlate</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="font-medium">Restaurant Dashboard</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <FaUtensils className="text-xl" />
                  </div>
                  <span className="max-w-xs truncate">{restaurantName}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-emerald-200 hover:text-white transition-colors"
                  title="Logout"
                >
                  <FaSignOutAlt className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Dashboard Header */}
      <header className="py-12 bg-gradient-to-r from-emerald-500 to-green-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-center"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">Restaurant Dashboard</h1>
              <p className="text-xl">Manage your food donations and schedule pickups</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditItem(null);
                setNewFoodItem({
                  name: '',
                  category: 'Main Course',
                  quantity: '',
                  expiry: '',
                  description: ''
                });
                setShowFoodModal(true);
              }}
              className="mt-4 md:mt-0 px-6 py-3 bg-white text-emerald-700 font-bold rounded-full hover:bg-emerald-50 transition-colors shadow-lg flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Food Item
            </motion.button>
          </motion.div>
        </div>
      </header>
      
      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Food Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-emerald-800">Food Inventory</h2>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                {restaurantListings.length} items
              </span>
            </div>
            
            {status === 'loading' ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="mt-4 text-emerald-700">Loading food items...</p>
              </div>
            ) : restaurantListings.length === 0 ? (
              <div className="text-center py-8 text-emerald-700">
                <GiFruitBowl className="text-5xl mx-auto mb-4 text-emerald-500" />
                <p className="text-lg">No food items added yet</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFoodModal(true)}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Add Your First Food Item
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                {restaurantListings.map((item) => {
                  const daysLeft = daysUntilExpiry(item.expiry);
                  let statusColor = 'bg-green-100 text-green-800';
                  if (daysLeft < 0) statusColor = 'bg-red-100 text-red-800';
                  else if (daysLeft <= 2) statusColor = 'bg-amber-100 text-amber-800';
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-emerald-100 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-emerald-800">{item.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
                            {daysLeft >= 0 ? `${daysLeft} days left` : 'Expired'}
                          </span>
                        </div>
                        <p className="text-emerald-700 text-sm mt-1">
                          {item.category} • {item.quantity}
                        </p>
                        {item.description && (
                          <p className="text-xs text-emerald-600 mt-1">{item.description}</p>
                        )}
                        <p className="text-xs text-emerald-600 mt-1">
                          Expiry: {formatDate(item.expiry)}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-emerald-600 hover:text-emerald-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-rose-600 hover:text-rose-800"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
          
          {/* Upcoming Pickups */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-emerald-800">Upcoming Pickups</h2>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                {upcomingPickups.length} scheduled
              </span>
            </div>
            
            {upcomingPickups.length === 0 ? (
              <div className="text-center py-8 text-emerald-700">
                <GiFoodTruck className="text-5xl mx-auto mb-4 text-amber-500" />
                <p className="text-lg">No upcoming pickups scheduled</p>
                <p className="text-emerald-600 mt-2">Add food items to enable pickup scheduling</p>
              </div>
            ) : (
              <div className="space-y-6">
                {upcomingPickups.map((pickup) => (
                  <motion.div
                    key={pickup.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-emerald-100 rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-emerald-800 mb-1">
                          {pickup.volunteer}
                        </h3>
                        <div className="flex items-center text-emerald-700 mb-2">
                          <FaClock className="mr-2" />
                          <span>{pickup.time}</span>
                        </div>
                        <div className="flex items-center text-emerald-700">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>{pickup.location}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        pickup.status === "Scheduled" ? "bg-emerald-100 text-emerald-800" :
                        pickup.status === "Confirmed" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {pickup.status}
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-emerald-700 mb-2">Items to Collect:</h4>
                      <div className="flex flex-wrap gap-2">
                        {pickup.items.map((item, i) => (
                          <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-sm">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-3">
                      <button className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors text-sm">
                        Contact
                      </button>
                      <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                        Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Restaurant Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-16"
        >
          <h2 className="text-2xl font-bold text-emerald-800 mb-6">Restaurant Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-emerald-700 mb-2">Restaurant Name</h3>
              <p className="text-emerald-800 text-xl">{restaurantName}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-emerald-700 mb-2">Location</h3>
              <p className="text-emerald-800">{location}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-emerald-700 mb-2">Contact Email</h3>
              <p className="text-emerald-800">{email}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-emerald-700 mb-2">Status</h3>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
          </div>
        </motion.div>
        
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-emerald-800 mb-8">Your Impact</h2>
          <ImpactStats listings={restaurantListings} />
        </motion.div>
      </div>
      
      {/* Footer */}
      <footer className="py-8 bg-gradient-to-r from-emerald-700 to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FaLeaf className="text-3xl" />
              <span className="text-2xl font-bold">SaveThePlate</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-emerald-300">About</a>
              <a href="#" className="hover:text-emerald-300">Contact</a>
              <a href="#" className="hover:text-emerald-300">FAQ</a>
              <a href="#" className="hover:text-emerald-300">Privacy</a>
            </div>
          </div>
          <p className="text-emerald-200">© 2025 SaveThePlate. Join our mission to reduce food waste and feed communities.</p>
        </div>
      </footer>
    </div>
  );
};

export default RestaurantDashboard;