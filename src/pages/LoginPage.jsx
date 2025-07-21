// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaLeaf } from 'react-icons/fa';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'volunteer'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on role
      let userData;
      if (formData.role === 'restaurant_owner') {
        userData = {
          id: 'rest123',
          email: formData.email,
          role: 'restaurant_owner',
          restaurantName: 'Green Garden Cafe',
          location: '123 Main St, City'
        };
      } else {
        userData = {
          id: 'vol123',
          email: formData.email,
          role: 'volunteer',
          name: 'John Doe',
          completedPickups: 24
        };
      }

       dispatch(login(userData));
  
  // NEW: Redirect based on role
  const targetPath = formData.role === 'restaurant_owner' 
    ? '/restaurant' 
    : '/volunteer';
  
  navigate(targetPath, { replace: true });
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FaLeaf className="text-5xl text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue your food rescue mission</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Email *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-500" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Password *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-500" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Login As *</label>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => setFormData({ ...formData, role: 'volunteer' })}
                className={`py-3 rounded-lg transition-colors ${
                  formData.role === 'volunteer' 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Volunteer
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => setFormData({ ...formData, role: 'restaurant_owner' })}
                className={`py-3 rounded-lg transition-colors ${
                  formData.role === 'restaurant_owner' 
                    ? 'bg-amber-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Restaurant Owner
              </motion.button>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg disabled:opacity-70"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </motion.button>
          
          <div className="mt-4 text-center text-gray-600 text-sm">
            Don't have an account? <Link to="/register" className="text-emerald-600 hover:underline">Sign up</Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;