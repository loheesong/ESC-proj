import './App.css';
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SearchHotel from './routes/SearchHotel';
import SearchRoom from './routes/SearchRoom';
import Home from "./routes/Home"
import BookingForm from "./routes/BookingForm";

function App() {
    const [info, setInfo] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:3001").then((response) => {
            console.log(response);
            setInfo(response.data);
        })
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
                <Route path="/booking" element={<BookingForm />} />    
            </Routes>
        </Router>
    );
}

export default App;
