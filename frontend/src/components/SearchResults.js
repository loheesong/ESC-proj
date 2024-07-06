import React from 'react'
import './SearchResults.css'

/** Search bar suggestions based on whats typed
 */
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

export default SearchResults