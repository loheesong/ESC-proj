import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Pagination from '../components/Pagination';
import './SearchHotel.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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
  const {uid} = useParams();
  const [hotels, setHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const hotelsPerPage = 10;

  const location = useLocation()
  const formData = location.state || {}
  const checkin = formData.startDatePicker
  const checkout = formData.endDatePicker
  const formatGuestsAndRooms = (guests, rooms) => {
    let str = "";
    for (let i = 0; i < rooms; i++) {
        str += guests + "|";
    }
    // Remove the trailing " | "
    str = str.slice(0, -1);
    return str;
  };
  const guest = formatGuestsAndRooms(formData.numGuests, formData.numRooms)
  
  useEffect(() => {
    // Replace the below API call with your actual API endpoint
    const fetchHotels = async () => {
      try {
        console.log(checkin, guest)
        const response = await fetch(`http://localhost:3001/hotels/details?destination_id=${uid}&checkin=${checkin}&checkout=${checkout}&country_code=SG&guests=${guest}&partner_id=1`);
        const data = await response.json();
        setHotels(data);
        setLoading(false);

        // Using hardcoded data for demonstration
        //setHotels(initialHotels);
      } catch (error) {
        console.error('Error fetching hotel data:', error);
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const totalPages = Math.ceil(hotels.length / hotelsPerPage);
  const currentHotels = hotels.slice((currentPage - 1) * hotelsPerPage, currentPage * hotelsPerPage);

  return (
    <div className="wrapper">
      <div className="Title">
        <h1>Hotel Search</h1>
      </div>
      <div className="content">
        <div className="hotel-grid">
        {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          ) : (<>{currentHotels.map((hotel) => (
                <div key={hotel.id} className="hotel-card">
                  <div className="hotel-card-content">
                  <img src={hotel.prefix + '0' + hotel.suffix} alt={hotel.name} />
                    <h2>{hotel.name}</h2>
                    <p>Location: {hotel.location}    <i className="fas fa-star"></i> {hotel.rating}</p>
                  </div>
                  <Link to={`/searchroom/${hotel.id}?uid=${encodeURIComponent(uid)}&formData=${encodeURIComponent(JSON.stringify(formData))}&hotel=${encodeURIComponent(JSON.stringify(hotel))}&guest=${guest}`}>
                    <button>Select</button>
                  </Link>
                </div>
              ))}
            </>)}
          </div>
        <div className="map-container">
          <MapContainer center={[1.290270, 103.851959]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
              attribution='Map tiles by Stamen Design, CC BY 3.0 CC BY 3.0'
            />
            {currentHotels.map((hotel) => (
              <Marker key={hotel.id} position={hotel.position} icon={customIcon}>
              <Popup>
                {hotel.name}
              </Popup>
            </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setPage={setCurrentPage}
      />
    </div>
  );
};

export default SearchHotel;
