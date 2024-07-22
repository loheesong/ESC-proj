import React, {useRef, useState} from 'react'
import { FaSearch } from 'react-icons/fa'
import axios from 'axios';
import './SearchBar.css'

const autocomplete_api = "http://localhost:3001/api/autocomplete?q="

/** Component: Search bar
 */
function SearchBar({onChange, 'data-testid': testID}) {
    const [results, setResults] = useState([]) // 5 results suggestion 
    const [searchIn, setSearchIn] = useState("") // whatever is typed in search bar 
    const uid = useRef(null) // update uid immediate since this value is not used for rendering 

    // call api and set returned values to display in search suggestions div 
    const fetchData = (value) => {
        console.log("Querying: " + value);
        axios.get(autocomplete_api + value).then((res) => { 
            setResults(res.data)
        })
    }

    // get req for search suggestions  
    const handleChange = (value) => {
        setSearchIn(value)
        if (value === "") {
            uid.current = null 
            onChange(uid.current) // update formData in parent component with uid for GET req 
        }
        console.log(uid.current);
        fetchData(value)
    }

    // pass fn as prop to child component SearchResults
    const handleResultClick = (term, id) => {
        setSearchIn(term); // update value in input field 
        uid.current = id // update associated uid 
        onChange(uid.current) // update formData in parent component with uid for GET req 
    };

    return (
        <div className='search-bar-container'>
            <div className="input-wrapper">
                <FaSearch></FaSearch>
                <input placeholder="Where to" type="text"  value={searchIn}
                    onChange={(e) => {handleChange(e.target.value)}} data-testid={testID}/>
            </div>
            <SearchResults results={results} onResultClick={handleResultClick}></SearchResults>
        </div>
    )
}

function SearchResults({results, onResultClick}) {
    return (
        <div className="results-list" data-testid="results-list">
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