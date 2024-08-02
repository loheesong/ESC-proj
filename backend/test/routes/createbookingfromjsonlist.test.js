const express = require('express');
const bodyParser = require('body-parser');
const { createBookingFromJSONlist } = require('../../controllers/BookingController');
const { create_booking } = require('../../models/booking');

// Mock the create_booking function
jest.mock('../../models/booking', () => ({
  create_booking: jest.fn(),
}));

describe('createBookingFromJSONlist', () => {
  let app;
  let req, res;

  beforeAll(() => {
    app = express();
    app.use(bodyParser.json());
  });

  beforeEach(() => {
    // Mock the req and res objects
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should return 400 if JSON list is not provided', async () => {
    req.body = {}; // No JSON list provided

    await createBookingFromJSONlist(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'error with Json list.' });
  });

  it('should return 200 and success message if booking is created successfully', async () => {
    // Mock create_booking to return true
    create_booking.mockResolvedValueOnce(true);

    req.body = {
      room: { name: 'Deluxe Room', price: 200, imgSrc: 'room.jpg' },
      formData: { startDatePicker: '2023-08-01', endDatePicker: '2023-08-05' },
      hotelData: { name: 'Grand Hotel', location: 'City Center' },
      bookingInfo: { messageToHotel: 'Please prepare extra towels', name: 'John Doe', cardNumber: '1234567890123456', expiryDate: '12/25', cvv: '123' },
      userID: 1,
    };

    await createBookingFromJSONlist(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Successfully added booking.' });
  });

  it('should return 500 if booking creation fails', async () => {
    // Mock create_booking to return false
    create_booking.mockResolvedValueOnce(false);

    req.body = {
      room: { name: 'Deluxe Room', price: 200, imgSrc: 'room.jpg' },
      formData: { startDatePicker: '2023-08-01', endDatePicker: '2023-08-05' },
      hotelData: { name: 'Grand Hotel', location: 'City Center' },
      bookingInfo: { messageToHotel: 'Please prepare extra towels', name: 'John Doe', cardNumber: '1234567890123456', expiryDate: '12/25', cvv: '123' },
      userID: 1,
    };

    await createBookingFromJSONlist(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add booking.' });
  });

  it('should return 500 if there is a server error', async () => {
    // Mock create_booking to throw an error
    create_booking.mockImplementationOnce(() => {
      throw new Error('Server error');
    });

    req.body = {
      room: { name: 'Deluxe Room', price: 200, imgSrc: 'room.jpg' },
      formData: { startDatePicker: '2023-08-01', endDatePicker: '2023-08-05' },
      hotelData: { name: 'Grand Hotel', location: 'City Center' },
      bookingInfo: { messageToHotel: 'Please prepare extra towels', name: 'John Doe', cardNumber: '1234567890123456', expiryDate: '12/25', cvv: '123' },
      userID: 1,
    };

    await createBookingFromJSONlist(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add booking due to server error.' });
  });
});
