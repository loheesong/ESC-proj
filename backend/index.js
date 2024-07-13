const express = require('express');
const app = express();
const cors = require('cors');
const searchRouter = require('./routes/Search');
const apiRouter = require('./routes/Api');
const landingRouter = require('./routes/Landing');
const searchDestinationsRouter = require('./routes/SearchDestinationRoute');
const hotelsRouter = require('./routes/HotelsRoute');
const roomDisplayRouter = require('./routes/RoomDisplayRoute');
const bookHotelRouter = require('./routes/BookHotelRoute');
const deleteBookingRouter = require('./routes/DeleteBookingRoute');
const db = require('./models/Booking.js');
// constants here 
const PORT = 3001;

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'],
    })
);

// Middleware
app.use(express.json());

// define routes here 
app.use("/", landingRouter);
app.use("/destinations", searchDestinationsRouter);
app.use("/hotels", hotelsRouter);
app.use("/rooms", roomDisplayRouter);
app.use("/book_hotel", bookHotelRouter);
app.use("/search", searchRouter);
app.use("/booking", deleteBookingRouter);

// Utility endpoints here
app.use("/api", apiRouter);

// Additional Booking Route for getting bookings
app.get("/booking", (req, res) => {
    const q = "SELECT * FROM booking";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.delete("/booking/:id", (req, res) =>{
    const bookingId = req.params.id;
    const q = "DELETE FROM booking WHERE id = ?";

    db.query(q, [bookingId], (err, data) => {
        if(err) return res.json(err);
        return res.json("Booking has been deleted successfuly");
    })
})

app.listen(PORT, () => {
    console.log("Server running on port 3001");
});
