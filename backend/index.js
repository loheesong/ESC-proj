/**
 * This file acts as the controller in the backend 
 * It serves information as required by the frontend through
 * API get requests to the specified route 
 */

// import statements 
const express = require('express')
const app = express() 
const cors = require('cors');
const searchRouter = require('./routes/Search');
const landingRouter = require('./routes/Landing');
const apiRouter = require('./routes/Api');

// constants here 
const PORT = 3001

app.use(cors());

// define routes here 
app.use("/search", searchRouter);
app.use("/", landingRouter);

// Utility endpoints here
app.use("/api", apiRouter);

app.listen(PORT, () => {
    console.log("Server running on port 3001");
})