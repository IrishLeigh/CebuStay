// MainContent.jsx

import React, { useState } from 'react';
import './MainContent.css';
import { MdBackHand, MdForward } from 'react-icons/md';
import Search from './Search';

const MainContent = () => {

    const [sidebarVisible, setSidebarVisible] = useState(true);

    const toggleSidebar = () => {
      setSidebarVisible(!sidebarVisible);
    };

    const accommodations = [
      {
        image: "/place2.jpeg",
        title: "Megaworld, Cebu",
        distance: "1,000 kilometers away",
        price: "₱1,400/night",
        type: "Hotel"
    },
 

   
  
    ];

  return (
    <div className="all-container">
      <Search />
      <div className="filter-buttons">
          <button className="filter-button" style={{ backgroundColor: '#16B4DD', color: 'Black', fontWeight:'500'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16B4DD'}
              onClick={() => handlePropertyTypeClick('Home')}
              >
              Home
          </button>
          <button className="btn-shiny4" 
              onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ADC939'}
              onClick={() => handlePropertyTypeClick('Hotel')}>
              Hotel
          </button>
          <button className="btn-shiny5" 
              onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#F9CC41'}
              onClick={() => handlePropertyTypeClick('Homestay')}>
              Homestay
          </button>
          <button className="btn-shiny6" 
              onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#EE414B'}
              onClick={() => handlePropertyTypeClick('Apartment')}>
              Apartment
          </button>
          <button className="btn-shiny7" 
              onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16B4DD'}
              onClick={() => handlePropertyTypeClick('Any')}>
              Others
          </button>

        {/* Add other filter buttons here */}
      </div>
      <div className="content-container">
        <div className="main-content" style={{marginRight:'30px'}}>
          {accommodations.map((accommodation, index) => (
            <div className="card" key={index}>
              <div className="card-img">
                <img src={accommodation.src} alt={accommodation.property_name} />
              </div>
              <div className="card-info">
                <p className="text-title">{accommodation.property_name}</p>
                <p className="text-body">{accommodation.property_desc}</p>
              </div>
              <div className="card-footer">
                <span className="text-title">{accommodation.property_type}</span>
                <div className="card-button">
                  <MdForward onClick={(e) => handleView(e, accommodation.propertyid)} />
                </div>
              </div>
            </div>

          ))}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
