const request = require('supertest');
const express = require('express');
const app = express();
const { deleteBooking } = require('../../controllers/BookingController'); // Update the path accordingly

// Mocking the delete_by_bookingid function
jest.mock('../../models/booking', () => ({
  delete_by_bookingid: jest.fn()
}));

const { delete_by_bookingid } = require('../../models/booking'); // Update the path accordingly

// Set up the Express app to use the controller
app.delete('/bookings/deletebooking/:bookingid', deleteBooking);

describe('deleteBooking', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 with success message for valid bookingId with successful deletion', async () => {
    // Arrange
    delete_by_bookingid.mockResolvedValue(); // Mock successful deletion

    // Act
    const response = await request(app).delete('/bookings/deletebooking/valid-booking-id');

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success_message: "Booking deleted successfully." });
  });

  it('should return 400 for missing bookingId parameter', async () => {
    // Act
    const response = await request(app).delete('/bookings/deletebooking/');

    // Assert
    expect(response.statusCode).toBe(404);
  });

  it('should return 500 for server error while deleting booking', async () => {
    // Arrange
    delete_by_bookingid.mockRejectedValue(new Error('Database error'));

    // Act
    const response = await request(app).delete('/bookings/deletebooking/error-booking-id');

    // Assert
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Error occurred while trying to delete booking." });
  });
});
