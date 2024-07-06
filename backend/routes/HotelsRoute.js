const express = require("express");
const router = express.Router();
const {getHotelDetailsFromHotelID , getHotelsFromDestinationID,
  getHotelPricesByDestinationID,} = require("../controllers/hotelController");

// return hotels details based on hotelID
// localhost:3001/hotels/050G
router.get("/:id", getHotelDetailsFromHotelID);

// returns list of hotel details based on hotel destination id
// localhost:3001/hotels?destination_id=WD0M
router.get("/", getHotelsFromDestinationID);

// Returns list of possible hotel prices based on destination id, date of stay, guests and room.
// localhost:3001/hotels/prices?destination_id=WD0M&checkin=2024-10-01&checkout=2024-10-08&country_code=SG&guests=2|2&partner_id=1
router.get("/prices", getHotelPricesByDestinationID);

// Returns list of 

module.exports = router;
