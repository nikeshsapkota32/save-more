// src/pages/HowItWorksPage.jsx
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
  FaSearch, 
  FaHandHoldingHeart, 
  FaClock, 
  FaCheckCircle,
  FaAppleAlt,
  FaHamburger,
  FaPizzaSlice,
  FaIceCream,
  FaBreadSlice,
  FaDrumstickBite
} from 'react-icons/fa';
import { GiFoodTruck, GiReceiveMoney, GiFruitBowl, GiGrapes } from 'react-icons/gi';

const FloatingFoodItem = ({ icon, position, delay }) => {
  return (
    <motion.div
      initial={{ y: position.y - 100, opacity: 0 }}
      animate={{ 
        y: [position.y, position.y - 15, position.y],
        opacity: [0, 1, 1]
      }}
      transition={{ 
        duration: 8,
        delay: delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
      className="absolute text-primary-400 opacity-80"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      {icon}
    </motion.div>
  );
};

const HowItWorksPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Food icons for animation
  const foodIcons = [
    { icon: <FaAppleAlt className="text-3xl" /> },
    { icon: <FaHamburger className="text-3xl" /> },
    { icon: <FaPizzaSlice className="text-3xl" /> },
    { icon: <FaIceCream className="text-3xl" /> },
    { icon: <FaBreadSlice className="text-3xl" /> },
    { icon: <FaDrumstickBite className="text-3xl" /> },
    { icon: <GiFruitBowl className="text-3xl" /> },
    { icon: <GiGrapes className="text-3xl" /> },
  ];

  // Generate random positions for food items
  const getRandomPositions = (count) => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      positions.push({
        x: Math.random() * 80 + 10, // 10-90%
        y: Math.random() * 50 + 25, // 25-75%
      });
    }
    return positions;
  };

  const foodPositions = getRandomPositions(foodIcons.length);

  const steps = [
    {
      icon: <FaSearch className="text-4xl text-primary-500" />,
      title: "1. Discover Surplus Food",
      description: "Restaurants and food businesses list their surplus food on our platform with details about quantity, type, and pickup time."
    },
    {
      icon: <FaHandHoldingHeart className="text-4xl text-primary-500" />,
      title: "2. Claim the Food",
      description: "Volunteers browse available listings and claim food they can pick up and deliver to communities in need."
    },
    {
      icon: <GiFoodTruck className="text-4xl text-primary-500" />,
      title: "3. Pick Up & Deliver",
      description: "Volunteers pick up the food at the scheduled time and deliver it to designated community centers or individuals."
    },
    {
      icon: <FaCheckCircle className="text-4xl text-primary-500" />,
      title: "4. Food Reaches Those in Need",
      description: "Community organizations distribute the food to people who need it, ensuring nothing goes to waste."
    }
  ];

  const benefits = [
    {
      icon: <GiReceiveMoney className="text-4xl text-primary-500" />,
      title: "For Restaurants",
      description: "Reduce waste disposal costs, receive tax benefits, and build community goodwill."
    },
    {
      icon: <FaHandHoldingHeart className="text-4xl text-primary-500" />,
      title: "For Volunteers",
      description: "Make a direct impact in your community with flexible commitment options."
    },
    {
      icon: <FaClock className="text-4xl text-primary-500" />,
      title: "For Communities",
      description: "Access fresh, nutritious food that would otherwise go to waste."
    }
  ];

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Hero Section with Floating Food Animation */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 py-20 min-h-[60vh] flex items-center overflow-hidden">
        {/* Floating Food Animation */}
        <div className="absolute inset-0">
          {foodIcons.map((food, index) => (
            <FloatingFoodItem 
              key={index}
              icon={food.icon}
              position={foodPositions[index]}
              delay={index * 0.5}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-500"
          >
            How SaveThePlate Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl max-w-3xl mx-auto text-gray-500 mb-10"
          >
            Our simple process connects surplus food with communities in need through a network of dedicated volunteers.
          </motion.p>
          
          {/* Animated Plate */}
          <motion.div 
            className="mx-auto w-48 h-48 rounded-full border-4 border-primary-300 relative"
            initial={{ scale: 0, opacity: 0 }}
            animate={isVisible ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          >
            {/* Food items inside the plate */}
            <motion.div 
              className="absolute top-6 left-10"
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
                y: [0, -5, 0, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <FaAppleAlt className="text-4xl text-red-400" />
            </motion.div>
            
            <motion.div 
              className="absolute top-16 right-10"
              animate={{ 
                rotate: [0, -8, 0, 8, 0],
                y: [0, -3, 0, -3, 0]
              }}
              transition={{ 
                duration: 5,
                delay: 0.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <FaPizzaSlice className="text-4xl text-yellow-400" />
            </motion.div>
            
            <motion.div 
              className="absolute bottom-10 left-14"
              animate={{ 
                rotate: [0, 5, 0, -5, 0],
                y: [0, -2, 0, -2, 0]
              }}
              transition={{ 
                duration: 6,
                delay: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <FaDrumstickBite className="text-4xl text-orange-300" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">Simple Steps to Reduce Food Waste</h2>
            <p className="text-lg text-gray-700">
              From listing surplus food to delivering it to those in need, here's how our platform works
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg shadow-md text-center flex flex-col hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-primary-700 mb-4">{step.title}</h3>
                <p className="text-gray-700 flex-grow">{step.description}</p>
                <div className="mt-6 text-4xl font-bold text-primary-100">{index + 1}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Timeline */}
      <div className="py-16 bg-primary-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">The Food Rescue Journey</h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-300 hidden md:block"></div>
            
            {/* Timeline items */}
            <div className="space-y-12 md:space-y-0">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="md:w-1/2 p-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="flex items-center mb-4">
                        <div className="bg-primary-100 p-3 rounded-full mr-4">
                          {step.icon}
                        </div>
                        <h3 className="text-xl font-bold text-primary-700">{step.title}</h3>
                      </div>
                      <p className="text-gray-700">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 flex justify-center md:justify-center relative">
                    <div className="w-16 h-16 rounded-full bg-primary-500 text-white flex items-center justify-center text-xl font-bold z-10">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 p-6 hidden md:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">Benefits for Everyone</h2>
            <p className="text-lg text-gray-700">
              Our platform creates value for all participants in the food rescue ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-primary-700 mb-4">{benefit.title}</h3>
                <p className="text-gray-700">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Get Started CTA */}
      <div className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6 text-gray-500"
          >
            Ready to Make a Difference?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <button className="px-8 py-3 bg-white text-primary-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
              Join as a Restaurant
            </button>
            <button className="px-8 py-3 bg-transparent border-2 border-white text-gray-500 font-bold rounded-lg hover:bg-white hover:text-primary-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
              Become a Volunteer
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;