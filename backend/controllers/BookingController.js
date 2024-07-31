const axios = require("axios");
const fs = require("fs");
const {
  create_booking,
  get_bookings_by_userid,
  delete_by_bookingid,
} = require("../models/booking");
const { create } = require("domain");

exports.createBookingFromJSONlist = async (req, res) => {
  const JSONlist = req.body;
  console.log(req.body);
  if (!JSONlist) {
    return res.status(400).json({ error: "error with Json list." });
  }

  //filter bookingsJSON to just get selected feilds
  const item = JSONlist;
  console.log(item);
  const room = item.room;
  const formData = item.formData;
  const hotelData = item.hotelData;
  const bookingInfo = item.bookingInfo;
  const currentDate = new Date();

  const details_json = {
    hotel_name: hotelData.name,
    room_name: room.name,
    location: hotelData.location,
    price: room.price,
    checkin_date: new Date(formData.startDatePicker + "T00:00:00"), //formData.startDatePicker,
    checkout_date: new Date(formData.endDatePicker + "T00:00:00"), //formData.endDatePicker,
    book_date: currentDate,
    room_img_src: room.imgSrc,
    message: bookingInfo.messageToHotel,
    userID: item.userID,
    name: bookingInfo.name,
    cardNumber: bookingInfo.cardNumber,
    expiryDate: bookingInfo.expiryDate,
    cvv: bookingInfo.cvv,
  };

  console.log("Booking Details:", details_json);
  try {
    const bookingCreated = await create_booking(details_json);
    if (bookingCreated) {
      return res.status(200).json({ message: "Successfully added booking." });
    } else {
      return res.status(500).json({ error: "Failed to add booking." });
    }
  } catch (error) {
    console.error("Error in createBookingFromJSONlist:", error);
    return res.status(500).json({ error: "Failed to add booking due to server error." });
  }
};  

exports.getBookingsDisplay = async (req, res) => {
  const  userId  = req.params;
  if (!userId) {
    return res
      .status(400)
      .json({ error: "User ID not found. (required param)" });
  }

  try {
    const bookingDetails = await get_bookings_by_userid(userId.user);

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
      .status(400)
      .json({ error: "Booking ID not found. (required param)" });
  }
  try {
    await delete_by_bookingid(bookingId.bookingid);
    return res
      .status(200)
      .json({ sucess_message: "Booking deleted sucessfully." });
  } catch (error) {
    console.error("Failed to delete booking.", error);
    return res
      .status(500)
      .json({ error: "Error occured while trying to delete booking." });
  }
};
