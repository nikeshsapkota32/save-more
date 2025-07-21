// src/pages/TestimonialsPage.jsx
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { GiChefToque, GiFruitBowl, GiShoppingCart } from 'react-icons/gi';
import Avatar from '../components/Avatar';

const TestimonialsPage = () => {
  const testimonials = [
    {
      id: "testimonial-1",
      name: "Sarah Johnson",
      role: "Restaurant Owner",
      content: "SaveThePlate has revolutionized how we handle surplus food. We've reduced waste by 80% and built amazing community connections!",
      rating: 5,
      icon: <GiChefToque className="text-3xl text-primary-500" />,
    },
    {
      id: "testimonial-2",
      name: "Michael Chen",
      role: "Volunteer",
      content: "I've been volunteering with SaveThePlate for 6 months. The impact we make on food insecurity while reducing waste is incredibly rewarding.",
      rating: 5,
      icon: <GiShoppingCart className="text-3xl text-primary-500" />,
    },
    {
      id: "testimonial-3",
      name: "Emma Rodriguez",
      role: "Community Organizer",
      content: "Our community center receives fresh meals daily through this platform. The quality and variety have been amazing for our programs.",
      rating: 4,
      icon: <GiFruitBowl className="text-3xl text-primary-500" />,
    },
    {
      id: "testimonial-4",
      name: "David Thompson",
      role: "Environmental Advocate",
      content: "The environmental impact is substantial. We're tracking a 30% reduction in methane emissions from landfills in our area since SaveThePlate launched.",
      rating: 5,
      icon: <FaStar className="text-3xl text-primary-500" />,
    },
    {
      id: "testimonial-5",
      name: "Priya Sharma",
      role: "Food Donor",
      content: "The platform is so easy to use! Listing surplus food takes minutes, and I love seeing it go to people who need it rather than the trash.",
      rating: 4,
      icon: <GiChefToque className="text-3xl text-primary-500" />,
    },
    {
      id: "testimonial-6",
      name: "James Wilson",
      role: "Food Recipient",
      content: "As a student on a tight budget, SaveThePlate has been a lifesaver. The fresh, restaurant-quality food I receive helps me stretch my budget.",
      rating: 5,
      icon: <GiFruitBowl className="text-3xl text-primary-500" />,
    },
  ];

  // Function to generate star ratings
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar 
        key={i} 
        className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'} text-xl`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-primary-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-primary-700 mb-4">What People Say</h1>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            Hear from restaurants, volunteers, and communities about their experiences with SaveThePlate
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-xl p-6 shadow-md border border-primary-100 flex flex-col h-full"
            >
              <div className="flex items-start mb-4">
                <div className="bg-primary-100 p-3 rounded-full mr-4">
                  {testimonial.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary-800">{testimonial.name}</h3>
                  <p className="text-primary-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {renderStars(testimonial.rating)}
              </div>
              
              <p className="text-gray-700 italic mb-4 flex-grow">"{testimonial.content}"</p>
              
              <div className="flex justify-center mt-4">
                <Avatar 
                  name={testimonial.name}
                  size="80"
                  round={true}
                  className="border-2 border-primary-200 shadow-sm"
                  color="#10B981" // Primary color
                  fgColor="#fff" // Text color
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-primary-700 mb-6">Share Your Experience</h2>
          <p className="text-primary-600 mb-6">
            Have a story about how SaveThePlate made a difference? We'd love to hear from you!
          </p>
          <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Share Your Story
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default TestimonialsPage;