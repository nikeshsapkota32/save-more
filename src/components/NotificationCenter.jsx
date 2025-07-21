// src/components/NotificationCenter.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaInfoCircle, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useNotifications } from '../context/NotificationContext';

const NotificationCenter = () => {
  const { notifications, removeNotification } = useNotifications();
  
  const getIcon = (type) => {
    switch(type) {
      case 'info': return <FaInfoCircle className="text-blue-500" />;
      case 'warning': return <FaExclamationTriangle className="text-yellow-500" />;
      case 'success': return <FaCheckCircle className="text-green-500" />;
      default: return <FaInfoCircle className="text-blue-500" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="bg-white rounded-lg shadow-lg border-l-4 border-blue-500 w-80"
          >
            <div className="p-4 flex items-start">
              <div className="mr-3 mt-1">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{notification.title}</h4>
                <p className="text-sm text-gray-600">{notification.message}</p>
              </div>
              <button 
                onClick={() => removeNotification(notification.id)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;