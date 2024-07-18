import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './CreateBooking.css';

function BookingForm() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const bookingDataParam = params.get('bookingData');
    let bookingData = {};

    try{
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

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value});
    };

    const validate = () => {
        const errors = {};

        if (!form.cardNumber) {
            errors.cardNumber = 'Card number is required';
        } else if (form.cardNumber.length !== 16) {
            errors.cardNumber = 'Card number must be 16 digits';
        }
        if (!form.expiryDate){
            errors.expiryDate = 'Expiry date is required';
        } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(form.expiryDate)) {
            errors.expiryDate = 'Expiry date must be in MM/YY format';
        }
        if (!form.cvv){
            errors.cvv = 'CVV is required';
        } else if (form.cvv.length !== 3) {
            errors.cvv = 'CVV number must be 3 digits';
        }

        setErrors(errors);
        console.log(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            return; 
        }

        bookingData.bookingInfo = form;

        try{
            const res = axios.post("http://localhost:3001/book", bookingData);
            console.log('Booking response:', res.data);
        } catch (error) {
            console.error('Error during booking:', error);
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
                        <label>Message to Hotel:</label>
                        <textarea name="messageToHotel" value={form.messageToHotel} onChange={handleChange}></textarea>
                    </div>
                    <h2>Payee Information</h2>
                    <div className="form-group">
                        <label>Card Number:</label>
                        <input type="text" name="cardNumber" value={form.cardNumber} onChange={handleChange} />
                        {errors.cardNumber && <div className="error">{errors.cardNumber}</div>}
                    </div>
                    <div className="form-group">
                        <label>Expiry Date:</label>
                        <input type="text" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
                        {errors.expiryDate && <div className="error">{errors.expiryDate}</div>}
                    </div>
                    <div className="form-group">
                        <label>CVV:</label>
                        <input type="text" name="cvv" value={form.cvv} onChange={handleChange} />
                        {errors.cvv && <div className="error">{errors.cvv}</div>}
                    </div>
                    <button className="submit" type="button" onClick={handleSubmit}>Create Booking</button>
                </form>
            </div>
        </div>
    );
}

export default BookingForm;
