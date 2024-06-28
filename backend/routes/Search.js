// handles search get requests 

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json('Search get request');
});

module.exports = router;