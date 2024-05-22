import React, { useState } from 'react';
import './Landing.css';
import Search from '../Search';
import SearchLanding from './SearchLanding';

function LocationSearch({ location, handleLocationChange }) {
  return (
    <div className="location-search">
      <label htmlFor="location-input" className="location-label">
        Location
      </label>
      <input
        id="location-input"
        type="text"
        value={location}
        onChange={handleLocationChange}
        placeholder="Search For A Destination"
        className="location-input"
      />
    </div>
  );
}
function BackgroundShape() {
  return (
    <>
      <svg className="background-shape background-shape-left" viewBox="0 0 600 250" preserveAspectRatio="none">
        <path d="M0,250 Q300,0 600,250 L600,0 L0,0 Z" fill="lightblue" />
      </svg>
      <svg className="background-shape background-shape-right" viewBox="0 0 600 250" preserveAspectRatio="none">
        <path d="M0,0 L600,0 Q300,125 0,250 Z" fill="lightblue" />
      </svg>
    </>
  );
}






function GuestsSearch({ guests, handleGuestsChange }) {
  return (
    <div className="guests-search">
      <label htmlFor="guests-input" className="guests-label">
        Guests
      </label>
      <input
        id="guests-input"
        type="number"
        value={guests}
        onChange={handleGuestsChange}
        placeholder="How many Guests?"
        className="guests-input"
      />
    </div>
  );
}

function DateSearch({ date, handleDateChange }) {
  return (
    <div className="date-search">
      <label htmlFor="date-input" className="date-label">
        Date
      </label>
      <input
        id="date-input"
        type="date"
        value={date}
        onChange={handleDateChange}
        placeholder="Pick a date"
        className="date-input"
      />
    </div>
  );
}

function SearchDivider() {
  return <div className="search-divider" />;
}

function Landing() {
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState("");
  const [date, setDate] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleGuestsChange = (event) => {
    setGuests(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  // const handleSearch = async () => {
  //   const { data, error } = await supabase
  //    .from('your-table-name')
  //    .select('*')
  //    .lte('date', date)
  //    .gte('guests', guests)
  //    .ilike('location', `%${location}%`);

  //   if (error) {
  //     console.error('Error fetching search results:', error);
  //   } else {
  //     setSearchResults(data);
  //   }
  // };

  return (
    <>
      <div className="container">
      <BackgroundShape />
        <div className="hero-content">
          <div className="text-overlay">  
            <h1 className="hero-title">We Find The Best Tours For You</h1>
            <p className="hero-description">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
              sint. Velit officia consequat duis enim velit mollit. Exercitation
              veniam consequat sunt nostrud amet.
            </p>
          </div>
          <img src="/oslobph.png" alt="" className="hero-image" loading="lazy" 
               style={{ width: "1300px", height: "600px"}}/>
        </div>
          
          <SearchLanding />
        
        {searchResults && (
          <div className="search-results">
            <h2>Search Results:</h2>
            <ul>
              {searchResults.map((result, index) => (
                <li key={index}>
                  <strong>{result.name}</strong> - {result.location}, Guests: {result.guests}, Date: {result.date}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default Landing;