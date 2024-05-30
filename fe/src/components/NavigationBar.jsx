import React from 'react';
// import './NavigationBar.css';

const NavigationBar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="logo.png" alt="Logo" /> {/* Replace "your-logo.png" with your actual logo */}
      </div>
      <div className="navbar-text">
        <a href="#">Home</a>
        <a href="#">About Us</a>
        <a href="#">Popular Destinations</a>
        <a href="#">Our Packages</a>
        <a href="/login"> {/* Link to your login page */}
          <button className="sign-in">Sign In</button>
        </a>
      </div>
    </nav>
  );
};

export default NavigationBar;
