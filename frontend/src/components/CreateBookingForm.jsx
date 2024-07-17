import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateBooking.css';

const CreateBookingForm = () => {
    const [form, setForm] = useState({
        name: '',
        checkInDate: '',
        checkOutDate: '',
        messageToHotel: '',
        cardType: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value});
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post("http://localhost:3001/booking", form);
            console.log(res.data);
            navigate('/booking-confirmed');
        } catch (err) {
            console.log(err);
        }
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
                        <label>Check-In Date:</label>
                        <input type="date" name="checkInDate" value={form.checkInDate} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Check-Out Date:</label>
                        <input type="date" name="checkOutDate" value={form.checkOutDate} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Message to Hotel:</label>
                        <textarea name="messageToHotel" value={form.messageToHotel} onChange={handleChange}></textarea>
                    </div>
                    <h2>Payee Information</h2>
                    <div className="form-group">
                        <label>Card Type:</label>
                        <input type="text" name="cardType" value={form.cardType} onChange={handleChange} />
                    </div>
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
export default CreateBookingForm; 

