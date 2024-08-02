const request = require('supertest');
const express = require('express');
const app = express();
const { getBookingsDisplay } = require('../../controllers/BookingController'); // Update the path accordingly

// Mocking the get_bookings_by_userid function
jest.mock('../../models/booking', () => ({
  get_bookings_by_userid: jest.fn()
}));

const { get_bookings_by_userid } = require('../../models/booking'); // Update the path accordingly

// Set up the Express app to use the controller
app.get('/bookings/getbookings/:userId', getBookingsDisplay);

describe('getBookingsDisplay', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 for missing userId', async () => {
    // Act
    const response = await request(app).get('/bookings/getbookings/'); // Missing userId

    // Assert
    console.log(response.body); // Debug output to ensure the response is as expected
    expect(response.statusCode).toBe(404);
  });

  it('should return 404 when no bookings are found', async () => {
    // Arrange
    get_bookings_by_userid.mockResolvedValue([]);

    // Act
    const response = await request(app).get('/bookings/getbookings/test-user-id');

    // Assert
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ empty: "No bookings found!" });
  });

  it('should return 200 with booking details when bookings are found', async () => {
    // Arrange
    const mockBookingDetails = [
      {
        bookingId: '123',
        hotelId: 'test-hotel-id',
        roomId: 'test-room-id',
        checkinDate: '2024-08-01',
        checkoutDate: '2024-08-10',
        price: 200
      }
    ];
    get_bookings_by_userid.mockResolvedValue(mockBookingDetails);

    // Act
    const response = await request(app).get('/bookings/getbookings/test-user-id');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockBookingDetails);
  });

  it('should return 500 if there is a server error', async () => {
    // Arrange
    get_bookings_by_userid.mockRejectedValue(new Error('Database error'));

    // Act
    const response = await request(app).get('/bookings/getbookings/test-user-id');

    // Assert
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Cannot retrieve bookings." });
  });
});
