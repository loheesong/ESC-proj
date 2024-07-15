import './App.css';
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SearchHotel from './routes/SearchHotel';
import SearchRoom from './routes/SearchRoom';
import SearchDest from './routes/SearchDest';
import Home from "./routes/Home";
import DeleteBooking from './components/DeleteBooking';
import React from 'react';
import CreateBookingForm from "./components/CreateBookingForm";
import BookingConfirmed from './components/BookingConfirmed';

function App() {
    const [info, setInfo] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:3001").then((response) => {
            console.log(response);
            setInfo(response.data);
        });
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" 
                    element={
                        <div className="App">
                            {info}
                            <Home/>
                        </div>
                    } 
                />
                <Route path="/searchhotel/:uid" element={<SearchHotel />} />
                <Route path="/searchroom/:id" element={<SearchRoom />} />   
                <Route path='/search' element={<SearchDest/>}></Route>
                <Route path="/booking" element={<DeleteBooking />} />
                <Route path="/createbooking" element={<CreateBookingForm />} />
                <Route path="/booking-confirmed" element={<BookingConfirmed />} />
            </Routes>
        </Router> 
    );
}

export default App;
