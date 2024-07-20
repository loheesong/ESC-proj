import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './BookingForm.css';
import AuthService from "../services/AuthService";


function BookingForm() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const bookingDataParam = params.get('bookingData');
    let bookingData = {};

    try {
        bookingData = bookingDataParam ? JSON.parse(decodeURIComponent(bookingDataParam)) : {};
        console.log('Booking Data:', bookingData);
    } catch (error) {
        console.error('Error parsing bookingData:', error);
    }

    const [form, setForm] = useState({
        name: '',
        messageToHotel: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });
    
    const navigate = useNavigate();
    
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    
    const handleSubmit = async () => {

        bookingData.bookingInfo = form;
        try{
            bookingData.userID = AuthService.getCurrentUser().id;
        }catch(e){
            console.log("User not logged in " + e);
            return;
        }

        axios.post("http://localhost:3001/bookings/submitbooking", bookingData)
        .then((res) => {
            console.log('Booking response:', res.data);
        })
        .catch((error) => {
            console.error('Error during booking:', error);
        });
    };

  

    return (
        <div className="form-page">
            <div className="form-container">
                <h1>Create Booking</h1>
                <form>
                    <h2>Booking Information</h2>
                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Message to Hotel:</label>
                        <textarea name="messageToHotel" value={form.messageToHotel} onChange={handleChange}></textarea>
                    </div>
                    <h2>Payee Information</h2>
                    <div className="form-group">
                        <label>Card Number:</label>
                        <input type="text" name="cardNumber" value={form.cardNumber} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Expiry Date:</label>
                        <input type="text" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>CVV:</label>
                        <input type="text" name="cvv" value={form.cvv} onChange={handleChange} />
                    </div>
                    <button className="submit" type="button" onClick={handleSubmit}>Create Booking</button>
                </form>
            </div>
        </div>
    );
};

export default BookingForm