const express = require("express");
const router = express.Router();
const { getRoomPrices} = require("../controllers/RoomDisplayController");

// gives price for a given hotel id + destination id + stay + guests
// http://localhost:3001/rooms/diH7/prices?destination_id=WD0M&checkin=2024-10-01&checkout=2024-10-07&lang=en_US&currency=SGD&country_code=SG&guests=2&partner_id=1
router.get("/:id/prices", getRoomPrices);

module.exports = router;
