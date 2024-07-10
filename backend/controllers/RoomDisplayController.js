const axios = require("axios");
const html = require("html-escaper");
const striptags = require("striptags");

exports.getRoomPrices = async (req, res) => {
  const { id } = req.params;
  const {
    destination_id,
    checkin,
    checkout,
    lang,
    currency,
    country_code,
    guests,
    partner_id,
  } = req.query;

  if (
    !id ||
    !destination_id ||
    !checkin ||
    !checkout ||
    !lang ||
    !currency ||
    !country_code ||
    !guests ||
    !partner_id
  ) {
    return res.status(400).json({ error: "All parameters are required" });
  }

  const fetchRoomPrices = async () => {
    try {
      const response = await axios.get(
        `https://hotelapi.loyalty.dev/api/hotels/${id}/price`,
        {
          params: {
            destination_id,
            checkin,
            checkout,
            lang,
            currency,
            country_code,
            guests,
            partner_id,
          },
        }
      );

      if (!response.data.completed) {
        console.log("Search not completed. Retrying...");
        await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for 0.5 seconds before retrying
        return fetchRoomPrices();
      }

      return response.data.rooms;
    } catch (error) {
      throw new Error("An error occurred while fetching room prices");
    }
  };

  try {
    const roomPrices = await fetchRoomPrices();

    const allAmenities = roomPrices.flatMap((room) => room.amenities);
    const commonAmenities = [...new Set(allAmenities)].filter((amenity) =>
      roomPrices.every((room) => room.amenities.includes(amenity))
    );

    const formattedPrices = roomPrices.map((room, index) => {
      const description = room.long_description || room.description;
      const decodedDescription = html.unescape(description);
      const plainTextDescription = striptags(decodedDescription);
      const uniqueAmenities = room.amenities.filter(
        (amenity) => !commonAmenities.includes(amenity)
      );

      return {
        id: index + 1, // Using index for a unique id
        name: room.roomDescription,
        price: room.price,
        description: plainTextDescription,
        commonAmenities: commonAmenities,
        uniqueAmenities: uniqueAmenities,
        imgSrc:
          room.images.length > 0
            ? room.images[0].url
            : "https://via.placeholder.com/100", // Default image if none available
      };
    });

    res.status(200).json(formattedPrices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
