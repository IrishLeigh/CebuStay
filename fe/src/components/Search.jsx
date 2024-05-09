// Search.jsx
import React, { useState } from 'react';
import './Search.css';
import { MdSearch } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Search() {
    const [startDate, setStartDate] = useState(new Date()); // Default today's date for "From"
    const [endDate, setEndDate] = useState(null); // Initialize "To" date as null

    return (
        <div className="search-container">
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
                    {/* Datepicker for "To" */}
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
                    <input type="number" placeholder="Add Guest" className="input-field" id="guestInput" />
                    <button className="search-button" id="searchButton">
                        <MdSearch className="search-icon" />
                    </button>
                </div>
            </div>
        </div>
    );
}
