import React from 'react';
import './Popular.css';

function Popular() {
  const handleViewAllClick = () => {
    
  };

  const handleHotelClick = () => {
    
  };

  const handleHomeStayClick = () => {
    
  };

  const handleGuesthouseClick = () => {
    
  };

  const handleReviewClick = () => {
    
  };

  return (
    <div className="div">
      <div className="div-2">
        <div className="div-3">Popular Places</div>
        <div className="div-4">
          <button className="div-5" onClick={handleHotelClick}>
            Hotel
          </button>
          <button className="div-6" onClick={handleHomeStayClick}>
            Home Stay
          </button>
          <button className="div-7" onClick={handleGuesthouseClick}>
            Guesthouse
          </button>
          <button className="div-8" onClick={handleViewAllClick}>
            View All
          </button>
        </div>
      </div>
      <div className="div-9">
        <div className="div-10">
         
          
          <div class="cards" >
    <div class="card red">
        <p class="tip">Hover Me</p>
        <p class="second-text">Lorem Ipsum</p>
    </div>
    <div class="card blue">
        <p class="tip">Hover Me</p>
        <p class="second-text">Lorem Ipsum</p>
    </div>
    <div class="card green">
        <p class="tip">Hover Me</p>
        <p class="second-text">Lorem Ipsum</p>
    </div>
</div>
        </div>
      </div>
    </div>
  );
}

export default Popular;
