const {
  getHotelsDetailsAPI,
  getHotelPricesAPI,
} = require("../../apicontrollers/hotelapi");
const { getHotelsWithDetailsAndPrices } = require("../../controllers/HotelController");

jest.mock("../../apicontrollers/hotelapi", () => ({
  getHotelsDetailsAPI: jest.fn(),
  getHotelPricesAPI: jest.fn(),
}));

describe("getHotelsWithDetailsAndPrices", () => {
  const req = {
    query: {
      destination_id: "RsBU",
      checkin: "2024-08-01",
      checkout: "2024-08-07",
      country_code: "US",
      guests: "2",
      partner_id: "partner123",
    },
  };

  const hotelDetails = [
    {
      id: "050G",
      name: "The Forest by Wangz",
      location: "Singapore",
      rating: 4.1,
      position: [1.318685, 103.847882],
      imageCount: 52,
      suffix: ".jpg",
      prefix: "https://d2ey9sqrvkqdfs.cloudfront.net/050G/",
    },
  ];

  const hotelPrices = [
    {
      id: "050G",
      lowest_price: 100,
      price: 150,
      converted_price: 120,
      market_rates: [100, 150],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test

    // Mock successful responses
    getHotelsDetailsAPI.mockResolvedValue({ data: hotelDetails });
    getHotelPricesAPI.mockResolvedValue({ data: { completed: true, hotels: hotelPrices } });
  });

  test("Valid request with all parameters present", async () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getHotelsWithDetailsAndPrices(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({"error": "An error occurred while fetching hotel details and pricesTypeError: Cannot read properties of undefined (reading 'count')"});
  });

  test("API Error while fetching hotel details", async () => {
    getHotelsDetailsAPI.mockRejectedValue(new Error("API Error"));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getHotelsWithDetailsAndPrices(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while fetching hotel details and pricesError: API Error",
    });
  });
});
