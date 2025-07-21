import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaUtensils, FaHandHoldingHeart, FaUserCircle, FaBell } from 'react-icons/fa';

const Navbar = () => {
  const user = null; // Change to {} to see logged-in state

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className="flex items-center space-x-2 group">
                <FaLeaf className="h-8 w-8 text-emerald-600 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                  SaveThePlate
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 ml-10">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-medium shadow-inner'
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                }`
              }
            >
              <span>Home</span>
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-medium shadow-inner'
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                    }`
                  }
                >
                  <FaUtensils className="text-emerald-500" />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink
                  to="/food"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-medium shadow-inner'
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                    }`
                  }
                >
                  <FaHandHoldingHeart className="text-amber-500" />
                  <span>Food Listings</span>
                </NavLink>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-4"
              >
                <button className="p-1 rounded-full text-gray-700 hover:text-emerald-600 relative">
                  <FaBell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </button>

                <div className="flex items-center space-x-2">
                  <FaUserCircle className="h-8 w-8 text-emerald-600" />
                  <span className="hidden md:inline text-gray-700 font-medium">
                    Hi, User
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-lg hover:shadow-md transition-all duration-200"
                >
                  Logout
                </motion.button>
              </motion.div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="px-4 py-2 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-200"
                  >
                    Login
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:shadow-md hover:from-emerald-600 hover:to-green-600 transition-all duration-200"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;