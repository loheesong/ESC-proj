import React from 'react';
import { Link } from 'react-router-dom';
import './SearchRoom.css';

const SearchRoom = () => {
  const rooms = [
    { id: 1, name: 'Deluxe Room', description: 'A luxurious room with a king-sized bed.', amenities: ['WiFi', 'TV', 'Minibar'], imgSrc: 'https://i.pinimg.com/564x/57/66/0b/57660b90fe1169a421dece985748f3c3.jpg' },
    { id: 2, name: 'Suite', description: 'A spacious suite with a separate living area.', amenities: ['WiFi', 'TV', 'Minibar', 'Balcony'], imgSrc: 'https://via.placeholder.com/100' },
    { id: 3, name: 'Standard Room', description: 'A comfortable room with all standard amenities.', amenities: ['WiFi', 'TV'], imgSrc: 'https://via.placeholder.com/100' },
  ];

  return (
    <div className="room-wrapper">
      <div className="room-info">
        <div className="room-image">
          <img src="https://via.placeholder.com/600x300" alt="Room" />
        </div>
        <div className="room-description">
          <h2>Hotel Room</h2>
          <p>Luxurious room with all the amenities you need for a comfortable stay.</p>
        </div>
      </div>
      <div className="room-amenities">
        <h3>Amenities</h3>
        <ul>
          <li>Free WiFi</li>
          <li>Television</li>
          <li>Minibar</li>
          <li>Room Service</li>
        </ul>
      </div>
      <div className="room-list">
        {rooms.map(room => (
          <div key={room.id} className="room-card">
            <img src={room.imgSrc} alt={room.name} />
            <div className="room-card-content">
              <h3>{room.name}</h3>
              <p>{room.description}</p>
              <ul>
                {room.amenities.map(amenity => (
                  <li key={amenity}>{amenity}</li>
                ))}
              </ul>
            </div>
            <Link to={``}>
                <button>Book</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchRoom;
