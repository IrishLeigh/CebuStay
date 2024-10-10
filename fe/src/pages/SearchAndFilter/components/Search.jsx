import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../css/Search.css';
import { MdSearch } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BedIcon from '@mui/icons-material/Bed';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Search({ onSearch, accommodations, setAccommodationList }) {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [guestCapacity, setGuestCapacity] = useState('');
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();
    const suggestionsRef = useRef(null);
    const inputRef = useRef(null); // Reference for the input field

    const handleSearch = () => {
        console.log('Start Date:', startDate);
        console.log('End Date:', endDate);
        console.log('Guest Capacity:', guestCapacity);
        if (endDate === null || guestCapacity === "") {
            alert("Please select end date and enter guest capacity");
            return;
        }
        onSearch({ startDate, endDate, guestCapacity: guestCapacity || null });
    };

    // useEffect(() => {
    //     console.log('onSearch:', onSearch);
    //     console.log('Suggestions:', suggestions);
    //     console.log('Show Suggestions:', showSuggestions);
    // }, [query, suggestions, showSuggestions]);

    const fetchSuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/search?query=${query}`);
            const combinedSuggestions = [
                ...response.data.locations.map(loc => ({ type: 'Location', name: loc })),
                ...response.data.properties.map(prop => ({ type: 'Property', name: prop }))
            ];
            setSuggestions(combinedSuggestions);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setSuggestions([]);
        }
    };

    const today = new Date();
    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setQuery(inputValue);
        if (inputValue.length > 0) {
            fetchSuggestions(inputValue);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleClickOutside = (event) => {
        if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
            setShowSuggestions(false);
        }
    };



    const debouncedFetchResults = useCallback(debounce(fetchSuggestions, 300), []);

    useEffect(() => {
        if (query) {
            debouncedFetchResults(query);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }

        return () => {
            debouncedFetchResults.cancel();
        };
    }, [query]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.name.address || suggestion.name.property_name);
        setSuggestions([]);
        setShowSuggestions(false);
        if (suggestion.type === 'Location') {
            const filteredAccommodations = accommodations.filter(acc => acc.address === suggestion.name.address);
            setAccommodationList(filteredAccommodations);
        } else {
            const checkin_date = startDate;
            const checkout_date = endDate;
            const state = {
                guestCapacity,
                checkin_date,
                checkout_date
            };
            navigate(`property/${suggestion.name.propertyid}`, { state });
        }
    };
        // Disable scrolling when suggestions are shown
        useEffect(() => {
            if (showSuggestions) {
                document.body.style.overflow = 'hidden'; // Disable scrolling
            } else {
                document.body.style.overflow = ''; // Enable scrolling
            }

            return () => {
                document.body.style.overflow = ''; // Cleanup
            };
        }, [showSuggestions]);
        
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="m" style={{ width: '100%', marginTop: '2rem' }}>
                <div className="search-box" ref={inputRef}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <input
                            type="text"
                            placeholder="Search Destination"
                            className="input-field"
                            id="whereInput"
                            value={query}
                            onChange={handleInputChange}
                            onFocus={() => setShowSuggestions(true)}
                        />
                        {showSuggestions && query.length > 0 && suggestions.length > 0 && inputRef.current && (
                            <ul
                                className="suggestions-list"
                                style={{
                                    position: 'absolute',
                                    top: `${inputRef.current.getBoundingClientRect().bottom + window.scrollY}px`,
                                    left: `${inputRef.current.getBoundingClientRect().left}px`,
                                    zIndex: 10,
                                }}
                                ref={suggestionsRef}
                                role="listbox" // Added role for accessibility
                                aria-labelledby="suggestions" // Link to an aria-labelledby
                            >
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={suggestion.name.propertyid || index} // Use a unique id if available
                                        className="suggestion-item"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        role="option" // Role for list item
                                    >
                                        {suggestion.type === 'Location' ? (
                                            <LocationOnIcon className="location-icon" />
                                        ) : (
                                            <BedIcon className="location-icon" />
                                        )}
                                        <div className="suggestion-text">
                                            {suggestion.name.address || suggestion.name.property_name}
                                            <span className="suggestion-description">{suggestion.type}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <DatePicker
                        selected={startDate}
                        onChange={date => {
                            setStartDate(date);
                            if (endDate && date >= endDate) {
                                const adjustedEndDate = new Date(date);
                                adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
                                setEndDate(adjustedEndDate);
                            }
                        }}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        minDate={today}
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
                        minDate={new Date(startDate.getTime() + 24 * 60 * 60 * 1000)}
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
    onChange={e => {
        const value = Number(e.target.value); // Convert input to number
        // Only update the state if the value is a non-negative number
        if (value >= 0 || e.target.value === '') { // Allow empty string for clearing the input
            setGuestCapacity(e.target.value);
        }
    }}
/>

                    <button className="search-button" id="searchButton" onClick={handleSearch} style={{ height: '3rem' }}>
                        <MdSearch className="search-icon" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Custom debounce function
function debounce(func, wait) {
    let timeout;

    function debounced(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    }

    debounced.cancel = () => clearTimeout(timeout);

    return debounced;
}
