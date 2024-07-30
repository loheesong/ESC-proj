import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './BookingForm.css';
import AuthService from "../services/AuthService";

function BookingForm() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const bookingDataParam = params.get('bookingData');
    let bookingData = {};

    try {
        bookingData = bookingDataParam ? JSON.parse(decodeURIComponent(bookingDataParam)) : {};
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
        setForm({ ...form, [name]: value });
    };

    const validateExpiryDate = (expiryDate) => {
        const [month, year] = expiryDate.split('/');
        if (!month || !year || month.length !== 2 || year.length !== 2) {
            return false;
        }
        const monthNumber = parseInt(month, 10);
        const yearNumber = parseInt(year, 10);
        return monthNumber >= 1 && monthNumber <= 12 && yearNumber >= 24 && yearNumber <= 99;
    };

    const validate = () => {
        const validationErrors = {};

        if (!form.name) {
            validationErrors.name = 'Name is required';
        }
        if (!form.cardNumber) {
            validationErrors.cardNumber = 'Card number is required';
        } else if (!/^\d+$/.test(form.cardNumber)) {
            validationErrors.cardNumber = 'Card number must be numeric';
        } else if (form.cardNumber.length !== 16) {
            validationErrors.cardNumber = 'Card number must be 16 digits';
        }
        if (!form.expiryDate) {
            validationErrors.expiryDate = 'Expiry date is required';
        } else if (!/^\d{2}\/\d{2}$/.test(form.expiryDate)) {
            validationErrors.expiryDate = 'Expiry date must be in MM/YY format';
        } else if (!validateExpiryDate(form.expiryDate)) {
            validationErrors.expiryDate = 'Expiry date must be valid numbers in MM/YY format';
        }
        if (!form.cvv) {
            validationErrors.cvv = 'CVV is required';
        } else if (!/^\d+$/.test(form.cvv)) {
            validationErrors.cvv = 'CVV must be numeric';
        } else if (form.cvv.length !== 3) {
            validationErrors.cvv = 'CVV number must be 3 digits';
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return; 
        }

        bookingData.bookingInfo = form;
        try {
            bookingData.userID = AuthService.getCurrentUser().id;
        } catch (e) {
            alert("You must be logged in to book.");
            return;
        }

        axios.post("http://localhost:3001/bookings/submitbooking", bookingData)
            .then((res) => {
                alert("Booking Successful!");
                window.location.href = "/displaybooking";
            })
            .catch((error) => {
                console.error('Error during booking:', error);
            });
    };

    return (
        <div className="form-page">
            <div className="form-container">
                <h1>Create Booking</h1>
                <form onSubmit={handleSubmit}>
                    <h2>Booking Information</h2>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                        />
                        {errors.name && <p>{errors.name}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="messageToHotel">Message to Hotel:</label>
                        <textarea
                            id="messageToHotel"
                            name="messageToHotel"
                            value={form.messageToHotel}
                            onChange={handleChange}
                        />
                    </div>
                    <h2>Payee Information</h2>
                    <div className="form-group">
                        <label htmlFor="cardNumber">Card Number:</label>
                        <input
                            id="cardNumber"
                            name="cardNumber"
                            type="text"
                            value={form.cardNumber}
                            onChange={handleChange}
                        />
                        {errors.cardNumber && <p>{errors.cardNumber}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="expiryDate">Expiry Date:</label>
                        <input
                            id="expiryDate"
                            name="expiryDate"
                            type="text"
                            value={form.expiryDate}
                            onChange={handleChange}
                        />
                        {errors.expiryDate && <p>{errors.expiryDate}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="cvv">CVV:</label>
                        <input
                            id="cvv"
                            name="cvv"
                            type="text"
                            value={form.cvv}
                            onChange={handleChange}
                        />
                        {errors.cvv && <p>{errors.cvv}</p>}
                    </div>
                    <button className="submit" type="submit">Create Booking</button>
                </form>
            </div>
        </div>
    );
}

export default BookingForm;
