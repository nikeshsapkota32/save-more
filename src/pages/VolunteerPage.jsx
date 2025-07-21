// src/pages/VolunteerPage.jsx
import { motion } from 'framer-motion';
import VolunteerList from '../components/VolunteerList';
import Map from '../components/Map';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const VolunteerPage = () => {
  const [view, setView] = useState('list');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  
  // Mock location data
  const locations = [
    { id: '1', lat: 51.5074, lng: -0.1278, name: 'Sarah Johnson' },
    { id: '2', lat: 51.5112, lng: -0.1221, name: 'Michael Chen' },
    { id: '3', lat: 51.5153, lng: -0.1325, name: 'Emma Rodriguez' },
    { id: '4', lat: 51.5098, lng: -0.1187, name: 'David Smith' }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Volunteer Network</h1>
        <p className="text-primary-600">Connect with volunteers to distribute your surplus food</p>
      </motion.div>

      <div className="flex justify-between items-center">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search volunteers..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <FaSearch />
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-md ${view === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            List View
          </button>
          <button
            onClick={() => setView('map')}
            className={`px-4 py-2 rounded-md ${view === 'map' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Map View
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <VolunteerList 
          onSelect={setSelectedVolunteer} 
          selectedId={selectedVolunteer?.id}
        />
      ) : (
        <div className="bg-white p-4 rounded-xl shadow-md h-[500px] relative">
          <Map locations={locations} />
          
          <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-md max-w-xs">
            <h3 className="font-medium mb-2">Available Volunteers</h3>
            <ul className="space-y-2">
              {locations.map(location => (
                <li 
                  key={location.id}
                  className="flex items-center cursor-pointer hover:text-primary-600"
                  onClick={() => setSelectedVolunteer({ id: location.id, name: location.name })}
                >
                  <FaMapMarkerAlt className="text-red-500 mr-2" />
                  <span>{location.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {selectedVolunteer && (
        <div className="bg-white p-6 rounded-xl shadow-md mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Contact {selectedVolunteer.name}</h3>
            <button 
              onClick={() => setSelectedVolunteer(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              Close
            </button>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Send Message</h4>
              <textarea 
                className="w-full h-32 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Write your message here..."
              ></textarea>
              <button className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                Send Message
              </button>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Schedule Pickup</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Date</label>
                  <input 
                    type="date" 
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Time</label>
                  <select className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>Morning (8am-12pm)</option>
                    <option>Afternoon (12pm-5pm)</option>
                    <option>Evening (5pm-9pm)</option>
                  </select>
                </div>
                <button className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                  Schedule Pickup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerPage;