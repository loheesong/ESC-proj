const crypto = require('crypto');

// app.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());


// Generates a random string of the specified length
const randomString = (length) => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};

function generateRandomIntegerOfLength(length) {
    if (length < 1) {
      throw new Error('Length should be at least 1');
    }
  
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

const generateRandomBookingData = () => {
    // Helper function to format dates as YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split('T')[0];
  
    // Generate random future dates
    const randomCheckinDate = new Date(Date.now() + Math.floor(Math.random() * 10000000000)); // Random future date
    const randomCheckoutDate = new Date(randomCheckinDate.getTime() + Math.floor(Math.random() * 10000000000) + 86400000); // Random future date after check-in
  
    const randomMonth = Math.floor(Math.random() * 12) + 1; // 1-12
    const randomYear = Math.floor(Math.random() * 10) + 23; // 23-32 for years 2023-2032
  
    // Ensure month is two digits
    const formattedMonth = randomMonth.toString().padStart(2, '0');
    const formattedYear = randomYear.toString().slice(-2); // Get last two digits
  
    return {
      hotel_name: randomString(10),
      room_name: randomString(10),
      location: randomString(10),
      price: "SGD " + Math.floor(Math.random() * 10000).toString(),
      checkin_date: formatDate(randomCheckinDate), // Format as YYYY-MM-DD
      checkout_date: formatDate(randomCheckoutDate), // Format as YYYY-MM-DD
      book_date: formatDate(new Date()), // Today's date in YYYY-MM-DD format
      room_img_src: "dog.jpg",
      message: randomString(50),
      userID: Math.floor(Math.random() * 10000), // Updated to user_id
      name: randomString(10), // Updated to guest_name
      cardNumber: generateRandomIntegerOfLength(16).toString(), // Updated to card_number
      expiryDate: `${formattedMonth}/${formattedYear}`, // Updated to MM/YY format
      cvv: generateRandomIntegerOfLength(3).toString() // Updated to card_cvv
    };
  };
  
  module.exports ={generateRandomBookingData}