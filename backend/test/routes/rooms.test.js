const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const { getRoomsAPI } = require("../../apicontrollers/hotelapi");
const { getRoomPrices } = require("../../controllers/RoomDisplayController");
const httpMocks = require("node-mocks-http");
const html = require("html-escaper"); // Ensure to import html-escaper if not already installed
const striptags = require("striptags"); // Ensure to import striptags if not already installed

describe("getRoomsAPI", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it("should return response data when API call is successful and data is valid", async () => {
    const id = "test-hotel-id";
    const params = { date: "2024-08-01" };
    const mockData = { hotels: ["hotel1"], completed: true };

    mock
      .onGet(`https://hotelapi.loyalty.dev/api/hotels/${id}/price`, { params })
      .reply(200, mockData);

    const response = await getRoomsAPI(id, params);

    expect(response.data).toEqual(mockData);
  });

  it("should return an error when API call is successful but data is invalid", async () => {
    const id = "test-hotel-id";
    const params = { date: "2024-08-01" };
    const mockData = {};

    mock
      .onGet(`https://hotelapi.loyalty.dev/api/hotels/${id}/price`, { params })
      .reply(200, mockData);

    const response = await getRoomsAPI(id, params);

    expect(response).toEqual(Error("Invalid parameters or no data available"));
  });

  it("should return an error when API call fails", async () => {
    const id = "test-hotel-id";
    const params = { date: "2024-08-01" };

    mock
      .onGet(`https://hotelapi.loyalty.dev/api/hotels/${id}/price`, { params })
      .networkError();

    const response = await getRoomsAPI(id, params);

    expect(response).toEqual(
      Error(`Something went wrong while fetching rooms for hotel id: ${id}`)
    );
  });
});

