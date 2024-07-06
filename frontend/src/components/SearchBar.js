import React, {useState} from 'react'
import './SearchBar.css'
import { FaSearch } from 'react-icons/fa'
import SearchResults from './SearchResults';
import axios from 'axios';

const autocomplete_api = "http://localhost:3001/api/autocomplete?q="
const search_endpoint = "http://localhost:3001/search?q="

/** Component: Search bar
 */
function SearchBar() {
    const [results, setResults] = useState([]);
    const [searchIn, setSearchIn] = useState("");

    // call api and set returned values to display in search suggestions div 
    const fetchData = (value) => {
        console.log("Querying: " + value);
        axios.get(autocomplete_api + value).then((res) => { 
            setResults(res.data)
        })
    }

    // make get request for search destination 
    const searchGetRequest = (uid) => { 
        axios.get(search_endpoint + uid).then((res) => { 
            console.log("response from search get: "+res.data);
        })
    }

    // get req for search suggestions  
    const handleChange = (value) => {
        setSearchIn(value)
        fetchData(value)
    }

    // support enter to search 
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') searchGetRequest(searchIn)
    };
    
    // pass fn as prop to child component SearchResults, support click to search 
    const handleResultClick = (term, uid) => {
        setSearchIn(term);
        searchGetRequest(uid);
    };

    return (
        <div className='search-bar-container'>
            <div className="input-wrapper">
                <FaSearch></FaSearch>
                <input placeholder="Type to search" 
                    type="text" 
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={handleKeyDown}/>
            </div>
            <SearchResults results={results} onResultClick={handleResultClick}></SearchResults>
        </div>
    )
}

export default SearchBar