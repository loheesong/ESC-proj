import SearchBar from "./SearchBar"
import SearchDatePicker from "./SearchDatePicker";
import SearchNumberInput from "./SearchNumberInput";
import './SearchDestForm.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)

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

    // bind to submit butoon 
    const submitSearchForm = (e) => {
        e.preventDefault();

        console.log("submit pressed");

        // location validation 
        if (searchBar == null) {
            setlocationError("Please input location")
            return
        }

        // date validation 
        if (!startDate || !endDate) {
            setDateError('Both start and end dates are required.');
            return;
        } else if (startDate && endDate) { 
            setDateError("")
        }

        // prepare formData 
        let formData = {
            searchBar: searchBar,
            startDatePicker: formatDate(startDate),
            endDatePicker: formatDate(endDate),
            numGuests: numGuest,
            numRooms: numRoom,
        }

        console.log("formData: " + formData);

        // make get request here 
        navigate(`/searchhotel/${formData.searchBar}`, { state: formData });
    };

    // logic for SearchBar 
    const [searchBar, setsearchBar] = useState(null)
    const [locationError, setlocationError] = useState("")
    // update locationError message when user search for valid location 
    const updateLocationError = (v) => { if (v) setlocationError("") }

    // logic for DatePicker 
    const today = dayjs()
    const [startDate, setstartDate] = useState(null)
    const [endDate, setendDate] = useState(null)
    const [dateError, setDateError] = useState("")
    // update dateError message when both filled 
    const bothDateFilled = (startDate, endDate) => { if (startDate && endDate) setDateError("") }

    // logic for num guest 
    const [numGuest, setnumGuest] = useState(1)

    // logic for num guest 
    const [numRoom, setnumRoom] = useState(1)

    return (
        <div>
            <form className="search-form"
            onSubmit={submitSearchForm}>
                {/* onChange prop for all components inside the form sets the formData state everytime value is changed 
                when click on submit button, will submit formData values  
                */}
                <SearchBar onChange={(val) => {setsearchBar(val); updateLocationError(val)}}/>

                {locationError && <p style={{ color: 'red' }}>{locationError}</p>}

                <SearchDatePicker value={startDate} minDate={today} maxDate={endDate}
                    onChange={(val) => { setstartDate(val); bothDateFilled(val,endDate) }}/>
                <SearchDatePicker value={endDate} minDate={startDate || today}
                    onChange={(val) => { setendDate(val); bothDateFilled(startDate,val) }}/>

                {dateError && <p style={{ color: 'red' }}>{dateError}</p>}

                <p>Number of guests</p>
                <SearchNumberInput onChange={(val) => setnumGuest(val)}/>

                <p>Number of rooms</p>
                <SearchNumberInput onChange={(val) => setnumRoom(val)}/>

                <button className="search-button" type="submit">
                    Submit
                </button>
            </form>
        </div>
    ) 
}
