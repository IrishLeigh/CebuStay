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
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16B4DD'}>
              House
          </button>
          <button className="filter-button" style={{ backgroundColor: '#ADC939', color: 'Black', fontWeight:'500' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ADC939'}>
              Hotel
          </button>
          <button className="filter-button" style={{ backgroundColor: '#F9CC41', color: 'Black', fontWeight:'500'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#F9CC41'}>
              Homestay
          </button>
          <button className="filter-button" style={{ backgroundColor: '#EE414B', color: 'Black', fontWeight:'500' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#EE414B'}>
              Apartment
          </button>
          <button className="filter-button" style={{ backgroundColor: '#16B4DD', color: 'Black', fontWeight:'500' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'aqua'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16B4DD'}>
              Others
          </button>
      </div>
      <div className="content-container">
        <div className="main-content" style={{marginRight:'30px'}}>
          {accommodations.map((accommodation, index) => (
            <div className="card" key={index}>
              <div className="card-img">
                <img src={accommodation.image} alt={accommodation.title} />
              </div>
              <div className="card-info">
                <p className="text-title">{accommodation.title}</p>
                <p className="text-body">{accommodation.distance}</p>
              </div>
              <div className="card-footer">
                <span className="text-title">{accommodation.price}</span>
                <div className="card-button">
                  <MdForward />
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
