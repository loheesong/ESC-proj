/*
CREATE USER 'test'@'localhost' IDENTIFIED BY 'testy';
CREATE DATABASE testhotel;
GRANT ALL PRIVILEGES ON testhotel.* TO 'test'@'localhost';
FLUSH PRIVILEGES;
*/
require('dotenv').config({path: '.env.test'});
const db = require("../../models/db");
console.log(process.env.DB_NAME)
const { create_booking, get_bookings_by_userid, delete_by_bookingid, sync } = require('../../models/booking'); // Import the functions
const { generateRandomBookingData } = require('./fuzzy'); // Import the function to generate random booking data
const fs = require('fs'); // Import the fs module

const logError = (message, data) => {
  const errorLog = {
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  fs.appendFileSync('error_log.json', JSON.stringify(errorLog, null, 2) + ',\n', 'utf8');
};

const cleanUpDatabase = async () => {
    try {
      // Ensure the table_name is defined
      const table_name = "bookings";
      let sql = `DROP TABLE IF EXISTS ${table_name}`;
      await db.cnx.query(sql);
      console.log("Test database cleaned up.");
    } catch (error) {
      console.error("Failed to clean up test database:", error);
      logError('Failed to clean up test database', { error: error.message });
    }
  };
  

const runFuzzTests = async () => {
  try {
    // Ensure the database schema is synced
    await sync();
    console.log("Database schema synced.");

    let cycleCount = 0;
    let userID;
    while (cycleCount < 200) {
 
        try {
          console.log(`Cycle ${cycleCount} started.`);
          // Test creating a booking
          const bookingData = generateRandomBookingData();
          userID =  bookingData.userID;
          const creationSuccess = await create_booking(bookingData);
          if (!creationSuccess) {
            const errorMessage = `Test failed for createBooking: ${JSON.stringify(bookingData)}`;
            console.error(errorMessage);
            logError(errorMessage, bookingData);
            break;
          }
  
          // Retrieve the user ID from the generated booking data
  

  
          // Get all bookings for a specific user
          const bookings = await get_bookings_by_userid({user: userID});
          if (!Array.isArray(bookings)) {
            const errorMessage = 'Test failed for getAllBookings';
            console.error(errorMessage);
            logError(errorMessage, { user_id });
            break;
          }
  
          if (bookings.length > 0) {
            const bookingId = bookings[0].booking_id;
  
            // Get a specific booking
            const bookingDetails = bookings.find(b => b.booking_id === bookingId);
            if (!bookingDetails) {
              const errorMessage = `Test failed for getBooking: ${bookingId}`;
              console.error(errorMessage);
              logError(errorMessage, { bookingId });
              break;
            }
            console.log("booking id: " + bookingId)
            // Delete a booking
            const deletionSuccess = await delete_by_bookingid(bookingId);
            if (!deletionSuccess) {
              const errorMessage = `Test failed for deleteBooking: ${bookingId}`;
              console.error(errorMessage);
              logError(errorMessage, { bookingId });
              break;
            }
          }
  
          cycleCount++;
          console.log(`Cycle ${cycleCount} completed.`);
        } catch (error) {
          const errorMessage = 'An error occurred during fuzz testing';
          console.error(errorMessage, error);
          logError(errorMessage, { error: error.message });
          break;
        }
      }
  
      // Clean up the test database after testing
      await cleanUpDatabase();
    } catch (error) {
      console.error('Failed to sync database schema', error);
      logError('Failed to sync database schema', { error: error.message });
    }
  };
  
  // Run the tests
  runFuzzTests();