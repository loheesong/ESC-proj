const axios = require("axios");


const getHotelDetailsAPI = async (id) => {
    return await axios.get(
        `https://hotelapi.loyalty.dev/api/hotels/${id}`
      );
}

const getHotelsDetailsAPI =  async (destination_id) =>{
    return await axios.get(
        `https://hotelapi.loyalty.dev/api/hotels`,
        {
          params: { destination_id },
        });
}

const getHotelPricesAPI =  async (params) =>{
    return await axios.get(
        "https://hotelapi.loyalty.dev/api/hotels/prices",
        { params }
      );
  
}

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