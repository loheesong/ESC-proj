import React from 'react';
import { Link } from 'react-router-dom';
import './RoomList.css';

const RoomList = ({ rooms }) => {
  return (
    <div>
      <div class='room-amenities'>
        <h3>Amenities</h3>
        <ul>
          {rooms[0].commonAmenities.map((amenity) => (
            <li key={amenity}>{amenity}</li>
          ))}
        </ul>
      </div>
      <div className="room-list">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <img src={room.imgSrc} alt={room.name} />
            <div className="room-card-content">
              <div>
                <h1>{room.name}</h1>
              </div>
              {room.uniqueAmenities && room.uniqueAmenities.length > 0 && (
                <div className="amenities-content">
                  <h3>Amenities</h3>
                  <ul>
                    {room.uniqueAmenities.map((amenity) => (
                      <li key={amenity}>{amenity}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="booking">
              <h2>$ {room.price}</h2>
              <Link to={``}>
                <button>Book</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
