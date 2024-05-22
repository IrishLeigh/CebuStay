import React, { useState } from 'react';
import './Explore.css';
import { MdForward } from 'react-icons/md';

const CityButton = ({ children, onClick }) => (
  <button className="btn-shiny3" onClick={onClick}>
    {children}
  </button>
);

export const cityData = {
  "House": {
    title: "House",
    description: "A cozy home for your stay. Enjoy comfort and privacy.",
    price: "$99.99",
    image: "/sirao.png" // Added image for House
  },
  "Hotel": {
    title: "Hotel",
    description: "Luxurious accommodation with excellent amenities and services.",
    price: "$199.99",
    image: "/sirao.png" // Added image for Hotel
  },
  "Homestay": {
    title: "Homestay",
    description: "Experience local hospitality and culture firsthand.",
    price: "$149.99",
    image: "/sirao.png" // Added image for Homestay
  },
  "Apartment": {
    title: "Apartment",
    description: "Modern living space with all the comforts of home.",
    price: "$179.99",
    image: "/sirao.png" // Added image for Apartment
  },
  "Others": {
    title: "Others",
    description: "Explore unique lodging options tailored to your preferences.",
    price: "$129.99",
    image: "/sirao.png" // Added image for Others
  },
};

const cityButtonsData = Object.keys(cityData);

function Explore() {
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCityClick = (city) => {
    console.log(`Clicked on city: ${city}`);
    setSelectedCity(cityData[city]);
  };

  return (
    <>
      <main className="main-container">
        <h1 className="title" style={{textAlign:'center'}}>Explore Popular Cities</h1>
        <p className="description" style={{textAlign:'center'}}>
          Embark on a journey to discover stunning cities, rich cultures, and hidden gems.
          <br/> 
          Let us help you create unforgettable experiences and memories that will last a lifetime.
        </p>
        <div className="city-buttons-container" style={{alignSelf:'center'}}>
          {cityButtonsData.map((button, index) => (
            <CityButton
              key={index}
              onClick={() => handleCityClick(button)}
            >
              {button}
            </CityButton>
          ))}
        </div>  
        <div className="image-container">
          <img className="map-image" alt="" src="/cebu.png" style={{ width: "400px", height: "800px"}}/>
          {selectedCity && (
            <div className="card-container" style={{marginLeft:'65rem'}}>
              <div className="card-img">
                <img src={selectedCity.image} alt="" style={{ width: "100%", height: "100%", borderRadius: "0.5rem" }} />
              </div>
              <div className="card-info">
                <p className="text-title">{selectedCity.title}</p>
                <p className="text-body">{selectedCity.description}</p>
              </div>
              <div className="card-footer">
                <span className="text-title">{selectedCity.price}</span>
                <div className="card-button">
                  <MdForward/>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Explore;
