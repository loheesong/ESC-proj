// handles search get requests 

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const query = req.query.q;
    console.log(query);
    res.json(query);
});

module.exports = router;
