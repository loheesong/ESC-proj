import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import './SearchRoom.css';

const rooms = [
  { id: 1, name: 'Deluxe Room', description: 'A luxurious room with a king-sized bed.', amenities: ['WiFi', 'TV', 'Minibar'], imgSrc: 'https://i.pinimg.com/564x/57/66/0b/57660b90fe1169a421dece985748f3c3.jpg', price: '123.24' },
  { id: 2, name: 'Suite', description: 'A spacious suite with a separate living area.', amenities: ['WiFi', 'TV', 'Minibar', 'Balcony'], imgSrc: 'https://via.placeholder.com/100', price: '231.78' },
  { id: 3, name: 'Standard Room', description: 'A comfortable room with all standard amenities.', amenities: ['WiFi', 'TV'], imgSrc: 'https://via.placeholder.com/100', price: '353.04' },
];

const SearchRoom = () => {
  const { id } = useParams()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true);

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const hotelName = queryParams.get('name')

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`http://localhost:3001/rooms/${id}/prices?destination_id=WD0M&checkin=2024-10-01&checkout=2024-10-07&lang=en_US&currency=SGD&country_code=SG&guests=2&partner_id=1`);
        const data = await response.json();
        setRooms(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setLoading(false)
      }
     };

     fetchRooms()
  }, [id]);

  return (
    <div className="room-wrapper">
      <div className="room-info">
        <div className="room-image">
          <img src="https://via.placeholder.com/600x300" alt="Room" />
        </div>
        <div className="room-description">
          <h2>{hotelName}</h2>
          <p>Luxurious room with all the amenities you need for a comfortable stay.</p>
        </div>
      </div>
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <div className="room-list">
          {rooms.length === 0 ? (
            <div className="no-rooms-found">
              <h1>No rooms found :c</h1>
            </div>
          ) : (
            rooms.map(room => (
              <div key={room.id} className="room-card">
                <img src={room.imgSrc.url} alt={room.name} />
                <div className="room-card-content">
                  <h3>{room.description}</h3>
                  <ul>
                    {room.amenities.map(amenity => (
                      <li key={amenity}>{amenity}</li>
                    ))}
                  </ul>
                </div>
                <div className='booking'>
                  <h2>$ {room.price}</h2>
                  <Link to={``}>
                    <button>Book</button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchRoom;
