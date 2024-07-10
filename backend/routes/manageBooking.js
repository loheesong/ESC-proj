import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Add from "./pages/Add";
import Booking from "./pages/booking";
import Update from "./pages/Update";
import "./style.css"



function manageBooking() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route path = "/" element = {<Navigate to = "/booking" />}/>
          <Route path = "/booking" element = {<Booking/>}/>
          <Route path = "/add" element = {<Add/>}/>
          <Route path = "/update/:id" element = {<Update/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
