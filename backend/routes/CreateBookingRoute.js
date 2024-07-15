const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/CreateBookingController');

router.post('/', createBooking);
module.exports = router;


