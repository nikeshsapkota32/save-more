import { motion } from 'framer-motion';
import { 
  FaLeaf, 
  FaRecycle, 
  FaHandHoldingHeart, 
  FaInstagram, 
  FaTwitter, 
  FaFacebook 
} from 'react-icons/fa';
import { GiForkKnifeSpoon } from 'react-icons/gi';
import { Link } from 'react-router-dom'; // Added for proper linking

const Footer = () => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.footer 
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1 }}
      className="bg-primary-50 py-12"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo Section */}
          <motion.div 
            variants={variants}
            className="flex items-center space-x-2"
          >
            <GiForkKnifeSpoon className="text-4xl text-primary-600" />
            <div>
              <h2 className="text-2xl font-bold text-primary-600">SaveThePlate</h2>
              <p className="text-primary-500">Nourishing Communities</p>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={variants}>
            <h3 className="text-lg font-semibold text-primary-700 mb-4 flex items-center">
              <FaLeaf className="mr-2" /> Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'How It Works', path: '/how-it-works' },
                { name: 'Testimonials', path: '/testimonials' }
              ].map((item) => (
                <motion.li 
                  key={`link-${item.name}`} // Unique key
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link 
                    to={item.path} 
                    className="text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Impact */}
          <motion.div variants={variants}>
            <h3 className="text-lg font-semibold text-primary-700 mb-4 flex items-center">
              <FaHandHoldingHeart className="mr-2" /> Our Impact
            </h3>
            <div className="space-y-3">
              {[
                { id: 'impact-1', icon: <FaRecycle />, text: '5000+ meals saved' },
                { id: 'impact-2', icon: <FaLeaf />, text: '200+ restaurants' },
                { id: 'impact-3', icon: <FaHandHoldingHeart />, text: '50+ communities' }
              ].map((stat) => (
                <motion.div 
                  key={stat.id} // Unique key
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 text-primary-600"
                >
                  <span className="text-primary-500">{stat.icon}</span>
                  <span>{stat.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social */}
          <motion.div variants={variants}>
            <h3 className="text-lg font-semibold text-primary-700 mb-4">Connect</h3>
            <div className="flex space-x-4">
              {[
                { id: 'social-1', icon: <FaInstagram />, color: 'text-pink-500' },
                { id: 'social-2', icon: <FaTwitter />, color: 'text-blue-400' },
                { id: 'social-3', icon: <FaFacebook />, color: 'text-blue-600' }
              ].map((social) => (
                <motion.a
                  key={social.id} // Unique key
                  href="#"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`text-2xl ${social.color} hover:opacity-80`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div 
          variants={variants}
          className="mt-12 pt-6 border-t border-primary-200 text-center text-primary-500"
        >
          <p>© {new Date().getFullYear()} SaveThePlate. Making food waste history.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;