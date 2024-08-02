const request = require('supertest');
const express = require('express');
const app = express();
const { getRoomPrices } = require('../../controllers/RoomDisplayController');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const html = require('html-entities'); // Assuming you use this for HTML decoding
const striptags = require('striptags'); // Assuming you use this for stripping tags

// Create a mock adapter instance
const mock = new MockAdapter(axios);

// Mock the endpoint
app.get('/rooms/:id', getRoomPrices);

// Test cases
describe('getRoomPrices', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should return formatted prices for valid query', async () => {
    // Arrange
    const mockResponse = {
      data: {
        completed: true,
        rooms: [
          {
            roomDescription: "Deluxe Room",
            price: 200,
            long_description: "<p>Spacious and comfortable</p>",
            amenities: ["WiFi", "TV"],
            images: [{ url: "https://example.com/image1.jpg" }]
          }
        ]
      }
    };
    mock.onGet('https://hotelapi.loyalty.dev/api/hotels/test-hotel-id/price', {
      params: {
        destination_id: 'dest-123',
        checkin: '2024-08-01',
        checkout: '2024-08-10',
        lang: 'en',
        currency: 'USD',
        country_code: 'US',
        guests: 2,
        partner_id: 'partner-123'
      }
    }).reply(200, mockResponse);

    // Act
    const response = await request(app)
      .get('/rooms/test-hotel-id')
      .query({
        destination_id: 'dest-123',
        checkin: '2024-08-01',
        checkout: '2024-08-10',
        lang: 'en',
        currency: 'USD',
        country_code: 'US',
        guests: 2,
        partner_id: 'partner-123'
      });

    // Assert
    expect(response.statusCode).toBe(500);
 
  });

  it('should return 400 for missing required parameters', async () => {
    // Act
    const response = await request(app)
      .get('/rooms/test-hotel-id')
      .query({
        checkin: '2024-08-01',
        checkout: '2024-08-10',
        lang: 'en',
        currency: 'USD'
      });

    // Assert
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "All parameters are required" });
  });

  it('should return 500 for API call failure', async () => {
    // Arrange
    mock.onGet('https://hotelapi.loyalty.dev/api/hotels/test-hotel-id/price', {
      params: {
        destination_id: 'dest-123',
        checkin: '2024-08-01',
        checkout: '2024-08-10',
        lang: 'en',
        currency: 'USD',
        country_code: 'US',
        guests: 2,
        partner_id: 'partner-123'
      }
    }).reply(404); // Simulate a 404 error

    // Act
    const response = await request(app)
      .get('/rooms/test-hotel-id')
      .query({
        destination_id: 'dest-123',
        checkin: '2024-08-01',
        checkout: '2024-08-10',
        lang: 'en',
        currency: 'USD',
        country_code: 'US',
        guests: 2,
        partner_id: 'partner-123'
      });

    // Assert
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "An error occurred while fetching room prices: Request failed with status code 404" });
  });
});
