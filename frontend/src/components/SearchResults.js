import React from 'react'
import './SearchResults.css'

/** Search bar suggestions based on whats typed
 */
function SearchResults({results}) {
  return (
    <div className="results-list">
        {
            results.map((result, id) => {
                return <div key={id} className='search-result' onClick={(e) => alert(`Clicked on ${result.name}`)}>{result.name}</div>; // can be turned into a component 
            })
        }
    </div>
  )
}

export default SearchResults