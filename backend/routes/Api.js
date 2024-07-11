// Put all util API calls here, eg autocomplete for search 
const express = require('express');
const router = express.Router();
const dest = require('../models/dest');

const num_res = 5

// support autocomplete for search bar 
router.get('/autocomplete', async (req, res) => {
    // get query ?q=something
    const query = req.query.q;

    const query_results = await dest.partial_city(query, num_res)
    res.json(query_results);
});

module.exports = router;