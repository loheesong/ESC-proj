import SearchBar from "./SearchBar"
import SearchDatePicker from "./SearchDatePicker";
import SearchNumberInput from "./SearchNumberInput";
import './SearchDestForm.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// TODO: remove console log from form child components after done  

function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function SearchForm(params) {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        searchBar: "",
        startDatePicker: "",
        endDatePicker: "",
        numGuests: "",
        numRooms: "",
    })

    // updates formData whenever any component in form changes value 
    const handleChange = (name, value) => {
        if (name === 'startDatePicker' || name == 'endDatePicker') {
            value = formatDate(value);
        }
        setFormData(prevData => ({
            // ... spread operator creates a copy of prevData  
            ...prevData,
            // computed property [name] evaluates name when name is accessed 
            [name]: value
        }));
    };

    // bind to submit butoon 
    const submitSearchForm = (e) => {
        e.preventDefault();
        console.log("submit pressed, form data = " + Object.values(formData));
        // make get request here 
        navigate(`/searchhotel/${formData.searchBar}`, { state: formData });
    };

    return (
        <div>
            <form className="search-form"
            onSubmit={submitSearchForm}>
                {/* onChange prop for all components inside the form sets the formData state everytime value is changed 
                when click on submit button, will submit formData values  
                */}
                <SearchBar onChange={(value) => handleChange('searchBar', value)}></SearchBar>
                <SearchDatePicker onChange={(value) => handleChange('startDatePicker', value)}></SearchDatePicker>
                <SearchDatePicker onChange={(value) => handleChange('endDatePicker', value)}></SearchDatePicker>
                <p>Number of guests</p>
                <SearchNumberInput onChange={(value) => handleChange('numGuests', value)}></SearchNumberInput>
                <p>Number of rooms</p>
                <SearchNumberInput onChange={(value) => handleChange('numRooms', value)}></SearchNumberInput>
                <button className="search-button" type="submit">
                    Submit
                </button>
            </form>
        </div>
    ) 
}
