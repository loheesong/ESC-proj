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

// define test id for testing 
const SEARCH_BAR_ID = "searchbar"
const LOCATION_ERROR_ID = "locationError"
const START_DATE_ID = "startDatePicker"
const END_DATE_ID = "endDatePicker"
const DATE_ERROR_ID = "dateError"
const NUM_GUESTS_ID = "numGuests"
const NUM_ROOMS_ID = "numRooms"
const SUBMIT_BTN_ID = "submitButtonID"

function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function SearchForm() {
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

        if (startDate.isBefore(today, 'day')) {
            setDateError("Start date cannot be before today.")
            return 
        }
        if (startDate.isAfter(endDate, 'day')) {
            setDateError("Start date cannot be after today.")
            return 
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
                <SearchBar onChange={(val) => {setsearchBar(val); updateLocationError(val)}} data-testid={SEARCH_BAR_ID}/>

                {locationError && <p style={{ color: 'red' }} data-testid="locationError">{locationError}</p>}

                <SearchDatePicker value={startDate} minDate={today} maxDate={endDate}
                    onChange={(val) => { setstartDate(val); bothDateFilled(val,endDate) }} data-testid={START_DATE_ID}/>
                <SearchDatePicker value={endDate} minDate={startDate || today}
                    onChange={(val) => { setendDate(val); bothDateFilled(startDate,val) }} data-testid={END_DATE_ID}/>

                {dateError && <p style={{ color: 'red' }} data-testid={DATE_ERROR_ID}>{dateError}</p>}

                <p>Number of guests</p>
                <SearchNumberInput onChange={(val) => setnumGuest(val)} data-testid={NUM_GUESTS_ID}/>

                <p>Number of rooms</p>
                <SearchNumberInput onChange={(val) => setnumRoom(val)} data-testid={NUM_ROOMS_ID}/>

                <button className="search-button m-3" type="submit" data-testid={SUBMIT_BTN_ID}>
                    Submit
                </button>
            </form>
        </div>
    ) 
}
