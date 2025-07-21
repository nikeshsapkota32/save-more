// src/components/Map.jsx
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 51.5074,
  lng: -0.1278
};

const Map = ({ locations }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  if (!isLoaded) return (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mr-3"></div>
        <span>Loading map...</span>
      </div>
    </div>
  );

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      options={{
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      }}
    >
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={{ lat: location.lat, lng: location.lng }}
          label={{
            text: location.name,
            className: "map-label",
            color: "#fff"
          }}
          icon={{
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z",
            fillColor: "#22c55e",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 1.5
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default Map;