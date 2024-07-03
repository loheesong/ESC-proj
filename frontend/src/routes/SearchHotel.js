import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './SearchHotel.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const SearchHotel = () => {
  const [hotels, setHotels] = useState([]);

  // Hardcoded data for initial rendering
  const initialHotels = [
    { id: 1, name: 'Hotel Marina Bay Sands', location: 'Singapore', rating: 4.9, lat: 1.2834, lng: 103.8607 },
    { id: 2, name: 'Raffles Hotel', location: 'Singapore', rating: 4.8, lat: 1.2945, lng: 103.8536 },
    { id: 3, name: 'Mandarin Oriental', location: 'Singapore', rating: 4.7, lat: 1.2903, lng: 103.8595 },
    { id: 4, name: 'The Ritz-Carlton', location: 'Singapore', rating: 4.6, lat: 1.2914, lng: 103.8605 },
    { id: 5, name: 'Shangri-La Hotel', location: 'Singapore', rating: 4.5, lat: 1.3075, lng: 103.8288 },
    { id: 6, name: 'Fullerton Hotel', location: 'Singapore', rating: 4.5, lat: 1.2865, lng: 103.8520 },
    { id: 7, name: 'Pan Pacific', location: 'Singapore', rating: 4.4, lat: 1.2926, lng: 103.8574 },
    { id: 8, name: 'Marriott Tang Plaza Hotel', location: 'Singapore', rating: 4.3, lat: 1.3053, lng: 103.8322 },
    { id: 9, name: 'Swissôtel The Stamford', location: 'Singapore', rating: 4.3, lat: 1.2931, lng: 103.8520 },
    { id: 10, name: 'Four Seasons Hotel', location: 'Singapore', rating: 4.2, lat: 1.3052, lng: 103.8255 },
  ];

  useEffect(() => {
    // Replace the below API call with your actual API endpoint
    const fetchHotels = async () => {
      try {
        // Uncomment the following lines and replace with your API call
        // const response = await fetch('YOUR_API_ENDPOINT');
        // const data = await response.json();
        // setHotels(data);

        // Using hardcoded data for demonstration
        setHotels(initialHotels);
      } catch (error) {
        console.error('Error fetching hotel data:', error);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className="wrapper">
      <div className="Title">
        <h1>Hotel Search</h1>
      </div>
      <div className="content">
        <div className="hotel-grid">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <h2>{hotel.name}</h2>
              <p>Location: {hotel.location}</p>
              <p>Rating: {hotel.rating}</p>
            </div>
          ))}
        </div>
        <div className="map-container">
          <MapContainer center={[1.290270, 103.851959]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {hotels.map((hotel) => (
              <Marker key={hotel.id} position={[hotel.lat, hotel.lng]}>
                <Popup>{hotel.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default SearchHotel;
