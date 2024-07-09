const axios = require("axios");
const NodeCache = require("node-cache");

// Initialize cache (ttl is time-to-live in seconds)
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // Cache for 10 minutes, check every 2 minutes

exports.getHotelDetailsFromHotelID = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Hotel ID is required" });
  }

  const cacheKey = `hotelDetails_${id}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  try {
    const response = await axios.get(
      `https://hotelapi.loyalty.dev/api/hotels/${id}`
    );
    cache.set(cacheKey, response.data); // Cache the response
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching hotel details" });
  }
};

exports.getHotelsFromDestinationID = async (req, res) => {
  const { destination_id } = req.query;

  if (!destination_id) {
    return res.status(400).json({ error: "Destination ID is required" });
  }

  const cacheKey = `hotelsFromDestination_${destination_id}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  try {
    const response = await axios.get(
      `https://hotelapi.loyalty.dev/api/hotels`,
      {
        params: { destination_id },
      }
    );

    const hotels = response.data;

    const formattedHotels = hotels.map((hotel) => ({
      id: hotel.id,
      name: hotel.name,
      location: hotel.original_metadata?.city || "Unknown location",
      rating: hotel.trustyou?.score?.kaligo_overall || "No rating available",
      position: [hotel.latitude, hotel.longitude],
      imageCount: hotel.image_details.count,
      suffix: hotel.image_details.suffix,
      prefix: hotel.image_details.prefix,
    }));

    cache.set(cacheKey, formattedHotels); // Cache the response
    res.status(200).json(formattedHotels);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching destination details" });
  }
};

exports.getHotelPricesByDestinationID = async (req, res) => {
  const {
    destination_id,
    checkin,
    checkout,
    country_code,
    guests,
    partner_id,
  } = req.query;

  if (
    !destination_id ||
    !checkin ||
    !checkout ||
    !country_code ||
    !guests ||
    !partner_id
  ) {
    return res.status(400).json({ error: "All parameters are required" });
  }

  const cacheKey = `hotelPrices_${destination_id}_${checkin}_${checkout}_${country_code}_${guests}_${partner_id}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.status(200).json(cachedData);
  }

try {
  const params = {
    destination_id,
    checkin,
    checkout,
    lang: "en_US",
    currency: "USD",
    country_code,
    guests: Array.isArray(guests) ? guests.join("|") : guests,
    partner_id,
  };

  const fetchHotelPrices = async () => {
    try {
      const response = await axios.get(
        "https://hotelapi.loyalty.dev/api/hotels/prices",
        { params }
      );

      if (!response.data.completed) {
        console.log("Search not completed. Retrying...");
        await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for 5 seconds before retrying
        return fetchHotelPrices();
      }
      return response.data.hotels;
    } catch (error) {
      throw new Error("An error occurred while fetching room prices");
    }
  };

  const hotelPrices = await fetchHotelPrices();
  const formattedHotelsPrices = hotelPrices.map((hotel) => {
    console.log(hotel);
    return {
      id: hotel.id,
      searchRank: hotel.searchRank,
      points: hotel.points,
      lowest_price: hotel.lowest_price,
      price: hotel.price,
      converted_price: hotel.converted_price,
      market_rates: hotel.market_rates.map((rate) => rate.rate),
    };
  });

  cache.set(cacheKey, formattedHotelsPrices); // Cache the response
  res.status(200).json(formattedHotelsPrices);
} catch (error) {
  console.error(error);
  res
    .status(500)
    .json({ error: "An error occurred while fetching hotel prices" });
}
};

exports.getHotelsWithDetailsAndPrices = async (req, res) => {
  const { destination_id, checkin, checkout, country_code, guests, partner_id } = req.query;

  if (!destination_id || !checkin || !checkout || !country_code || !guests || !partner_id) {
    return res.status(400).json({ error: "All parameters are required" });
  }

  const cacheKey = `hotelsWithDetailsAndPrices_${destination_id}_${checkin}_${checkout}_${country_code}_${guests}_${partner_id}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  try {
    // Fetch hotel details
    const hotelsResponse = await axios.get(
      `https://hotelapi.loyalty.dev/api/hotels`,
      { params: { destination_id } }
    );

    // Fetch hotel prices
    const fetchHotelPrices = async () => {
      try {
        const params = {
          destination_id,
          checkin,
          checkout,
          lang: "en_US",
          currency: "USD",
          country_code,
          guests: Array.isArray(guests) ? guests.join("|") : guests,
          partner_id,
        };

        const response = await axios.get(
          "https://hotelapi.loyalty.dev/api/hotels/prices",
          { params }
        );

        if (!response.data.completed) {
          console.log("Search not completed. Retrying...");
          await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for 0.5 seconds before retrying
          return fetchHotelPrices();
        }

        return response.data.hotels;
      } catch (error) {
        throw new Error("An error occurred while fetching room prices");
      }
    };

    const hotelPrices = await fetchHotelPrices();

    // Combine hotel details with prices
    const hotelsWithDetailsAndPrices = hotelsResponse.data.map(hotel => {
      const priceInfo = hotelPrices.find(price => price.id === hotel.id);
      return {
        id: hotel.id,
        name: hotel.name,
        location: hotel.original_metadata?.city || "Unknown location",
        rating: hotel.trustyou?.score?.kaligo_overall || "No rating available",
        position: [hotel.latitude, hotel.longitude],
        imageCount: hotel.image_details.count,
        suffix: hotel.image_details.suffix,
        prefix: hotel.image_details.prefix,
        priceInfo: {
          lowest_price: priceInfo?.lowest_price || 0,
          price: priceInfo?.price || 0,
          converted_price: priceInfo?.converted_price || 0,
          market_rates: priceInfo?.market_rates || []
        }
      };
    })
    .filter(hotel => hotel.priceInfo.price > 0);

    cache.set(cacheKey, hotelsWithDetailsAndPrices); // Cache the combined response
    res.status(200).json(hotelsWithDetailsAndPrices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching hotel details and prices" });
  }
};

