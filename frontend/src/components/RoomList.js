import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './RoomList.css';

const RoomList = ({ rooms, uid, formData, hotelData, currency, currencyLoad }) => {
  const currencySymbols = {
    SGD: 'SG$',
    USD: 'US$',
    JPY: '¥',
    EUR: '€',
    GBP: '£',
    // Add more currency codes and symbols as needed
  };

  const getCurrencySymbol = (currency) => {
    return currencySymbols[currency] || currency;
  };

  const handleBooking = (room) => {
    // Data to be sent to the backend
    const bookingData = {
      room,
      uid,
      formData,
      hotelData
    };
    room.price = getCurrencySymbol(currency) + room.price
    console.log(bookingData)
    const params = new URLSearchParams();
    const bookingDataString = encodeURIComponent(JSON.stringify(bookingData));
    window.location.href = `/booking?bookingData=${bookingDataString}`;
  };

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
              {currencyLoad ? (
                <div>
                  <h4>Loading...</h4>
                </div>
              ) : (
                <div>
                <h2>{getCurrencySymbol(currency)} {room.price}</h2>
                </div>
              )}
              <button onClick={() => handleBooking(room)}>Book</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
