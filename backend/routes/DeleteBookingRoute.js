const express = require('express');
const { deleteBooking, getAllBookings } = require('../controllers/DeleteBookingController.js');
const router = express.Router();

router.delete("/booking/:id", deleteBooking);
router.get("/booking", getAllBookings);

module.exports = router;
