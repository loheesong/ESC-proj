const axios = require("axios");
const fs = require("fs");
const {
  create_booking,
  get_bookings_by_userid,
  delete_by_bookingid,
} = require("../models/booking");
const { create } = require("domain");
const user = require("../models/user");

exports.createBookingFromJSONlist = async (req, res) => {
  try {
    const { room, formData, hotelData, bookingInfo, userID } = req.body;

    if (!room || !formData || !hotelData || !bookingInfo || !userID) {
      return res.status(400).json({ error: 'error with Json list.' });
    }

    const details_json = {
      hotel_name: hotelData.name,
      room_name: room.name,
      location: hotelData.location,
      price: room.price,
      checkin_date: new Date(formData.startDatePicker).toISOString(),
      checkout_date: new Date(formData.endDatePicker).toISOString(),
      book_date: new Date().toISOString(),
      room_img_src: room.imgSrc,
      message: bookingInfo.messageToHotel,
      userID: userID,
      name: bookingInfo.name,
      cardNumber: bookingInfo.cardNumber,
      expiryDate: bookingInfo.expiryDate,
      cvv: bookingInfo.cvv,
    };
    console.log(details_json);
    const result = await create_booking(details_json);

    if (!result) {
      return res.status(500).json({ error: 'Failed to add booking.' });
    }

    return res.status(200).json({ message: 'Successfully added booking.' });
  } catch (error) {
    console.error("Error in createBookingFromJSONlist:", error);
    return res.status(500).json({ error: "Failed to add booking due to server error." });
  }
};


exports.getBookingsDisplay = async (req, res) => {
  const  userId  = req.params; // Ensure correct extraction from req.params
  console.log(userId.user);
  if (!userId) {
    return res
      .status(400)
      .json({ error: "User ID not found. (required param)" });
  }

  try {
    const bookingDetails = await get_bookings_by_userid(userId);

    if (!bookingDetails || bookingDetails.length === 0) {
      return res.status(404).json({ empty: "No bookings found!" });
    } else {
      return res.status(200).json(bookingDetails);
    }
  } catch (error) {
    console.error("Failed to display booking details.", error);
    res.status(500).json({ error: "Cannot retrieve bookings." });
  }
};


exports.deleteBooking = async (req, res) => {
  const bookingId  = req.params;
  if (!bookingId) {
    return res
      .status(404)
      .json({ error: "Booking ID not found. (required param)" });
  }
  try {
    await delete_by_bookingid(bookingId.bookingid);
    return res
      .status(200)
      .json({ success_message: "Booking deleted successfully." });
  } catch (error) {
    console.error("Failed to delete booking.", error);
    return res
      .status(500)
      .json({ error: "Error occurred while trying to delete booking." });
  }
};
