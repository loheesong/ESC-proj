const db = require('../models/booking.js');

const createBooking = (req, res) => {
    const {
        name,
        price,
        checkInDate,
        checkOutDate,
        messageToHotel,
        cardType,
        cardNumber,
        expiryDate,
        cvv
    } = req.body;

    //fixed values passed to booking
    const destinationID = 123;
    const hotelName = "New Horizons";
    const hotelCoverPic = 'https://via.placeholder.com/150';

    const bookingInformation = {
        Name: name,
        Price: price,
        CheckIn: checkInDate,
        CheckOut: checkOutDate,
        MessageToHotel: messageToHotel
    };

    const payeeInformation = {
        CardType: cardType,
        CardNumber: cardNumber,
        ExpiryDate: expiryDate,
        CVV: cvv
    };

    const q = "INSERT INTO booking (DestinationID, HotelName, HotelCoverPic, BookingInformation, PayeeInformation) VALUES (?, ?, ?, ?, ?)";
    
    db.query(q, [
        destinationID,
        hotelName,
        hotelCoverPic,
        JSON.stringify(bookingInformation),
        JSON.stringify(payeeInformation)
    ], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json({ message: "Booking has been created successfully!"});
    });
};
    
module.exports = { createBooking };

