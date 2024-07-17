const express = require("express");
const request = require("supertest");
const axios = require("axios");
const NodeCache = require("node-cache");
const {
  getHotelDetailsFromHotelID,
} = require("../../controllers/HotelController"); // Adjust the path accordingly

jest.mock("axios");
jest.mock("node-cache");

const cache = new NodeCache();
jest.mock("node-cache", () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
  }));
});

const app = express();
app.get("/hotels/hotel", getHotelDetailsFromHotelID);

describe("GET /hotels/hotel", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the hotel details for the given ID", async () => {
    const hotelDetails = {
      id: "050G",
      imageCount: 52,
      latitude: 1.318685,
      longitude: 103.847882,
      name: "The Forest by Wangz",
      address: "145A Moulmein Road",
      address1: "145A Moulmein Road",
      rating: 4,
      trustyou: {
        id: "dede9a48-2f7c-49ae-9bd0-942a40e245e7",
        score: {
          overall: 81,
          kaligo_overall: 4.1,
          solo: 77,
          couple: 80,
          family: 82,
          business: 71,
        },
      },
      categories: {
        overall: { name: "Overall", score: 94, popularity: 4 },
        romantic_hotel: {
          name: "Romantic Hotel",
          score: 72,
          popularity: 8.61548461538462,
        },
        family_hotel: {
          name: "Family Hotel",
          score: 75,
          popularity: 11.2643140468227,
        },
        business_hotel: {
          name: "Business Hotel",
          score: 85,
          popularity: 23.8462538461539,
        },
      },
      amenities_ratings: [
        { name: "Food", score: 100 },
        { name: "WiFi", score: 100 },
        { name: "Service", score: 99 },
        { name: "Amenities", score: 98 },
        { name: "Location", score: 97 },
        { name: "Comfort", score: 92 },
        { name: "Breakfast", score: 80 },
        { name: "Room", score: 79 },
      ],
      description:
        "Property Location The Forest by Wangz is in the heart of Singapore, walking distance from Tan Tock Seng Hospital and United Square Mall. This 4-star aparthotel is close to National Orchid Garden and Chinatown Heritage Center.Rooms Make yourself at home in one of the 38 individually furnished guestrooms, featuring kitchenettes with refrigerators and stovetops. Wired and wireless Internet access is complimentary, while 40-inch LED televisions and DVD players provide entertainment. Conveniences include safes and desks, as well as phones with free local calls.Amenities Be sure to enjoy recreational amenities including an outdoor pool and a fitness center. Additional amenities include complimentary wireless Internet access, concierge services, and barbecue grills.Dining A complimentary breakfast is included.Business, Other Amenities Featured amenities include complimentary newspapers in the lobby, a 24-hour front desk, and luggage storage. Free self parking is available onsite.",
      amenities: {
        airConditioning: true,
        clothingIron: true,
        continentalBreakfast: true,
        dataPorts: true,
        hairDryer: true,
        kitchen: true,
        outdoorPool: true,
        parkingGarage: true,
        safe: true,
        tVInRoom: true,
        voiceMail: true,
      },
      original_metadata: {
        name: null,
        city: "Singapore",
        state: null,
        country: "SG",
      },
      image_details: {
        suffix: ".jpg",
        count: 52,
        prefix: "https://d2ey9sqrvkqdfs.cloudfront.net/050G/",
      },
      hires_image_index:
        "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51",
      number_of_images: 54,
      default_image_index: 1,
      imgix_url: "https://kaligo-web-expedia.imgix.net",
      cloudflare_image_url: "https://www.kaligo-staging.xyz/images/new",
    };

    cache.get.mockReturnValue(null); // Ensure cache miss
    axios.get.mockResolvedValue({ data: hotelDetails });

    const response = await request(app).get("/hotels/hotel?id=050G");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(hotelDetails);
  });
  it("should return 400 if no hotel ID is provided", async () => {
    const response = await request(app).get("/hotels/hotel/");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Hotel ID is required");
  });
  it("should return 500 if an error occurs while fetching hotel details", async () => {
    const errorMessage = "API error"; // Simulated error message
    axios.get.mockRejectedValue(new Error(errorMessage)); // Mock axios to reject with an error

    const response = await request(app).get("/hotels/hotel?id=050G");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      "An error occurred while fetching hotel details"
    );
  });
});
