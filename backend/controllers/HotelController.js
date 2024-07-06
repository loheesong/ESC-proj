const axios = require("axios");

exports.getHotelDetailsFromHotelID = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Hotel ID is required" });
  }

  try {
    const response = await axios.get(
      `https://hotelapi.loyalty.dev/api/hotels/${id}`
    );
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
    }));

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
    const prices = response.data;
    const hotelsPrices = prices.hotels.map((hotel) => ({
      id: hotel.id,
      lowest_price: hotel.lowest_price,
      price: hotel.price,
      converted_price: hotel.converted_price,
      market_rates: hotel.market_rates.rate,
    }));

    res.status(200).json(hotelsPrices);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching hotel prices" });
  }
};
