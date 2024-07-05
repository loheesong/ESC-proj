import React, {useState} from 'react'
import './SearchBar.css'
import { FaSearch } from 'react-icons/fa'

const autocomplete_api = "http://localhost:3001/api/autocomplete?q="

/** Component: Search bar
 */
function SearchBar({setResults}) {
    // take in setResults as a prop 
    const [searchIn, setSearchIn] = useState("");

    // call api and set returned values to display in search results div 
    const fetchData = (value) => {
        console.log("Querying: " + value);
        fetch(autocomplete_api + value).then((res) => res.json()).then(json => {
            setResults(json);
        })
    }
    const handleChange = (value) => {
        setSearchIn(value)
        fetchData(value)
    }
    return (
        <div className='search-bar-container'>
            <div className="input-wrapper">
                <FaSearch></FaSearch>
                <input placeholder="Type to search" type="text" onChange={(e) => handleChange(e.target.value)}/>
            </div>
        </div>
    )
}

export default SearchBar