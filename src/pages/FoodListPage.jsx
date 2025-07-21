import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaCalendarAlt, FaBoxOpen } from 'react-icons/fa';
import { 
  GiFruitBowl, 
  GiMeal, 
  GiFoodTruck, 
  GiWeight, 
  GiSandsOfTime 
} from 'react-icons/gi';
import { format } from 'date-fns';

const FoodListPage = () => {
  const dispatch = useDispatch();
  const { listings, status } = useSelector((state) => state.food);
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data if Redux isn't set up yet
  const mockListings = [
    {
      id: '1',
      name: 'Fresh Vegetables',
      type: 'Vegetables',
      quantity: '5 kg',
      description: 'Assorted fresh vegetables',
      expiry: '2023-12-31',
      status: 'available',
      imageUrl: '/placeholder-vegetables.jpg'
    },
    {
      id: '2',
      name: 'Bakery Items',
      type: 'Bread',
      quantity: '20 pieces',
      description: 'Day-old bread and pastries',
      expiry: '2023-12-15',
      status: 'available',
      imageUrl: '/placeholder-bread.jpg'
    }
  ];

  useEffect(() => {
    // Replace with actual API call when ready
    // dispatch(fetchFoodListings());
  }, [dispatch]);

  const filteredListings = mockListings.filter(listing => {
    const matchesFilter = filter === 'all' || listing.status === filter;
    const matchesSearch = listing.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'picked-up': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-green-700">Food Listings</h1>
        <p className="text-green-600">Manage your surplus food listings</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div className="flex flex-wrap gap-2">
          {['all', 'available', 'reserved', 'picked-up'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-md capitalize ${
                filter === filterType 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {filterType.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search food..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
        </div>

        <Link
          to="/food/add"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors whitespace-nowrap flex items-center"
        >
          <FaPlus className="mr-2" /> Add Listing
        </Link>
      </motion.div>

      {status === 'loading' ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredListings.map((listing) => (
            <motion.div
              key={listing.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-green-100"
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {listing.imageUrl ? (
                  <img 
                    src={listing.imageUrl} 
                    alt={listing.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <GiMeal className="text-5xl text-gray-400" />
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{listing.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(listing.status)}`}>
                    {listing.status.replace('-', ' ')}
                  </span>
                </div>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <GiFoodTruck className="mr-2 text-green-500" />
                    <span>Type: {listing.type}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <GiWeight className="mr-2 text-green-500" />
                    <span>Quantity: {listing.quantity}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <GiSandsOfTime className="mr-2 text-green-500" />
                    <span>Expiry: {format(new Date(listing.expiry), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <Link
                    to={`/food/${listing.id}`}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    View Details
                  </Link>
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${
                      listing.status === 'available' 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-200 cursor-not-allowed'
                    }`}
                    disabled={listing.status !== 'available'}
                  >
                    {listing.status === 'available' ? 'Reserve' : 'Reserved'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FoodListPage;