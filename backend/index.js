/**
 * This file acts as the controller in the backend 
 * It serves information as required by the frontend through
 * API get requests to the specified route 
 */

// import statements 
const express = require('express')
const app = express() 
const cors = require('cors');

const apiRouter = require('./routes/Api');
const landingRouter = require('./routes/Landing');
const searchDestinationsRouter = require('./routes/SearchDestinationRoute');
const hotelsRouter = require('./routes/HotelsRoute');
const roomDisplayRouter = require('./routes/RoomDisplayRoute');
const bookHotelRouter = require('./routes/BookHotelRoute');

const bookingModel = require('./models/booking');

// constants here 
const PORT = 3001

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'],
    })
);

// sync DBs here 
bookingModel.sync()

// define routes here 
app.use("/", landingRouter);
app.use("/destinations", searchDestinationsRouter);
app.use("/hotels", hotelsRouter);
app.use("/rooms", roomDisplayRouter);
app.use("/book_hotel", bookHotelRouter);

// Utility endpoints here
app.use("/api", apiRouter);

app.listen(PORT, () => {
    console.log("Server running on port 3001");
})