// src/pages/FoodDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GiFoodTruck, GiCook, GiSandsOfTime } from 'react-icons/gi';
import { FaCalendarAlt, FaMapMarkerAlt, FaUserAlt, FaAllergies, FaBoxOpen } from 'react-icons/fa';
import { format } from 'date-fns';
import Map from '../components/Map';
import Chat from '../components/Chat';
import VolunteerList from '../components/VolunteerList';

const FoodDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foodItem, setFoodItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  useEffect(() => {
    // Simulate fetching food item from API
    setTimeout(() => {
      setFoodItem({
        id,
        name: 'Fresh Vegetables',
        type: 'Vegetables',
        quantity: '5 kg',
        description: 'Assorted fresh vegetables including carrots, broccoli, and bell peppers. Harvested today and in perfect condition.',
        allergens: 'None',
        expiry: '2023-06-15',
        preparationTime: 'Afternoon (12pm-5pm)',
        status: 'available',
        imageUrl: '/food-vegetables.jpg',
        location: { lat: 51.5074, lng: -0.1278 } // London coordinates
      });
      setLoading(false);
    }, 800);
  }, [id]);

  const handleReserve = () => {
    // Reservation logic
    alert('Food item reserved! A volunteer will contact you soon.');
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.button
        onClick={() => navigate(-1)}
        className="flex items-center text-primary-600 hover:text-primary-800 mb-4"
        whileHover={{ x: -5 }}
      >
        ← Back to Listings
      </motion.button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {foodItem.imageUrl ? (
              <img 
                src={foodItem.imageUrl} 
                alt={foodItem.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-64 md:h-full bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
          
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold">{foodItem.name}</h1>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {foodItem.status}
              </span>
            </div>
            
            <p className="text-gray-600 mb-6">{foodItem.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <GiFoodTruck className="text-primary-500 mr-2" />
                <span>Type: {foodItem.type}</span>
              </div>
              <div className="flex items-center">
                <GiCook className="text-primary-500 mr-2" />
                <span>Quantity: {foodItem.quantity}</span>
              </div>
              <div className="flex items-center">
                <GiSandsOfTime className="text-primary-500 mr-2" />
                <span>Expiry: {format(new Date(foodItem.expiry), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="text-primary-500 mr-2" />
                <span>Pickup: {foodItem.preparationTime}</span>
              </div>
              <div className="flex items-center">
                <FaAllergies className="text-primary-500 mr-2" />
                <span>Allergens: {foodItem.allergens || 'None'}</span>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-8">
              {foodItem.status === 'available' && (
                <motion.button
                  onClick={handleReserve}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reserve Now
                </motion.button>
              )}
              <button className="px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                Share Listing
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-6">
          <div className="flex border-b">
            <button
              className={`px-4 py-3 font-medium ${activeTab === 'details' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`px-4 py-3 font-medium ${activeTab === 'location' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('location')}
            >
              Location
            </button>
            <button
              className={`px-4 py-3 font-medium ${activeTab === 'volunteers' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('volunteers')}
            >
              Volunteers
            </button>
            <button
              className={`px-4 py-3 font-medium ${activeTab === 'chat' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Details</h3>
                <p><strong>Storage Instructions:</strong> Keep refrigerated at 4°C until pickup.</p>
                <p><strong>Special Notes:</strong> Please bring reusable containers if possible.</p>
                <p><strong>Restaurant Contact:</strong> Green Bistro - 555-1234</p>
              </div>
            )}
            
            {activeTab === 'location' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Pickup Location</h3>
                <div className="flex items-center mb-4">
                  <FaMapMarkerAlt className="text-red-500 mr-2" />
                  <span>123 Green Street, London, UK</span>
                </div>
                <div className="h-96 rounded-lg overflow-hidden">
                  <Map locations={[foodItem.location]} />
                </div>
              </div>
            )}
            
            {activeTab === 'volunteers' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Available Volunteers</h3>
                <VolunteerList 
                  onSelect={setSelectedVolunteer} 
                  selectedId={selectedVolunteer?.id}
                />
              </div>
            )}
            
            {activeTab === 'chat' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {selectedVolunteer 
                    ? `Chat with ${selectedVolunteer.name}` 
                    : 'Select a volunteer to chat'}
                </h3>
                {selectedVolunteer ? (
                  <Chat volunteerId={selectedVolunteer.id} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Please select a volunteer from the Volunteers tab to start chatting
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailPage;