import React, {useState} from 'react'
import './SearchBar.css'
import { FaSearch } from 'react-icons/fa'

/** Component: Search bar
 */
function SearchBar({setResults}) {
    // take in setResults as a prop 
    const [searchIn, setSearchIn] = useState("");
    const fetchData = (value) => {
        fetch("https://jsonplaceholder.typicode.com/users").then((res) => res.json()).then(json => {
            const result = json.filter((user) => {
                return (
                    value && 
                    user && 
                    user.name && 
                    user.name.toLowerCase().includes(value))
            })
            console.log(result);
            setResults(result);
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