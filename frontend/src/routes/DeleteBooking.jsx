import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DeleteBooking = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchAllBookings = async () => {
            try {
                const res = await axios.get("http://localhost:3001/booking");
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
            <div className="bookings">
                {bookings.map((booking) => (
                    <div className="booking" key={booking.id}>
                        {booking.cover && <img src={booking.cover} alt="" />}
                        <h2>{booking.title}</h2>
                        <p>{booking.description}</p>
                        <span>{booking.price}</span>
                        <button className="delete" onClick={() => handleDelete(booking.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeleteBooking;
