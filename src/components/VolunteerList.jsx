// src/components/VolunteerList.jsx
import { motion } from 'framer-motion';
import { FaStar, FaRegStar, FaCheckCircle } from 'react-icons/fa';

const VolunteerList = ({ onSelect, selectedId }) => {
  // Mock volunteer data
  const volunteers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      rating: 4.8,
      completed: 42,
      distance: 1.2,
      available: true
    },
    {
      id: '2',
      name: 'Michael Chen',
      rating: 4.9,
      completed: 67,
      distance: 0.8,
      available: true
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      rating: 4.7,
      completed: 35,
      distance: 2.1,
      available: false
    },
    {
      id: '4',
      name: 'David Smith',
      rating: 4.6,
      completed: 28,
      distance: 1.5,
      available: true
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaRegStar key="half" className="text-yellow-400" />);
    }
    
    const remaining = 5 - stars.length;
    for (let i = 0; i < remaining; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="space-y-4">
      {volunteers.map((volunteer) => (
        <motion.div
          key={volunteer.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(volunteer)}
          className={`p-4 border rounded-lg cursor-pointer transition-all ${
            selectedId === volunteer.id 
              ? 'border-primary-600 bg-primary-50' 
              : 'border-gray-200 hover:border-primary-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mr-4" />
              <div>
                <div className="flex items-center">
                  <h4 className="font-semibold">{volunteer.name}</h4>
                  {volunteer.available && (
                    <FaCheckCircle className="ml-2 text-green-500" />
                  )}
                </div>
                <div className="flex items-center mt-1">
                  {renderStars(volunteer.rating)}
                  <span className="ml-2 text-gray-600">({volunteer.completed})</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-600">{volunteer.distance} km away</div>
              {!volunteer.available && (
                <div className="text-red-500 text-sm mt-1">Unavailable</div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default VolunteerList;