const axios = require("axios")
const fs = require('fs');
const {
    create_booking,
    get_bookings_by_userid,
    delete_by_bookingid,
} = require('../models/booking');
const { create } = require("domain");


exports.createBookingFromJSONlist = async (req, res) => {

    const { JSONlist } = req.body;
    if (!JSONlist) {return res.status(400).json({error: "error with Json list."});}
    // filter bookingsJSON to just get selected feilds
    const item = JSONlist[0];
    const room = item.room;
    const formData = item.formData;
    const hotelData = item.hotelData;    
    const currentDate = new Date();

    const details_json = {
        hotel_name: hotelData.name,
        room_name: room.name,
        location: hotelData.location,
        price: room.price,
        checkin_date: formData.startDatePicker,
        checkout_date: formData.endDatePicker,
        book_date: currentDate,
        room_img_src: room.imgSrc,
        message: "test1",
        user: "Tom"
    }
     if (await create_booking(details_json)) {
        return res.status(200).json({message: "Succesfully added  booking."});
     } else {
        return res.status(500).json({error: "Failed to add booking."});
     }
    
}


 
exports.getBookingsDisplay = async (req, res) => {
    const {userId} = req.params;
    if (!userId) {
        return res.status(400).json({error: "User ID not found. (required param)"});
    }
    
    try {
        const bookingDetails = await get_bookings_by_userid(userId);

        if (!bookingDetails || bookingDetails.length === 0) {
            return res.status(404).json({error: "No bookings found!"});
        } else {
            return res.status(200).json(bookingDetails);
        }
    } catch(error) {
        console.error("Failed to display booking details.", error);
        res.status(500).json({ error: "Cannot retrieve bookings."});
    }

}

exports.deleteBooking = async (req, res) => {
    const {bookingId} = req.params;
    if (!bookingId) {
        return res.status(400).json({error: "Booking ID not found. (required param)"});
    }
    try {
        await delete_by_bookingid(bookingId);
        return res.status(200).json({sucess_message: "Booking deleted sucessfully."});
    } catch(error){
        console.error("Failed to delete booking.", error);
        return res.status(500).json({error: "Error occured while trying to delete booking."});
    }

}