import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Booking = () => {
    const [bookings, setBookings] = useState([])

    useEffect(()=>{
        const fetchAllBookings = async()=>{ //making an API request from the backend
        try{
            const res = await axios.get("http://localhost:3001/booking");
            console.log("Data received:", res.data); // Add this line
            setBookings(res.data);
        }catch(err){
            console.log(err);
        }
        }
        fetchAllBookings()
    }, [])

  const handleDelete = async (id)=> {
    try{
        await axios.delete(`http://localhost:3001/booking/${id}` );
        window.location.reload();
    }catch(err){
        console.log(err);
    }
  }

 
  return <div>
    <h1>Ascenda Booking</h1>
    <div className="bookings">
        {bookings.map((booking) => (
            <div className="booking" key={booking.id}>
                {booking.cover && <img src = {booking.cover} alt = "" />}
                <h2>{booking.title}</h2>
                <p>{booking.description}</p>
                <span>{booking.price}</span>
                <button className="delete" onClick={() => handleDelete(booking.id)}>Delete</button>
                <button className="update"><Link to = {`/update/${booking.id}`}>Update</Link></button>
                </div>
                ))}

     </div>
     <button>
        <Link to="/add">Add new booking</Link>
     </button>
    </div>;
   
};

export default Booking;
