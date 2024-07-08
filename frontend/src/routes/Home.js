import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SearchBar from '../components/SearchBar';

/** Page: Displays the home page of the app
 */
function Home() {
    return (
        <div className="App">
        <p>This is the home page</p>
        <SearchBar></SearchBar>
        </div>
    );
}

export default Home