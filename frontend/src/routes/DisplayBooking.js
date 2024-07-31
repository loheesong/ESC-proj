import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthService from '../services/AuthService';
import './DisplayBooking.css'; // Make sure to create and style this CSS file accordingly

const DisplayBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBookings = () => {
        try {
            const uid = AuthService.getCurrentUser().id;
            axios.get(`http://localhost:3001/bookings/getbookings/${uid}`)
            .then((res) => {
                setBookings(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to fetch bookings.' + err);
                setLoading(false);
            });
        } catch(e) {
            alert("You must be logged in to view bookings.");
            console.log("User not logged in " + e);
            window.location.href = "/login";
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleDelete = (bookingId) => {
        console.log("deleting booking: " + bookingId)
        axios.post(`http://localhost:3001/bookings/deletebooking/${bookingId}`)
            .then((res) => {
                fetchBookings(); // Re-fetch bookings after deletion
            })
            .catch((err) => {
                console.error('Failed to delete booking.', err);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>
            <h2>No Bookings Yet</h2>
        </div>;
    }

    return (
        <div>
            <h1>My Bookings</h1>
            {bookings.length === 0 ? (
                <div>No bookings found!</div>
            ) : (
                <div className="booking-list">
                    {bookings.map((booking, index) => (
                        <div key={index} className="booking-card">
                            <img src={booking.room_img_src} alt={`Room at ${booking.hotel_name}`} className="booking-img" />
                            <div className="booking-card-content">
                                <h2>{booking.hotel_name}</h2>
                                <p><strong>Booking ID:</strong> {booking.booking_id}</p> 
                                <p><strong>Name:</strong> {booking.name}</p>
                                <p><strong>Room:</strong> {booking.room_name}</p>
                                <p><strong>Location:</strong> {booking.location}</p>
                                <p><strong>Price:</strong> ${booking.price}</p>
                                <p><strong>Check-in Date:</strong> {booking.checkin_date}</p>
                                <p><strong>Check-out Date:</strong> {booking.checkout_date}</p>
                                <p><strong>Booking Date:</strong> {booking.book_date}</p>
                                <p><strong>Message:</strong> {booking.message}</p>
                                <button className="delete-button" onClick={() =>    (booking.booking_id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DisplayBooking;
