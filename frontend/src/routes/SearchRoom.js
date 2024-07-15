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

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const hotelImagePrefix = hotelDetails?.image_details.prefix
  const hotelImageSuffix = hotelDetails?.image_details.suffix
  const hotelImageCount = hotelDetails?.image_details.count
  const uid = queryParams.get('uid')
  const formData = JSON.parse(decodeURIComponent(queryParams.get('hotel')))
  const hotelData = JSON.parse(decodeURIComponent(queryParams.get('hotel')))

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`http://localhost:3001/rooms/${id}/prices?destination_id=${uid}&checkin=2024-10-01&checkout=2024-10-07&lang=en_US&currency=SGD&country_code=SG&guests=2&partner_id=1`);
        const data = await response.json();
        setRooms(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setLoading(false)
      }
     };

    fetchRooms()
  }, []);

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
          <h2>{hotelDetails?.name}</h2>
          <h4>{hotelDetails?.address}</h4>
          <p>{hotelDetails?.description}</p>
        </div>
      </div>
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <RoomList rooms={rooms} uid={uid} formData={formData} hotelData={hotelData} />
      )}
    </div>
  );
};

export default SearchRoom;
