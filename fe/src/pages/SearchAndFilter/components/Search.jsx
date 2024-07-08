import React, { useState } from 'react';
import '../css/Search.css';
import { MdSearch } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function Search({ onSearch }) {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [guestCapacity, setGuestCapacity] = useState('');
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleSearch = () => {
        onSearch({ startDate, endDate, guestCapacity: guestCapacity || null });
    };

    const fetchSuggestions = async (input) => {
        // Mock function to simulate fetching suggestions
        const mockSuggestions = ['Laris', 'Lew York', 'London', 'Lolo', 'Love', 'Lokyo'];
        setSuggestions(mockSuggestions.filter(s => s.toLowerCase().includes(input.toLowerCase())));
    };

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setQuery(inputValue);
        if (inputValue.length > 0) {
            fetchSuggestions(inputValue);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        setSuggestions([]);
    };

    return (
        <div>
            <div className="max-w-4xl mx-auto p-4" style={{ width: '71rem', marginTop: '2rem' }}>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search Destination"
                        className="input-field"
                        id="whereInput"
                        value={query}
                        onChange={handleInputChange}
                    />
                    {/* <div className="suggestions-container"> */}
                        {suggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className="suggestion-item"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        <LocationOnIcon className="location-icon" />
                                        <div className="suggestion-text">
                                            {/* //Add here ludi replace lang suggestions ug kanang span  */}
                                            {suggestion}
                                            <span className="suggestion-description">Here something</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    {/* </div> */}
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
                        minDate={startDate}
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
                    <button className="search-button" id="searchButton" onClick={handleSearch} style={{ height: '3rem' }}>
                        <MdSearch className="search-icon" />
                    </button>
                </div>
            </div>
        </div>
    );
}
