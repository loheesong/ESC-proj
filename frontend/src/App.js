import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

// Import page components
import SearchHotel from './routes/SearchHotel';
import SearchRoom from './routes/SearchRoom';
import Home from "./routes/Home";
import Register from "./routes/Register";
import EventBus from "./services/EventBus";
import Login from "./routes/Login";
import Profile from "./routes/Profile";
import DisplayBooking from "./routes/DisplayBooking";
import BookingForm from "./routes/BookingForm";
import AuthService from "./services/AuthService";
import './App.css';

function App() {
    // user stuff
    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);
    
    useEffect(() => {
        const user = AuthService.getCurrentUser();
    
        if (user) {
          setCurrentUser(user);
          setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
          setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
        }
    
        EventBus.on("logout", () => {
          logOut();
        });
    
        return () => {
          EventBus.remove("logout");
        };
    }, []);
    
    const logOut = () => {
        setTimeout(() => {
            AuthService.logout();
        });
        setShowModeratorBoard(false);
        setShowAdminBoard(false);
        setCurrentUser(undefined);
    };

    return (
            <div>
                <nav className="navbar navbar-expand navbar-dark bg-dark p-3">
                    <Link to={"/"} className="navbar-brand">Destination EZ</Link>
                    <div className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to={"/"} className="nav-link">Home</Link>
                        </li>

                        {showModeratorBoard && (
                            <li className="nav-item">
                                <Link to={"/mod"} className="nav-link">Moderator Board</Link>
                            </li>
                        )}

                        {showAdminBoard && (
                            <li className="nav-item">
                                <Link to={"/admin"} className="nav-link">Admin Board</Link>
                            </li>
                        )}

                        {currentUser && (
                            <li className="nav-item">
                                <Link to={"/displaybooking"} className="nav-link">Bookings</Link>
                            </li>
                        )}
                    </div>

                    {currentUser ? (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to={"/profile"} className="nav-link">{currentUser.username}</Link>
                            </li>
                            <li className="nav-item">
                                <a href="/login" className="nav-link" onClick={logOut}>LogOut</a>
                            </li>
                        </div>
                    ) : (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to={"/login"} className="nav-link">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={"/register"} className="nav-link">Sign Up</Link>
                            </li>
                        </div>
                    )}
                </nav>

                <Routes>
                    <Route path="/" element={<div className="App"><Home /></div>} />
                    <Route path="/searchhotel/:uid" element={<SearchHotel />} />
                    <Route path="/searchroom/:id" element={<SearchRoom />} />
                    <Route path="/register" element={<Register />} />   
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/displaybooking" element={<DisplayBooking />} />    
                    <Route path="/booking" element={<BookingForm />} />    
                </Routes>
            </div>
    );
}

export default App;
