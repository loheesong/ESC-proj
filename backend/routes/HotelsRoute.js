const express = require("express");
const router = express.Router();
const {
  getHotelDetailsFromHotelID,
  getHotelsFromDestinationID,
  getHotelPricesByDestinationID,
  getHotelsWithDetailsAndPrices,
} = require("../controllers/HotelController");

// return hotels details based on hotelID
// localhost:3001/hotels/hotel?id=050G
router.get("/hotel", getHotelDetailsFromHotelID);

// returns list of hotel details based on hotel destination id
// localhost:3001/hotels/hotel/dest?destination_id=WD0M
router.get("/hotel/dest", getHotelsFromDestinationID);

// Returns list of possible hotel prices based on destination id, date of stay, guests and room.
// localhost:3001/hotels/filter?destination_id=WD0M&checkin=2024-10-01&checkout=2024-10-08&country_code=SG&guests=2|2&partner_id=1
router.get("/filter", getHotelPricesByDestinationID);

// localhost:3001/hotels/details?destination_id=WD0M&checkin=2024-10-01&checkout=2024-10-08&country_code=SG&guests=2|2&partner_id=1
router.get("/details", getHotelsWithDetailsAndPrices);

module.exports = router;
