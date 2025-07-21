// src/components/VolunteerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaRecycle, FaHandHoldingHeart, FaClock, FaMapMarkerAlt, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';
import { GiMeal, GiFoodTruck, GiForkKnifeSpoon } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { 
  fetchAvailableListings, 
  setAvailableListings,
  updateFoodStatus 
} from '../features/food/foodSlice';
import { subscribeToAvailableListings, addPickupRequest } from '../firebase/food';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useRealTimeNotifications } from '../hooks/useRealTimeNotifications';

const VolunteerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { availableListings, status } = useSelector((state) => state.food);
  const [activeTab, setActiveTab] = useState('available');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Enable real-time notifications
  useRealTimeNotifications();
  
  const stats = [
    { value: '24', label: 'Meals Saved', icon: <GiMeal className="text-3xl text-emerald-600" />, color: "bg-emerald-100" },
    { value: '8', label: 'Pickups Completed', icon: <GiFoodTruck className="text-3xl text-amber-500" />, color: "bg-amber-100" },
    { value: '156', label: 'Pounds Rescued', icon: <FaRecycle className="text-3xl text-rose-500" />, color: "bg-rose-100" },
    { value: '98%', label: 'Satisfaction', icon: <FaLeaf className="text-3xl text-emerald-700" />, color: "bg-green-100" },
  ];
  
  const scheduledPickups = [
    { 
      id: 1, 
      restaurant: "Green Garden Cafe", 
      time: "Today, 3:00 PM", 
      location: "123 Main St, City", 
      items: ["Bread", "Vegetables", "Sandwiches"] 
    },
  ];
  
  const recentActivity = [
    { id: 1, action: "Picked up from Green Garden Cafe", time: "2 hours ago", items: ["Bread", "Vegetables"] },
    { id: 2, action: "Delivered to Community Center", time: "3 hours ago", items: ["Bread", "Vegetables"] },
    { id: 3, action: "Scheduled pickup with Pizza Paradise", time: "1 day ago", items: ["Pizza", "Salads"] },
    { id: 4, action: "Completed delivery to Shelter Home", time: "2 days ago", items: ["Sandwiches", "Fruits"] },
  ];

  // Set up real-time listener for available listings
  useEffect(() => {
    const unsubscribe = subscribeToAvailableListings((listings) => {
      dispatch(setAvailableListings(listings));
    });
    
    return () => unsubscribe();
  }, [dispatch]);

  const handleSchedulePickup = async (listing) => {
    if (!user) {
      toast.error('Please log in to schedule pickups');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Add pickup request
      await addPickupRequest(listing.id, {
        name: user.name || 'Volunteer',
        email: user.email
      });
      
      // Update listing status to 'pending'
      await dispatch(updateFoodStatus({ 
        id: listing.id, 
        status: 'pending' 
      })).unwrap();
      
      toast.success('Pickup scheduled successfully!');
    } catch (error) {
      toast.error('Failed to schedule pickup. Please try again.');
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <FaLeaf className="text-3xl" />
              <span className="text-2xl font-bold">SaveThePlate</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="font-medium">Volunteer Dashboard</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <span className="text-xl">V</span>
                  </div>
                  <span>{user?.name || 'Volunteer'}</span>
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
              <h1 className="text-4xl font-bold mb-2">Volunteer Dashboard</h1>
              <p className="text-xl">Thanks for helping rescue food and feed communities!</p>
            </div>
          </motion.div>
        </div>
      </header>
      
      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-emerald-800 mb-8">Your Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-2xl shadow-md ${stat.color} text-center`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold text-emerald-800">{stat.value}</div>
                <div className="text-lg text-emerald-700 font-medium mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Pickups Section */}
        <div className="mb-16">
          <div className="flex border-b border-emerald-200 mb-6">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-6 py-3 font-medium text-lg ${
                activeTab === 'available'
                  ? 'border-b-2 border-emerald-600 text-emerald-800'
                  : 'text-gray-500 hover:text-emerald-700'
              }`}
            >
              Available Pickups ({availableListings.length})
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`px-6 py-3 font-medium text-lg ${
                activeTab === 'scheduled'
                  ? 'border-b-2 border-emerald-600 text-emerald-800'
                  : 'text-gray-500 hover:text-emerald-700'
              }`}
            >
              My Scheduled Pickups
            </button>
          </div>
          
          {activeTab === 'available' ? (
            <>
              {status === 'loading' ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                  <p className="mt-4 text-emerald-700">Loading available pickups...</p>
                </div>
              ) : availableListings.length === 0 ? (
                <div className="text-center py-10">
                  <GiFoodTruck className="text-5xl mx-auto mb-4 text-amber-500" />
                  <h3 className="text-xl font-semibold text-emerald-800 mb-2">No Available Pickups</h3>
                  <p className="text-gray-600">Check back later for new food rescue opportunities</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableListings.map((listing) => {
                    const daysLeft = daysUntilExpiry(listing.expiry);
                    let statusColor = 'bg-green-100 text-green-800';
                    if (daysLeft < 0) statusColor = 'bg-red-100 text-red-800';
                    else if (daysLeft <= 2) statusColor = 'bg-amber-100 text-amber-800';

                    return (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-emerald-800">
                              {listing.restaurantName || 'Restaurant'}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
                              {daysLeft >= 0 ? `${daysLeft} days left` : 'Expired'}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-emerald-700 mb-3">
                            <FaClock className="mr-2" />
                            <span>Expires: {formatDate(listing.expiry)}</span>
                          </div>
                          
                          <div className="flex items-center text-emerald-700 mb-4">
                            <FaMapMarkerAlt className="mr-2" />
                            <span>{listing.location || 'Location not specified'}</span>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="font-medium text-emerald-700 mb-2">Items Available:</h4>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-sm">
                                {listing.name}
                              </span>
                              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-sm">
                                {listing.category}
                              </span>
                              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-sm">
                                {listing.quantity}
                              </span>
                            </div>
                            {listing.description && (
                              <p className="text-sm text-emerald-600 mt-2">{listing.description}</p>
                            )}
                          </div>
                          
                          <button 
                            onClick={() => handleSchedulePickup(listing)}
                            disabled={isSubmitting || daysLeft < 0}
                            className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? 'Scheduling...' : (daysLeft < 0 ? 'Expired' : 'Schedule Pickup')}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              {scheduledPickups.length === 0 ? (
                <div className="text-center py-10">
                  <GiFoodTruck className="text-5xl mx-auto mb-4 text-amber-500" />
                  <h3 className="text-xl font-semibold text-emerald-800 mb-2">No Pickups Scheduled</h3>
                  <p className="text-gray-600">Browse available pickups to schedule your next food rescue mission</p>
                </div>
              ) : (
                scheduledPickups.map((pickup) => (
                  <motion.div
                    key={pickup.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-emerald-800">{pickup.restaurant}</h3>
                        <div className="flex items-center text-emerald-700">
                          <FaClock className="mr-2" />
                          <span>{pickup.time}</span>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                          Reschedule
                        </button>
                        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                          Start Pickup
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-emerald-700 mb-4">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{pickup.location}</span>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-emerald-700 mb-2">Items to Collect:</h4>
                      <div className="flex flex-wrap gap-2">
                        {pickup.items.map((item, i) => (
                          <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-sm">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
        
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-16"
        >
          <h2 className="text-2xl font-bold text-emerald-800 mb-6">Recent Activity</h2>
          
          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-l-4 border-emerald-500 pl-4 py-2"
              >
                <div className="flex justify-between">
                  <h3 className="font-bold text-emerald-800">{activity.action}</h3>
                  <span className="text-sm text-emerald-600">{activity.time}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activity.items.map((item, i) => (
                    <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
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

export default VolunteerDashboard;