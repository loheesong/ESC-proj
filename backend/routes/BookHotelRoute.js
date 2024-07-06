const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("payment");
});

module.exports = router;
