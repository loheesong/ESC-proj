import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DeleteBooking.css'; // Import the CSS file

const DeleteBooking = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchAllBookings = async () => {
            try {
                const res = await axios.get("http://localhost:3001/booking");
                console.log(res.data);
                setBookings(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllBookings();
    }, []);

    const handleDelete = async (id) => {
        try {
            console.log(`Attempting to delete booking with ID: ${id}`);
            await axios.delete(`http://localhost:3001/booking/${id}`);
            setBookings(bookings.filter(booking => booking.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h1>Ascenda Booking</h1>
            <div className="bookings-container">
                {bookings.map((booking) => (
                    <div className = "booking" key = {booking.id}>
                        {booking.HotelCoverPic && <img src = {booking.HotelCoverPic} alt =""/>}
                        <div className = "booking-info">
                            <h2>{booking.HotelName}</h2>
                            <p><strong>Booked by:</strong> {booking.BookingInformation.Name}</p>
                            <p><strong>Room Name:</strong> {booking.BookingInformation.RoomName}</p>
                            <p><strong>Price:</strong> {booking.BookingInformation.Price}</p>
                            <p><strong>Check-In:</strong> {booking.BookingInformation.CheckIn}</p>
                            <p><strong>Check-Out:</strong> {booking.BookingInformation.CheckOut}</p>
                            <p><strong>Message to Hotel:</strong> {booking.BookingInformation.MessageToHotel}</p>
                            </div>
                            <button className="delete" onClick = {() => handleDelete(booking.id)}>Delete</button>
                            </div>
                           
                ))}
            </div>
        </div>
    );
 };

    
              

export default DeleteBooking;
