import SearchBar from "./SearchBar"
import SearchDatePicker from "./SearchDatePicker";
import SearchNumberInput from "./SearchNumberInput";

function SearchForm(params) {
    return (
        <div>
            <SearchBar></SearchBar>
            <SearchDatePicker></SearchDatePicker>
            <SearchNumberInput></SearchNumberInput>
        </div>
    ) 
}

export default SearchForm