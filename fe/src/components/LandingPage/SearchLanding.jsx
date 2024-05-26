// Search.jsx
import React, { useState } from 'react';
import './SearchLanding.css';
import { MdSearch } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { Link} from 'react-router-dom';


export default function Search({onSearch}) {
    const [startDate, setStartDate] = useState(new Date()); // Default today's date for "From"
    const [endDate, setEndDate] = useState(null); // Initialize "To" date as null
    const [guestCapacity, setGuestCapacity] = useState(''); // State for guest capacity

    const handleSearch = () => {
        // Pass null for guestCapacity if the input is empty
        onSearch({ startDate, endDate, guestCapacity: guestCapacity || null });
    };
    
  

    const navigate = useNavigate();

    
    return (
        
            <div className="max-w-4xl mx-auto p-4">
                <div className="search-box">
                    <input type="text" placeholder="Search Destination" className="input-field" id="whereInput" />
                    {/* Datepicker for "From" */}
                    <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="From"
                        className="input-field"
                        id="dateInputFrom"
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate} // Disable selection of dates before "From"
                        placeholderText="To"
                        className="input-field"
                        id="dateInputTo"
                    />
                    <input
                        type="number"
                        placeholder="Add Guest"
                        className="input-field"
                        id="guestInput"
                        value={guestCapacity}
                        onChange={e => setGuestCapacity(e.target.value)}
                    />
                    <button className="search-button" id="searchButton" >
                        <Link to="accommodation"><MdSearch className="search-icon" /></Link>
                    </button>
                </div>
            </div>
        
    );
}
