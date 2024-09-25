import React from 'react';
import './Footer.css';
import { Box } from '@mui/material';

const Footer = () => {
  return (
    <Box>
      <div className="footer-background"></div>
      <div className="footer-container">
   
        <div className="footer-logo">
          <img src="/Logo2.png" alt="Booking Website Logo" /> {/* Accessing logo from public folder */}
        </div>
        <div className="footer-section">
          <h4>About Us</h4>
          <p>We provide the best accommodation booking service to ensure you have a pleasant stay wherever you go.</p>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: support@bookingwebsite.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#" className="social-icon">FB</a>
            <a href="#" className="social-icon">TW</a>
            <a href="#" className="social-icon">IN</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Cebustay Website. All rights reserved.</p>
      </div>
    </Box>
  );
}

export default Footer;
