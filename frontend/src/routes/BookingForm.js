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
    const [errorMsgs, setErrorMsgs] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value});
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
        const validationErrorMsgs = {};

        if (!form.name) {
            validationErrors.name = true;
            validationErrorMsgs.errorMsgName = 'Name is required';
        }
        if (!form.cardNumber) {
            validationErrors.cardNumber = true;
            validationErrorMsgs.errorMsgCardNumber = 'Card number is required';
        } else if (!/^\d+$/.test(form.cardNumber)){
            validationErrors.cardNumber = true;
            validationErrorMsgs.errorMsgCardNumber = 'Card number must be numeric';
        }  else if (form.cardNumber.length !== 16) {
            validationErrors.cardNumber = true; 
            validationErrorMsgs.errorMsgCardNumber = 'Card number must be 16 digits';
        }
        if (!form.expiryDate){
            validationErrors.expiryDate = true;
            validationErrorMsgs.errorMsgExpiryDate = 'Expiry date is required';
        } else if (!/^\d{2}\/\d{2}$/.test(form.expiryDate)) {
            validationErrors.expiryDate = true;
            validationErrorMsgs.errorMsgExpiryDate = 'Expiry date must be in MM/YY format';
        } else if (!validateExpiryDate(form.expiryDate)){
            validationErrors.expiryDate = true;
            validationErrorMsgs.errorMsgExpiryDate = 'Expiry date must be valid numbers in MM/YY format'
        }
        if (!form.cvv){
            validationErrors.cvv = true;
            validationErrorMsgs.errorMsgCVV = 'CVV is required';
        } else if (!/^\d+$/.test(form.cvv)) {
            validationErrors.cvv = true;
            validationErrorMsgs.errorMsgCVV = 'CVV must be numeric';
        }   else if (form.cvv.length !== 3) {
            validationErrors.cvv = true;
            validationErrorMsgs.errorMsgCVV = 'CVV number must be 3 digits';
        }

        setErrors(validationErrors);
        setErrorMsgs(validationErrorMsgs);
        console.log(validationErrors);
        console.log(validationErrorMsgs);
        console.log(errorMsgs);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            return; 
        }

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
        }).catch((error) => {
            console.error('Error during booking:', error);
        })
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
                        {errors.name && <div className="error">{errorMsgs.errorMsgName}</div>}
                    </div>
                    <div className="form-group">
                        <label>Message to Hotel:</label>
                        <textarea name="messageToHotel" value={form.messageToHotel} onChange={handleChange}></textarea>
                    </div>
                    <h2>Payee Information</h2>
                    <div className="form-group">
                        <label>Card Number:</label>
                        <input type="text" name="cardNumber" value={form.cardNumber} onChange={handleChange} />
                        {errors.cardNumber && <div className="error">{errorMsgs.errorMsgCardNumber}</div>}
                    </div>
                    <div className="form-group">
                        <label>Expiry Date:</label>
                        <input type="text" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
                        {errors.expiryDate && <div className="error">{errorMsgs.errorMsgExpiryDate}</div>}
                    </div>
                    <div className="form-group">
                        <label>CVV:</label>
                        <input type="text" name="cvv" value={form.cvv} onChange={handleChange} />
                        {errors.cvv && <div className="error">{errorMsgs.errorMsgCVV}</div>}
                    </div>
                    <button className="submit" type="button" onClick={handleSubmit}>Create Booking</button>
                </form>
            </div>
        </div>
    );
}

export default BookingForm;
