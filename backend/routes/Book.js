const express = require("express");
const router = express.Router();

// Temporary storage for booking data (you might want to use a database in a real application)
let allBookings = [];

// POST endpoint to receive booking data
router.post("/", (req, res) => {
  const bookingData = req.body;
  allBookings = [];
  console.log('Received booking data:', bookingData);
  allBookings.push(bookingData); // Store booking data (for demonstration purposes)
  res.json({ success: true, message: "Booking successful!" });
});

// GET endpoint to retrieve all booking data
router.get("/", (req, res) => {
  res.json(allBookings);
});

module.exports = router;
