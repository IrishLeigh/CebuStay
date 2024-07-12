import React, { useState, useEffect, useCallback } from 'react';
import '../css/Search.css';
import { MdSearch } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BedIcon from '@mui/icons-material/Bed';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Search({ onSearch, accommodations, setAccommodationList  }) {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [guestCapacity, setGuestCapacity] = useState('');
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();
    const handleSearch = () => {
        onSearch({ startDate, endDate, guestCapacity: guestCapacity || null });
    };

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
            // console.log('Search results:', combinedSuggestions);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setSuggestions([]);
        }
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

    const debouncedFetchResults = useCallback(debounce(fetchSuggestions, 300), []);
    useEffect(() => {
        
        if (query) {
            debouncedFetchResults(query);
        } else {
            setSuggestions([]);
        }

        return () => {
            debouncedFetchResults.cancel();
        };
    }, [query]);

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.name.address || suggestion.name.property_name);
        setSuggestions([]); // Force clearing the suggestions list
        console.log('Suggestion clicked:', suggestion);
        if(suggestion.type === 'Location') {
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
            navigate(`/accommodation/property/${suggestion.name.propertyid}`, { state });
        }
    };
    

    return (
        <div>
            <div className="max-w-4xl mx-auto p-4" style={{ width: '71rem', marginTop: '2rem' }}>
                <div className="search-box">
                    <div style={{ display: 'flex', alignItems: 'column',  }}>
                    <input
                        type="text"
                        placeholder="Search Destination"
                        className="input-field"
                        id="whereInput"
                        value={query}
                        onChange={handleInputChange}
                    />
                    
                    {suggestions.length > 0 && (
                         <ul className="suggestions-list"  style={{ top: '12rem' }}>
                         {suggestions.map((suggestion, index) => (
                             <li
                                 key={index}
                                 className="suggestion-item"
                                 
                                 onClick={() => handleSuggestionClick(suggestion)}
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
