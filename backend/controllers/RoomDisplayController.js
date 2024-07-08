const axios = require("axios");
const html = require('html-escaper');
const striptags = require('striptags');
const NodeCache = require("node-cache");

// Initialize cache (ttl is time-to-live in seconds)
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // Cache for 10 minutes, check every 2 minutes

exports.getRoomPrices = async (req, res) => {
  const { id } = req.params;
  const { destination_id, checkin, checkout, lang, currency, country_code, guests, partner_id } = req.query;

  if (!id || !destination_id || !checkin || !checkout || !lang || !currency || !country_code || !guests || !partner_id) {
    return res.status(400).json({ error: 'All parameters are required' });
  }

  const cacheKey = `roomPrices_${id}_${destination_id}_${checkin}_${checkout}_${lang}_${currency}_${country_code}_${guests}_${partner_id}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  const fetchRoomPrices = async () => {
    try {
      const response = await axios.get(`https://hotelapi.loyalty.dev/api/hotels/${id}/price`, {
        params: {
          destination_id: destination_id,
          checkin: checkin,
          checkout: checkout,
          lang: lang,
          currency: currency,
          country_code: country_code,
          guests: Array.isArray(guests) ? guests.join("|") : guests,
          partner_id: partner_id,
        }
      });

      if (!response.data.completed) {
        console.log("Search not completed. Retrying...");
        await new Promise(resolve => setTimeout(resolve, 7000)); // Wait for 7 seconds before retrying
        return fetchRoomPrices();
      }
      console.log(response.data);
      return response.data.rooms;
    } catch (error) {
      console.error('Error fetching room prices from external API:', error);
      throw new Error('An error occurred while fetching room prices');
    }
  };

  try {
    const roomPrices = await fetchRoomPrices();

    const formattedPrices = roomPrices.map((room, index) => {
      const description = room.long_description || room.description;
      const decodedDescription = html.unescape(description);
      const plainTextDescription = striptags(decodedDescription);

      return {
        id: index + 1,  // Using index for a unique id
        name: room.roomDescription,
        price: room.price,
        description: plainTextDescription,
        amenities: room.amenities,
        imgSrc: room.images.length > 0 ? room.images[0].url : 'https://via.placeholder.com/100'  // Default image if none available
      };
    });

    cache.set(cacheKey, formattedPrices); // Cache the response
    res.status(200).json(formattedPrices);
  } catch (error) {
    console.error('Error in getRoomPrices function:', error);
    res.status(500).json({ error: error.message });
  }
};
