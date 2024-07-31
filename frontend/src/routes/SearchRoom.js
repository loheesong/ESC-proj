import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import './SearchRoom.css';
import RoomList from '../components/RoomList';

const SearchRoom = () => {
  const { id } = useParams()
  const [rooms, setRooms] = useState([])
  const [hotelDetails, setHotelDetails] = useState()
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currencyLoading, setCurrencyLoading] = useState(false);
  const [currency, setCurrency] = useState('SGD');

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const hotelImagePrefix = hotelDetails?.image_details.prefix
  const hotelImageSuffix = hotelDetails?.image_details.suffix
  const hotelImageCount = hotelDetails?.image_details.count
  const uid = queryParams.get('uid')
  const formData = JSON.parse(decodeURIComponent(queryParams.get('formData')))
  const hotelData = JSON.parse(decodeURIComponent(queryParams.get('hotel')))
  const guest = decodeURIComponent(queryParams.get('guest'))

  useEffect(() => {
    const fetchRooms = async () => {
      setCurrencyLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/rooms/${id}/prices?destination_id=${uid}&checkin=${formData.startDatePicker}&checkout=${formData.endDatePicker}&lang=en_US&currency=${currency}&country_code=SG&guests=${guest}&partner_id=1`);
        const data = await response.json();
        setRooms(data);
        setLoading(false);
        setCurrencyLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setLoading(false)
        setCurrencyLoading(false);
      }
     };

    fetchRooms()
  }, [currency]);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        console.log("fetch")
        const response = await fetch(`http://localhost:3001/hotels/hotel/${id}`)
        const data = await response.json()
        setHotelDetails(data)
      } catch(error) {
        console.error('Error fetching hotel details', error)
      }
    }

    fetchHotelDetails()
  }, [])

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
    setCurrencyLoading(true);
  };

  return (
    <div className="room-wrapper">
      <div className="room-info">
        <div className="room-image">
          <img src={`${hotelImagePrefix}${currentImageIndex}${hotelImageSuffix}`} alt="Hotel Pictures" />
          <div className="room-thumbnails">
              {Array.from({ length: hotelImageCount }, (_, i) => (
                <img
                  key={i}
                  src={`${hotelImagePrefix}${i}${hotelImageSuffix}`}
                  alt={`Thumbnail ${i + 1}`}
                  className={`thumbnail ${currentImageIndex === i ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(i)}
                />
              ))}
          </div>
        </div>
        <div className="room-description">
          <div>
            <h2>{hotelDetails?.name}</h2>
          </div>
          
          <h4>{hotelDetails?.address}</h4>
          <p>{hotelDetails?.description}</p>
        </div>
        <div className="currency-selector">
          <label htmlFor="currency">Choose Currency: </label>
          <select id="currency" value={currency} onChange={handleCurrencyChange}>
            <option value="SGD">SGD</option>
            <option value="USD">USD</option>
            <option value="JPY">JPY</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            {/* Add more currencies as needed */}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <RoomList rooms={rooms} uid={uid} formData={formData} hotelData={hotelData} currency={currency} currencyLoad={currencyLoading}/>
      )}
    </div>
  );
};

export default SearchRoom;
