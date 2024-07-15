const db = require('../models/booking.js');


const deleteBooking = (req, res) => {
   const bookingID = req.params.id;
   const q = "DELETE FROM booking WHERE id = ?";


   db.query(q, [bookingID], (err, data) => {
       if (err) return res.status(500).json(err);
       return res.json("Booking has been deleted successfully!");
   });
};


const getAllBookings = (req, res) => {
   const q = "SELECT * FROM booking";


   db.query(q, (err, data) => {
       if (err) return res.status(500).json(err);

       //converting JSON objects to strings
       /*const booking = data.map(booking => {
        return {
            ...booking, 
            BookingInformation: JSON.stringify(booking.BookingInformation),
            PayeeInformation: JSON.stringify(booking.PayeeInformation)
        };
       });*/
       return res.json(data);
   });
};


module.exports = { deleteBooking, getAllBookings };


