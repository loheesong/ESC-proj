import React, { useState, useEffect } from 'react';
import './SearchHotel.css';

const SearchHotel = () => {
  const [hotels, setHotels] = useState([]);

  // Hardcoded data for initial rendering
  const initialHotels = [
    { id: 1, name: 'Hotel Sunshine', location: 'California', rating: 4.5 },
    { id: 2, name: 'Mountain Retreat', location: 'Colorado', rating: 4.7 },
    { id: 3, name: 'Beachside Resort', location: 'Florida', rating: 4.8 },
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
      <div>
        <h1>Hotel Search</h1>
      </div>
      <div className="hotel-grid">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="hotel-card">
            <h2>{hotel.name}</h2>
            <p>Location: {hotel.location}</p>
            <p>Rating: {hotel.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHotel;
