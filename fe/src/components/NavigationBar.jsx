import React from 'react';
import './NavigationBar.css'; // Import the CSS file

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
        <button className="sign-in">Sign In</button>
      </div>
    </nav>
  );
};

export default NavigationBar;
