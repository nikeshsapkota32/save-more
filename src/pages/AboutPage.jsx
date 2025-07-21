// src/pages/AboutPage.jsx
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaLeaf, FaHandHoldingHeart, FaUsers, FaLightbulb } from 'react-icons/fa';
import { GiForkKnifeSpoon } from 'react-icons/gi';

const AboutPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Nikesh Sapkota",
      role: "Founder & Developer",
      bio: "Passionate developer creating solutions to reduce food waste and help communities.",
      github: "https://github.com/NikeshSapkot",
      linkedin: "https://www.linkedin.com/in/nikesh-sapkota-8405ba219/"
    },
    {
      id: 2,
      name: "Alex Johnson",
      role: "Operations Director",
      bio: "Food distribution expert with 10+ years in non-profit management.",
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      role: "Community Manager",
      bio: "Connects restaurants with volunteers and communities in need.",
    },
    {
      id: 4,
      name: "David Chen",
      role: "Sustainability Advisor",
      bio: "Environmental scientist focused on reducing food waste impact.",
    }
  ];

  const values = [
    {
      icon: <FaLeaf className="text-4xl text-primary-500" />,
      title: "Sustainability",
      description: "Reducing food waste to minimize environmental impact and conserve resources."
    },
    {
      icon: <FaHandHoldingHeart className="text-4xl text-primary-500" />,
      title: "Compassion",
      description: "Ensuring surplus food reaches those who need it most with dignity."
    },
    {
      icon: <FaUsers className="text-4xl text-primary-500" />,
      title: "Community",
      description: "Building connections between businesses, volunteers, and neighbors."
    },
    {
      icon: <FaLightbulb className="text-4xl text-primary-500" />,
      title: "Innovation",
      description: "Using technology to create efficient solutions for food distribution."
    }
  ];

  // Impact statistics
  const impactStats = [
    { value: "5,000+", label: "Meals Saved" },
    { value: "200+", label: "Restaurants Partnered" },
    { value: "50+", label: "Communities Served" },
    { value: "300+", label: "Active Volunteers" }
  ];

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <GiForkKnifeSpoon className="text-6xl text-gray-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-10 text-gray-500"
          >
            Our Mission to End Food Waste
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl max-w-3xl mx-auto text-gray-500 mb-5"
          >
            SaveThePlate connects surplus food from restaurants and businesses with communities in need, creating a sustainable solution to food waste and hunger.
          </motion.p>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-700">
              Founded by Nikesh Sapkota in 2023, SaveThePlate began as a personal project to address food waste in local communities. 
              Today, it has grown into a platform connecting restaurants with volunteers and organizations to ensure good food feeds 
              people, not landfills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <h3 className="text-2xl font-bold text-primary-700 mb-4">Why We Started</h3>
              <p className="text-gray-700 mb-4">
                Seeing perfectly good food go to waste while people in our community struggled with hunger inspired us to create 
                a solution. SaveThePlate was born from the belief that technology can bridge the gap between surplus food and those who need it.
              </p>
              <p className="text-gray-700">
                Our platform makes it easy for restaurants to donate surplus food, volunteers to coordinate pickups, and communities 
                to access nutritious meals - all while reducing environmental impact.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-80 md:h-96 flex items-center justify-center">
                <GiForkKnifeSpoon className="text-6xl text-gray-500" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-16 bg-primary-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-700">
              These principles guide everything we do at SaveThePlate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg shadow-md text-center"
              >
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-primary-700 mb-2">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Impact */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">Our Impact</h2>
            <p className="text-lg text-gray-700">
              Together with our partners, we're making a real difference
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-lg text-gray-700">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-700">
              The passionate individuals behind SaveThePlate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 flex items-center justify-center">
                      <span className="text-3xl text-gray-500">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center text-primary-700 mb-1">{member.name}</h3>
                  <p className="text-gray-600 text-center mb-4">{member.role}</p>
                  <p className="text-gray-700 text-center mb-4">{member.bio}</p>
                  
                  {member.github && member.linkedin && (
                    <div className="flex justify-center space-x-4 mt-4">
                      <a 
                        href={member.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-primary-600 transition-colors"
                      >
                        <FaGithub className="text-2xl" />
                      </a>
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-primary-600 transition-colors"
                      >
                        <FaLinkedin className="text-2xl" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;