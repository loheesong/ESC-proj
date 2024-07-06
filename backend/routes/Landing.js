// provides information for the landing page

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json("Landing info");
});

module.exports = router;
