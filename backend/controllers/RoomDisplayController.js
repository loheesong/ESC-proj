const axios = require("axios");

exports.getRoomPrices = async (req, res) => {
  const { id } = req.params;
  const { destination_id, checkin, checkout, lang, currency, country_code, guests, partner_id } = req.query;

  if (!id || !destination_id || !checkin || !checkout || !lang || !currency || !country_code || !guests || !partner_id) {
    return res.status(400).json({ error: 'All parameters are required' });
  }

  try {
    const response = await axios.get(`https://hotelapi.loyalty.dev/api/hotels/${id}/price`, {
      params: {
        destination_id,
        checkin,
        checkout,
        lang,
        currency,
        country_code,
        guests,
        partner_id
      }
    });

    const roomPrices = response.data.rooms;
    const formattedPrices = roomPrices.map((room, index) => ({
      id: index + 1,  // Using index for a unique id
      name: room.room_type,
      description: room.long_description || room.description,
      amenities: room.amenities,
      imgSrc: room.images.length > 0 ? room.images[0] : 'https://via.placeholder.com/100'  // Default image if none available
    }));

    res.status(200).json(formattedPrices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching room prices' });
  }
};
