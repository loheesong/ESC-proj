const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { getRoomsAPI } = require('../../apicontrollers/hotelapi'); // Adjust the path as necessary

describe('getRoomsAPI', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should return response data when API call is successful with valid query', async () => {
    const hotelId = 'test-hotel-id';
    const params = { date: '2024-08-01' };
    const mockData = { hotels: ['hotel1'], completed: true };

    mock.onGet(`https://hotelapi.loyalty.dev/api/hotels/${hotelId}/price`, { params }).reply(200, mockData);

    const response = await getRoomsAPI(hotelId, params);

    expect(response.data).toEqual(mockData);
  });

  it('should throw error when API call is successful but data is invalid', async () => {
    const hotelId = 'test-hotel-id';
    const params = { date: '2024-08-01' };
    const mockData = {};

    mock.onGet(`https://hotelapi.loyalty.dev/api/hotels/${hotelId}/price`, { params }).reply(200, mockData);

    try {
      await getRoomsAPI(hotelId, params);
    } catch (error) {
      expect(error.message).toBe('Invalid parameters or no data available');
    }
  });

  it('should throw error when API call fails', async () => {
    const hotelId = 'test-hotel-id';
    const params = { date: '2024-08-01' };

    mock.onGet(`https://hotelapi.loyalty.dev/api/hotels/${hotelId}/price`, { params }).networkError();

    try {
      await getRoomsAPI(hotelId, params);
    } catch (error) {
      expect(error.message).toBe("Network Error");
    }
  });
});
