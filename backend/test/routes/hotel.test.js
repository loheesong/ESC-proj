const axios = require("axios");
const NodeCache = require("node-cache");
const {
  getHotelsDetailsAPI,
  getHotelDetailsAPI,
  getHotelPricesAPI
} = require("../../apicontrollers/hotelapi");
const {
  getHotelsWithDetailsAndPrices,
} = require("../../controllers/HotelController");



jest.mock('axios');
// Initialize cache (ttl is time-to-live in seconds)
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); 

// Helper to clear the cache before each test
const clearCache = () => {
    cache.keys().forEach(key => cache.del(key));
  };

describe("getHotelsDetailsAPI", () => {
  test("Valid ID: destination_id=RsBU", async () => {
    const mockResponse = [
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

    // Mock the GET request to the API
    axios.get.mockResolvedValue({ data: mockResponse });

    // Call the function that makes the API request
    const result = await getHotelsDetailsAPI("RsBU");

    // Check the result
    expect(result.data).toEqual(mockResponse);
  });

  test("Invalid ID: destination_id=123", async () => {
    axios.get.mockResolvedValue({ data: [] });

    try {
      await getHotelsDetailsAPI("123");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        "Destination not found or Invalid destination ID"
      );
      expect(error.statusCode).toBe(400);
    }
  });

  test("Empty destination_id", async () => {
    try {
      await getHotelsDetailsAPI(""); // Call with empty destination_id
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Destination ID cannot be empty");
      expect(error.statusCode).toBe(400); // Check for statusCode
    }
  });

  test("API Error", async () => {
    // Simulate an API error
    axios.get.mockRejectedValue({
      response: {
        status: 500,
        data: "Internal Server Error",
      },
    });

    try {
      await getHotelsDetailsAPI("RsBU"); // Use a valid ID for this test
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        "An error occurred while fetching hotel details: undefined"
      );
    }
  });
});

describe("getHotelDetailsAPI", () => {
  test("Valid ID: hotel_id=123", async () => {
    const mockResponse = {
      id: "123",
      name: "The Grand Hotel",
      location: "New York",
      rating: 4.5,
      position: [40.712776, -74.005974],
      imageCount: 30,
      suffix: ".jpg",
      prefix: "https://example.com/images/123/",
    };

    // Mock the GET request to the API
    axios.get.mockResolvedValue({ data: mockResponse });

    // Call the function that makes the API request
    const result = await getHotelDetailsAPI("123");

    // Check the result
    expect(result.data).toEqual(mockResponse);
  });

  test("Invalid ID: hotel_id=999", async () => {
    axios.get.mockResolvedValue({ data: {} });

    try {
      await getHotelDetailsAPI("999");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Hotel not found or Invalid hotel ID");
      expect(error.statusCode).toBe(404); // Check for statusCode
    }
  });

  test("Empty hotel_id", async () => {
    try {
      await getHotelDetailsAPI(""); // Call with empty hotel_id
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Hotel ID cannot be empty");
      expect(error.statusCode).toBe(400); // Check for statusCode
    }
  });

  test("API Error", async () => {
    // Simulate an API error
    axios.get.mockRejectedValue({
      response: {
        status: 500,
        data: "Internal Server Error",
      },
    });

    try {
      await getHotelDetailsAPI("123"); // Use a valid ID for this test
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(
        "An error occurred while fetching hotel details"
      );
    }
  });
});

describe("getHotelPricesAPI", () => {
    const params = {
      hotel_ids: ["050G"],
      checkin: "2024-08-01",
      checkout: "2024-08-07",
      country_code: "US",
      guests: "2",
      partner_id: "partner123"
    };
  
    test("Valid parameters", async () => {
      const mockResponse = {
        data: {
          completed: true,
          hotels: [
            {
              id: "050G",
              lowest_price: 100,
              price: 150,
              converted_price: 120,
              market_rates: [100, 150],
            }
          ]
        }
      };
  
      // Mock the GET request to the API
      axios.get.mockResolvedValue(mockResponse);
  
      // Call the function that makes the API request
      const result = await getHotelPricesAPI(params);
  
      // Check the result
      expect(result.data).toEqual(mockResponse.data);
    });
  
    test("Invalid data response", async () => {
      const mockResponse = {
        data: {}
      };
  
      axios.get.mockResolvedValue(mockResponse);
  
      try {
        await getHotelPricesAPI(params);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Invalid parameters or no data available");
      }
    });
  
    test("Missing parameters", async () => {
      const incompleteParams = {
        checkin: "2024-08-01",
        checkout: "2024-08-07",
      };
  
      try {
        await getHotelPricesAPI(incompleteParams);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Invalid parameters or no data available");
      }
    });
  
    test("API Error", async () => {
      // Simulate an API error
      axios.get.mockRejectedValue({
        response: {
          status: 500,
          data: "Internal Server Error",
        },
      });
  
      try {
        await getHotelPricesAPI(params);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("An error occurred while fetching hotel prices");
      }
    });
  });


