// components/FoodMap.jsx
import { GoogleMap, MarkerF, InfoWindow } from '@react-google-maps/api';

const FoodMap = ({ locations }) => {
  return (
    <div className="h-[500px] rounded-xl overflow-hidden shadow-lg">
      <GoogleMap
        zoom={12}
        center={{ lat: 37.7749, lng: -122.4194 }}
        mapContainerClassName="w-full h-full"
      >
        {locations.map((loc) => (
          <MarkerF
            key={loc.id}
            position={{ lat: loc.lat, lng: loc.lng }}
            icon={{
              url: loc.type === 'restaurant' ? '/restaurant-icon.png' : '/ngo-icon.png',
              scaledSize: new window.google.maps.Size(32, 32)
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
};