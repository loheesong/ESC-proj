const axios = require("axios");


const getHotelDetailsAPI = async (id) => {
  try {
    const response = await axios.get(`https://hotelapi.loyalty.dev/api/hotels/${id}`);
    if (!response.data || Object.keys(response.data).length === 0) {
      const error = new Error("Hotel not found or Invalid hotel ID");
      error.statusCode = 404;
      throw error;
    }
    return response;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Hotel not found or Invalid hotel ID");
    }
    throw new Error('An error occurred while fetching hotel details');
  }
};


const getHotelsDetailsAPI = async (destination_id) => {
  try {
    const response = await axios.get(`https://hotelapi.loyalty.dev/api/hotels`, {
      params: { destination_id },
    });
    if (response.data.length === 0) {
      const error = new Error("Destination not found or Invalid destination ID");
      error.statusCode = 400;
      throw error;
    }
    return response;
  } catch (error) {
    throw error.response && error.response.status === 400 ? error : new Error('An error occurred while fetching hotel details');
  }
};



const getHotelPricesAPI = async (params) => {
  try {
    const response = await axios.get("https://hotelapi.loyalty.dev/api/hotels/prices", { params });
    if (!response.data || !response.data.hotels || !response.data.completed) {
      throw new Error("Invalid parameters or no data available");
    }
    return response;
  } catch (error) {
    throw new Error("An error occurred while fetching hotel prices");
  }
};


const getRoomsAPI = async (id, p) =>{
    return await axios.get(
        `https://hotelapi.loyalty.dev/api/hotels/${id}/price`,
        {
          params: p,
        }
      );
}


module.exports = {
    getHotelDetailsAPI,
    getHotelsDetailsAPI,
    getHotelPricesAPI,
    getRoomsAPI,
};