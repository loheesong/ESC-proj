// import for packages 
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

// import page components 
import SearchHotel from './routes/SearchHotel';
import SearchRoom from './routes/SearchRoom';
import Home from "./routes/Home"
import Register from "./routes/Register";

import './App.css';

import AuthService from "./services/AuthService";

function App() {
    const [info, setInfo] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:3001").then((response) => {
            console.log(response);
            setInfo(response.data);
        })
    }, []);

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
    
        // EventBus.on("logout", () => {
        //   logOut();
        // });
    
        // return () => {
        //   EventBus.remove("logout");
        // };
      }, []);
    
      const logOut = () => {
        AuthService.logout();
        setShowModeratorBoard(false);
        setShowAdminBoard(false);
        setCurrentUser(undefined);
    };
    
    return (
        <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          Demo Site
        </Link>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/home"} className="nav-link">
              Home
            </Link>
          </li>

          {showModeratorBoard && (
            <li className="nav-item">
              <Link to={"/mod"} className="nav-link">
                Moderator Board
              </Link>
            </li>
          )}

          {showAdminBoard && (
            <li className="nav-item">
              <Link to={"/admin"} className="nav-link">
                Admin Board
              </Link>
            </li>
          )}

          {currentUser && (
            <li className="nav-item">
              <Link to={"/user"} className="nav-link">
                Bookings
              </Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>

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
                <Route path="/register" element={<Register />} />   
            </Routes>

        </div>
    );
}

export default App;
