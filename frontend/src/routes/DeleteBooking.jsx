import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Update = () => {
  const [booking, setBooking] = useState({
    title: "",
    description: "",
    cover: "",
    price: null
  });

  const navigate = useNavigate()


  const handleChange = (e) => {
    setBooking((prev) => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleClick = async (e) => {
    e.preventDefault()
    try{
      await axios.put("http://localhost:3001/booking", booking)
      navigate("/booking");
    } catch (err) {
      console.log(err)
    }

  };
  console.log(booking)
  return (
    <div className = 'form'>
      <h1> Update the Booking</h1>
      <input type = "text" placeholder = 'Name'  onChange = {handleChange}   name = "title"/>
      <input type = "text" placeholder = 'Description'  onChange = {handleChange} name = "description"/>
      <input type = "text" placeholder = 'cover' onChange = {handleChange} name = "cover"/>
      <input type = "number" placeholder = 'Budget'  onChange = {handleChange} name = "price"/>
      <button className = "formButton" onClick = {handleClick}>Update</button>
    </div>
  );
};

export default Update;
