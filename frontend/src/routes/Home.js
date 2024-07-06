import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SearchBar from '../components/SearchBar';

/** Page: Displays the home page of the app
 */
function Home() {
    const [info, setInfo] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:3001").then((response) => {
            console.log(response);
            setInfo(response.data);
        })
    }, [])

    return (
        <div className="App">
        <p>This is the home page</p>
        {info}
        <SearchBar></SearchBar>
        </div>
    );
}

export default Home