// routes/SearchDestinationRoute.js

const express = require("express");
const {searchDestination} = require("../controllers/SearchDestinationController");
const router = express.Router();

// returns uid to use in hotels route when using name of place to search
// http://localhost:3001/destinations?term=Rome%2C%20Italy
router.get('/', searchDestination);


http: module.exports = router;
