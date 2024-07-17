const express = require("express");
const router = express.Router();
const {
    createBookingFromJSONlist,
    getBookingsDisplay,
    deleteBooking,
} = require('../controllers/BookingController');

router.post('/submitbooking', createBookingFromJSONlist);

router.post('/deletebooking/:bookingid', deleteBooking);

router.get('/getbookings/:user', getBookingsDisplay);

module.exports = router;