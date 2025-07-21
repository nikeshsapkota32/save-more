// src/pages/HomePage.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaLeaf, 
  FaRecycle, 
  FaHandHoldingHeart, 
  FaAppleAlt,
  FaHamburger,
  FaPizzaSlice,
  FaIceCream,
  FaDrumstickBite,
  FaFish,
  FaBreadSlice,
  FaCarrot,
  FaUtensils,
  FaUsers
} from 'react-icons/fa';
import { 
  GiMeal, 
  GiFruitBowl, 
  GiSlicedBread,
  GiMeat,
  GiSandwich,
  GiCakeSlice,
  GiFoodTruck,
  GiForkKnifeSpoon,
  GiFruitTree,
  GiCycle
} from 'react-icons/gi';
import DarkModeToggle from '../components/DarkModeToggle';

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);

  // Floating food items for the hero section
  const floatingFood = [
    { icon: <FaAppleAlt className="text-red-500" />, position: { x: 10, y: 20 }, delay: 0.1 },
    { icon: <FaHamburger className="text-yellow-800" />, position: { x: 90, y: 30 }, delay: 0.3 },
    { icon: <FaPizzaSlice className="text-yellow-500" />, position: { x: 20, y: 70 }, delay: 0.5 },
    { icon: <FaIceCream className="text-pink-300" />, position: { x: 80, y: 60 }, delay: 0.7 },
    { icon: <FaDrumstickBite className="text-amber-700" />, position: { x: 40, y: 40 }, delay: 0.9 },
    { icon: <FaFish className="text-blue-400" />, position: { x: 60, y: 20 }, delay: 1.1 },
    { icon: <FaBreadSlice className="text-yellow-700" />, position: { x: 30, y: 60 }, delay: 1.3 },
    { icon: <FaCarrot className="text-orange-500" />, position: { x: 70, y: 50 }, delay: 1.5 },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden min-h-[80vh] flex items-center bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Floating food background */}
        {floatingFood.map((food, index) => (
          <motion.div
            key={index}
            className="absolute text-3xl"
            style={{ 
              left: `${food.position.x}%`,
              top: `${food.position.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0],
              y: [0, -30, 0],
              rotate: [0, 15, 0, -15, 0]
            }}
            transition={{ 
              duration: 8,
              delay: food.delay,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            {food.icon}
          </motion.div>
        ))}
        
        <div className="container mx-auto flex flex-col md:flex-row items-center relative z-10">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-emerald-700">Rescue Food,</span> <span className="text-amber-600">Nourish Lives</span>
            </h1>
            <p className="text-xl text-emerald-800 mb-8 max-w-lg">
              Transforming surplus food from restaurants into meals for communities in need through our network of dedicated volunteers.
            </p>
            <div className="flex flex-wrap gap-4">
              {user ? (
                <Link 
                  to="/dashboard" 
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-full hover:opacity-90 transition-all text-lg shadow-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to="/register" 
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-full hover:opacity-90 transition-all text-lg shadow-lg"
                    >
                      Join the Movement
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to="/login" 
                      className="px-6 py-3 border-2 border-emerald-600 text-emerald-700 rounded-full hover:bg-emerald-50 transition-colors text-lg font-medium"
                    >
                      Volunteer Login
                    </Link>
                  </motion.div>
                </>
              )}
              <DarkModeToggle />
            </div>
          </motion.div>
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Circular Food Flow Animation */}
            <div className="relative w-full h-[400px] flex items-center justify-center">
              {/* Circular path */}
              <motion.div 
                className="absolute w-[300px] h-[300px] rounded-full border-4 border-dashed border-emerald-300"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Arrow animation */}
              <motion.div
                className="absolute w-[300px] h-[300px] rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <motion.div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-emerald-500"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              </motion.div>
              
              {/* Restaurant section */}
              <motion.div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-xl border-4 border-emerald-500 flex flex-col items-center"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <FaUtensils className="text-4xl text-emerald-600" />
                <span className="mt-2 text-sm font-bold text-emerald-700">Restaurant</span>
              </motion.div>
              
              {/* Volunteer section */}
              <motion.div 
                className="absolute bottom-0 left-0 bg-white p-4 rounded-full shadow-xl border-4 border-amber-400 flex flex-col items-center"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, -5, 0, 5, 0]
                }}
                transition={{ 
                  duration: 4,
                  delay: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <FaHandHoldingHeart className="text-4xl text-amber-500" />
                <span className="mt-2 text-sm font-bold text-amber-600">Volunteer</span>
              </motion.div>
              
              {/* Community section */}
              <motion.div 
                className="absolute bottom-0 right-0 bg-white p-4 rounded-full shadow-xl border-4 border-rose-400 flex flex-col items-center"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  delay: 1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <FaUsers className="text-4xl text-rose-500" />
                <span className="mt-2 text-sm font-bold text-rose-600">Community</span>
              </motion.div>
              
              {/* Moving food items */}
              <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <motion.div
                  className="text-3xl"
                  animate={{ 
                    rotate: -360,
                    y: [0, -10, 0]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <FaAppleAlt className="text-red-500" />
                </motion.div>
              </motion.div>
              
              <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 12,
                  delay: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <motion.div
                  className="text-3xl"
                  animate={{ 
                    rotate: -360,
                    y: [0, -15, 0]
                  }}
                  transition={{ 
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <GiSandwich className="text-amber-500" />
                </motion.div>
              </motion.div>
              
              <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{ 
                  rotate: 360,
                  scale: [1, 0.9, 1]
                }}
                transition={{ 
                  duration: 10,
                  delay: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <motion.div
                  className="text-3xl"
                  animate={{ 
                    rotate: -360,
                    y: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <FaDrumstickBite className="text-amber-700" />
                </motion.div>
              </motion.div>
              
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <GiCycle className="text-5xl text-emerald-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-emerald-700 mb-2">Food Rescue</div>
                  <div className="w-16 h-1 bg-emerald-500 mx-auto mb-3"></div>
                  <div className="text-emerald-600 font-medium">From Waste to Plate</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-emerald-800 mb-4">How SaveThePlate Works</h2>
            <div className="w-24 h-1 bg-emerald-500 mx-auto"></div>
            <p className="text-xl text-emerald-700 mt-6 max-w-2xl mx-auto">
              Our circular system connects surplus food with communities in need through dedicated volunteers
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Surplus Food Listing",
                description: "Restaurants easily list their surplus food with details like quantity and pickup time.",
                icon: <FaLeaf className="text-4xl text-emerald-600" />,
              },
              {
                title: "Volunteer Connection",
                description: "Our system matches with nearby volunteers who can pick up and distribute food.",
                icon: <FaHandHoldingHeart className="text-4xl text-amber-500" />,
              },
              {
                title: "Community Distribution",
                description: "Food reaches communities in need, reducing waste and hunger simultaneously.",
                icon: <FaRecycle className="text-4xl text-rose-500" />,
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-b from-white to-emerald-50 p-8 rounded-2xl shadow-lg border border-emerald-100 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <motion.div 
                  className="bg-emerald-100 p-4 rounded-full mb-6"
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-emerald-800 mb-4">{feature.title}</h3>
                <p className="text-lg text-emerald-700">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-50 to-amber-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-emerald-800 mb-4">Our Impact</h2>
            <div className="w-24 h-1 bg-emerald-500 mx-auto"></div>
            <p className="text-xl text-emerald-700 mt-6 max-w-2xl mx-auto">
              Join thousands making a difference in their communities
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: '24K+', label: 'Meals Saved', icon: <GiMeal className="text-4xl text-emerald-600" />, color: "bg-emerald-100" },
              { value: '156+', label: 'Restaurants', icon: <GiForkKnifeSpoon className="text-4xl text-amber-500" />, color: "bg-amber-100" },
              { value: '42K+', label: 'Volunteers', icon: <FaHandHoldingHeart className="text-4xl text-rose-500" />, color: "bg-rose-100" },
              { value: '98%', label: 'Satisfaction', icon: <GiFruitBowl className="text-4xl text-emerald-700" />, color: "bg-green-100" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-2xl shadow-md ${stat.color} text-center`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold text-emerald-800">{stat.value}</div>
                <div className="text-lg text-emerald-700 font-medium mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center bg-gradient-to-r from-emerald-600 to-green-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to make a difference?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our network of restaurants and volunteers fighting food waste in your community.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link 
                to={user ? "/dashboard" : "/register"} 
                className="inline-block px-8 py-4 bg-white text-emerald-700 font-bold rounded-full hover:bg-emerald-50 transition-colors text-lg shadow-lg"
              >
                {user ? "Go to Dashboard" : "Join Now - It's Free"}
              </Link>
            </motion.div>
            <div className="mt-8 text-emerald-100">
              Already part of the movement?{' '}
              <Link to="/login" className="font-bold underline hover:text-white">
                Sign in here
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;