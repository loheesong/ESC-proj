import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

// Hardcoded data for initial rendering
const initialHotels = [
  { id: 1, name: 'Hotel Sunshine', location: 'Singapore', rating: 4.5, position: [1.290270, 103.851959] },
  { id: 2, name: 'Mountain Retreat', location: 'Singapore', rating: 4.7, position: [1.352083, 103.819836] },
  { id: 3, name: 'Beachside Resort', location: 'Singapore', rating: 4.8, position: [1.282302, 103.860275] },
  { id: 4, name: 'City Hotel', location: 'Singapore', rating: 4.6, position: [1.283253, 103.848566] },
  { id: 5, name: 'Forest Hotel', location: 'Singapore', rating: 4.3, position: [1.322990, 103.819490] },
  { id: 6, name: 'Lakeview Hotel', location: 'Singapore', rating: 4.9, position: [1.342610, 103.681992] },
  { id: 7, name: 'Riverside Hotel', location: 'Singapore', rating: 4.4, position: [1.292896, 103.846450] },
  { id: 8, name: 'Downtown Hotel', location: 'Singapore', rating: 4.2, position: [1.296569, 103.848044] },
  { id: 9, name: 'Uptown Hotel', location: 'Singapore', rating: 4.7, position: [1.313839, 103.846932] },
  { id: 10, name: 'Suburban Hotel', location: 'Singapore', rating: 4.5, position: [1.378403, 103.892510] },
  { id: 11, name: 'Luxury Hotel', location: 'Singapore', rating: 5.0, position: [1.288617, 103.851161] },
  { id: 12, name: 'Economy Hotel', location: 'Singapore', rating: 3.9, position: [1.292400, 103.858400] },
];

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41]
});

const SearchHotel = () => {
  const [hotels, setHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 10;
  
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

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(hotels.length / hotelsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="wrapper">
      <div className="Title">
        <h1>Hotel Search</h1>
      </div>
      <div className="content">
        <div className="hotel-grid">
        {currentHotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <h2>{hotel.name}</h2>
              <p>Location: {hotel.location}</p>
              <p>Rating: {hotel.rating}</p>
              <Link to={`/searchroom/${hotel.id}`}>
                <button>Select</button>
              </Link>
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
              <Marker key={hotel.id} position={hotel.position} icon={customIcon}>
              <Popup>
                {hotel.name}
              </Popup>
            </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
      <div className="pagination">
        {pageNumbers.map(number => (
          <button key={number} onClick={() => setCurrentPage(number)}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchHotel;
