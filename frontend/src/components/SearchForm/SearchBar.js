import React, {useState} from 'react'
import { FaSearch } from 'react-icons/fa'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css'

const autocomplete_api = "http://localhost:3001/api/autocomplete?q="

/** Component: Search bar
 */
function SearchBar() {
    const [results, setResults] = useState([]);
    const [searchIn, setSearchIn] = useState("");
    const navigate = useNavigate();

    // call api and set returned values to display in search suggestions div 
    const fetchData = (value) => {
        console.log("Querying: " + value);
        axios.get(autocomplete_api + value).then((res) => { 
            setResults(res.data)
        })
    }

    // make get request for search destination 
    const searchGetRequest = (uid) => { 
        navigate(`/searchhotel/${uid}`);
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

function SearchResults({results, onResultClick}) {
    return (
        <div className="results-list">
            {   // must have unique id, put destination uid in key 
                results.map((result, id) => {
                    return (
                        <div key={result.uid} 
                            className='search-result' 
                            onClick={() => onResultClick(result.term, result.uid)}>
                                {result.term}
                        </div>
                    );
                })
            }
        </div>
    )
}

export default SearchBar