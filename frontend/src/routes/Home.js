import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';

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

    // from the tutorial 
    const [results, setResults] = useState([]);

    return (
        <div className="App">
        <p>This is the home page</p>
        {info}
        <SearchBar setResults={setResults}></SearchBar>
        <SearchResults results={results}></SearchResults>
        </div>
    );
}

export default Home