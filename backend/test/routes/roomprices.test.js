const httpMocks = require('node-mocks-http');
const { getRoomPrices } = require('../../controllers/RoomDisplayController');
const { getRoomsAPI } = require('../../apicontrollers/hotelapi');

jest.mock('../../apicontrollers/hotelapi', () => ({
  getRoomsAPI: jest.fn(),
}));

describe("getRoomPrices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return formatted prices when all parameters are provided and API call is successful", async () => {
    getRoomsAPI.mockResolvedValue({
      data: {
        completed: true,
        rooms: [
          {
            roomDescription: "Deluxe Room",
            price: 200,
            description: "<p>Nice room</p>",
            long_description: "<p>Spacious and comfortable</p>",
            amenities: ["WiFi", "TV"],
            images: [{ url: "https://example.com/image1.jpg" }],
          },
        ],
      },
    });

    const req = httpMocks.createRequest({
      method: "GET",
      url: "/rooms",
      params: {
        id: "test-hotel-id",
      },
      query: {
        destination_id: "dest-123",
        checkin: "2024-08-01",
        checkout: "2024-08-10",
        lang: "en",
        currency: "USD",
        country_code: "US",
        guests: 2,
        partner_id: "partner-123",
      },
    });

    const res = httpMocks.createResponse();
    await getRoomPrices(req, res);

    const responseData = res._getJSONData();
    console.log(responseData); // Printing the response data

    expect(res.statusCode).toBe(200);
    expect(responseData).toEqual([
      {
        id: 1,
        name: "Deluxe Room",
        price: 200,
        description: "Spacious and comfortable",
        commonAmenities: ["WiFi", "TV"],
        uniqueAmenities: [],
        imgSrc: "https://example.com/image1.jpg",
      },
    ]);
  });

  it("should return 400 error when required parameters are missing", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/rooms",
      params: {
        id: "test-hotel-id",
      },
      query: {
        checkin: "2024-08-01",
        checkout: "2024-08-10",
        lang: "en",
        currency: "USD",
      },
    });

    const res = httpMocks.createResponse();

    await getRoomPrices(req, res);

    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(400);
    expect(responseData).toEqual({ error: "All parameters are required" });
  });

  it("should return 500 error when fetching room prices fails", async () => {
    getRoomsAPI.mockRejectedValue(new Error("API error"));

    const req = httpMocks.createRequest({
      method: "GET",
      url: "/rooms",
      params: {
        id: "test-hotel-id",
      },
      query: {
        destination_id: "dest-123",
        checkin: "2024-08-01",
        checkout: "2024-08-10",
        lang: "en",
        currency: "USD",
        country_code: "US",
        guests: 2,
        partner_id: "partner-123",
      },
    });

    const res = httpMocks.createResponse();

    await getRoomPrices(req, res);

    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(500);
    expect(responseData).toEqual({
      error: "An error occurred while fetching room prices",
    });
  });
});
